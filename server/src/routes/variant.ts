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
  res.status(200).json({ message: "This is category api" });
});

// TODO: Implement reactive category & series drop-down option in <Content>
// router.get("/category", async (req: Request, res: Response) => {
//   /// Get category where user.id = user
// });

// router.get("/series", async (req: Request, res: Response) => {
//   /// Get series where user.id = user
// });

//* Insert variantAPI
router.post("/insert", async (req: Request, res: Response) => {
  const { category, series, id, url } = req.body;
  if (!category && !series)
    return res
      .status(400)
      .json({ message: "Please select a category or series" });

  console.log(
    `category: ${category}, series: ${series}, id: ${id}, url: ${url}`
  );
  try {
    /// Check if category exists in db
    let query = `SELECT * FROM categories WHERE title = ?`;
    const [categoryRows] = await db.query<RowDataPacket[]>(query, [category]);
    const categoryExists = categoryRows.length > 0 ? categoryRows[0] : null;
    let categoryID = null;
    if (categoryExists) {
      categoryID = categoryExists.id;
    }
    // console.log(
    //   `categoryExists: ${util.inspect(categoryExists, {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })}, categoryID: ${categoryID}`
    // );

    /// If category not exists, add category into db
    if (!categoryExists || categoryExists.length === 0) {
      /// Create new category
      query = `INSERT INTO categories (title) VALUES (?)`;
      const [categoryResult] = await db.query<ResultSetHeader>(query, [
        category,
      ]);
      // console.log(
      //   `Created category result: ${util.inspect(categoryResult, {
      //     showHidden: false,
      //     depth: null,
      //   })}`
      // );
      categoryID = categoryResult.insertId;
      console.log(`New category successfully added as id: ${categoryID}`);
    }

    /// Check if series exists in db
    query = `SELECT * FROM series WHERE title = ?`;
    const [seriesRows] = await db.query<RowDataPacket[]>(query, [series]);
    const seriesExists = seriesRows.length > 0 ? seriesRows[0] : null;
    let seriesID = null;
    if (seriesExists) {
      seriesID = seriesExists.id;
    }

    /// If series not exists, add series into db
    if (!seriesExists || seriesExists.length === 0) {
      /// Create new series
      query = `INSERT INTO series (title) VALUES (?)`;
      const [seriesResult] = await db.query<ResultSetHeader>(query, [series]);
      // console.log(
      //   `Created series result: ${util.inspect(seriesResult, {
      //     showHidden: false,
      //     depth: null,
      //     colors: true,
      //   })}`
      // );
      seriesID = seriesResult.insertId;
      console.log(`New series successfully added as id: ${seriesID}`);
    }

    /// Create new variants in db
    query = `INSERT INTO variants(photo_id, category_id, series_id) VALUES(?, ?, ?)`;
    await db.query(query, [id, categoryID, seriesID]);
  } catch (err) {
    console.log(`Error creating variants for photo?id=${id}: `, err);
  }
  res.status(200).json({ message: "Success!" });
});

export default router;
