import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import registerValidation from "../validation";
import mysql, { RowDataPacket } from "mysql2";
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

router.post("/register", async (req: Request, res: Response) => {
  //* Validate the registration
  const { username, email, password } = req.body;

  const { error, value } = registerValidation(req.body);
  console.log("Validation result: ", value);
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

router.post("/signin", async (req: Request, res: Response) => {
  //* Validate the login
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  let query = `SELECT * FROM users WHERE email =?`;
  try {
    const [[user]] = await db.query<RowDataPacket[]>(query, [email]);
    console.log("user:", user);

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    //* Compare the hashed password with the provided password
    const match = await bcrypt.compare(password, user.password);
    console.log("match: ", match);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Signed in successfully!" });
  } catch (err) {
    console.log("Error signing in user: ", err);
    res.status(500).json({ message: "Error signing in user: ", err });
  }
});

export default router;
