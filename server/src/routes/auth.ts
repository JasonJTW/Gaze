import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { registerValidation, loginValidation } from "../validation";
import mysql, { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import { number } from "joi";
import cookieParser from "cookie-parser";

const jwtSecretAccessToken = process.env.JWT_ACCESS_TOKEN_SECRET as string;

const db = mysql
  .createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Increase the connection pool size if necessary
    idleTimeout: 10000, // 30 seconds acquisition timeout
    connectTimeout: 10000, // 10 seconds connection timeout
    keepAliveInitialDelay: 30000,
  })
  .promise();

const router = express.Router();
router.use(cookieParser());
//* Register API
router.post("/register", async (req: Request, res: Response) => {
  //* Validate the registration
  const { username, email, password } = req.body;

  const { error, value } = registerValidation(req.body);
  console.log("Register validation result: ", value);
  if (error) {
    console.log("error:", error);
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    //TODO Check if user already exists
    let query = `SELECT * FROM users WHERE email = ?`;
    const [emailExist] = await db.query<RowDataPacket[]>(query, [email]);
    if (emailExist.length > 0) {
      console.log("emailExist:", emailExist);
      return res.status(400).json({ message: "Email already exists!" });
    }

    //* Create a new user in the database
    //* Hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    query = `INSERT INTO users(username, email, password) VALUES (?, ?, ?)`;
    await db.query(query, [username, email, hashPassword]);
    res.status(200).json({ message: `Register success!` });
  } catch (err) {
    console.log("Error registering user: ", err);
    res.status(500).json({ message: `Failed to register user: ${err}` });
  }
});

//* Signin API
router.post("/signin", async (req: Request, res: Response) => {
  /// Validate the login
  const { email, password } = req.body;
  const { error, value } = loginValidation(req.body);
  console.log("Signin validation result: ", value);
  if (error) {
    console.log("error:", error);
    return res.status(400).json({ message: error.details[0].message });
  }

  let query = `SELECT * FROM users WHERE email =?`;
  try {
    const [[user]] = await db.query<RowDataPacket[]>(query, [email]);
    console.log("user:", user);

    if (!user) {
      console.log(`Invalid email`);
      return res.status(401).json({ message: "Invalid email" });
    }

    /// Verify password
    const match = await bcrypt.compare(password, user.password);
    console.log("match: ", match);
    if (!match) {
      console.log(`Invalid password`);
      return res.status(401).json({ message: "Invalid password" });
    }

    /// Password is correct
    //* Create JWT
    delete user.password;
    console.log(`user_password_after_delete: ${user.password}`);
    const token = jwt.sign(user, jwtSecretAccessToken, { expiresIn: "1h" });
    const decode = jwt.decode(token) as { exp?: number };
    const verify = jwt.verify(token, jwtSecretAccessToken);
    console.log("verify: ", verify);
    console.log("decode: ", decode);
    if (decode && decode.exp) {
      const expiryDate = new Date(decode.exp * 1000).toLocaleString(); // 將 UNIX 時間戳轉換為日期
      console.log("Token expires at:", expiryDate);
    } else {
      console.log("Token has no expiry or is invalid");
    }

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res
      .status(200)
      .header("auth-token", token)
      .json({ message: "Signed in successfully!" });
  } catch (err) {
    console.log("Error signing in user: ", err);
    res.status(500).json({ message: "Error signing in user: ", err });
  }
});

export default router;
