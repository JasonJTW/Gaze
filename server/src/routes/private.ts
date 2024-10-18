import express, { Request, Response } from "express";
import verifyToken from "../verifyToken";
import mysql, { RowDataPacket } from "mysql2";
import { JwtPayload } from "jsonwebtoken";

const db = mysql
  .createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    idleTimeout: 10000,
    connectTimeout: 10000, // 10 seconds connection timeout
    keepAliveInitialDelay: 30000,
  })
  .promise();

const router = express.Router();

//TODO: Get user data from db

router.get("/", verifyToken, async (req: Request, res: Response) => {
  const query = `SELECT * FROM users WHERE id = ?`;
  try {
    const user = req.user as JwtPayload;
    const [[userData]] = await db.query<RowDataPacket[]>(query, [user.id]);
    delete userData.password;
    res.status(200).json({
      userData: userData,
      message: `hello, user:${user.id}`,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error: " });
  }
});

export default router;
