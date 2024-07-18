import express, { Request, Response } from "express";
const app = express();
const router = express.Router();
import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";
import { config } from "dotenv";
import util from "util";
config();
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

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "This is gallery api" });
});

//* GalleryAPI: Get all public images
router.get("/all", async (req: Request, res: Response) => {
  try {
    // TODO: Implement check visibility=public in query

    //* Select all images' photo_id in variants and join with photos
    const query = `SELECT * FROM variants JOIN photos ON variants.photo_id = photos.id `;
    const [row] = await db.query(query);
    console.log(
      `Query result: ${util.inspect(row, {
        showHidden: false,
        depth: null,
        colors: true,
      })}`
    );
    res.status(200).json({ data: row });
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.log(`Error getting all images from db: ${(err as Error).message}`);
    res.status(400).json({ message: errorMessage });
  }
});

//* CategoryAPI: Get public images sorted by category
router.get("/category", async (req: Request, res: Response) => {
  //* Select all in categories and join categories.id with variants.category_id
  try {
    const query = `SELECT * FROM categories
      JOIN variants 
      ON variants.category_id = categories.id
      Join photos
      ON variants.photo_id = photos.id;`;
    const [row] = await db.query(query);
    console.log(
      `Query result: ${util.inspect(row, {
        showHidden: false,
        depth: null,
        colors: true,
      })}`
    );
    res.status(200).json({ data: row });
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.log(`Error getting all categorize images from db: ${errorMessage}`);
    res.status(400).json({ message: errorMessage });
  }
});

//* SeriesAPI: Get public images sorted by series
router.get("/series", async (req: Request, res: Response) => {
  //* Select all in series and join series.id with variants.series_id
  try {
    const query = `SELECT * FROM series
      JOIN variants 
      ON variants.series_id = series.id
      Join photos
      ON variants.photo_id = photos.id;`;
    const [row] = await db.query(query);
    console.log(
      `Query result: ${util.inspect(row, {
        showHidden: false,
        depth: null,
        colors: true,
      })}`
    );
    res.status(200).json({ data: row });
  } catch (err) {
    const errorMessage = (err as Error).message;
    console.log(`Error getting all serialized images from db: ${errorMessage}`);
    res.status(400).json({ message: errorMessage });
  }
});

export default router;
