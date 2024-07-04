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

router.get("/all", async (req: Request, res: Response) => {
  const query = `SELECT * FROM photos`;
  const [data] = await db.query(query);
  res.status(200).json({ data: data });
});

router.get("/details", async (req: Request, res: Response) => {
  console.log("req.query: ", req.query);
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "Missing required parameter 'id'" });
  }
  const query = `SELECT * FROM photos where id = ?`;
  try {
    const [data] = await db.query<any[]>(query, [id]);
    console.log("data:", data);

    /// Handle invalid id
    if (data.length == 0) {
      console.log(`Invalid id!`);
      return res.status(400).json({ message: "Invalid image id!" });
    }
    res.status(200).json({ data: data });
  } catch (err) {
    console.log("Error fetching data: ", err);
    res.status(500).json({ message: "Failed to get data." });
  }
});

export default router;
