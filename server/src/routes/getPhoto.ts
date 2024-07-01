import express, { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2";
const router = express.Router();
const db = mysql
  .createPool({
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  })
  .promise();

router.get("/", async (req: Request, res: Response) => {
  const query = `SELECT * FROM photos`;
  const [data] = await db.query(query);
  res.status(200).json({ data: data });
});

export default router;
