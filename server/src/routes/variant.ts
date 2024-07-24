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

import { CategoryOptionType } from "../types/CategoryOptionType";
import { SeriesOptionType } from "../types/SeriesOptionType";
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
  const { categoryArray, seriesArray, id } = req.body;

  console.log(
    `category: ${util.inspect(categoryArray, {
      showHidden: false,
      depth: null,
      colors: true,
    })}, series: ${util.inspect(seriesArray, {
      showHidden: false,
      depth: null,
      colors: true,
    })}, id: ${util.inspect(id, {
      showHidden: false,
      depth: null,
      colors: true,
    })}`
  );

  if (categoryArray.length == 0 && seriesArray.length == 0) {
    return res
      .status(400)
      .json({ message: "Please select a category or series" });
  }

  let categoryTitles: string[] = [];
  categoryArray.forEach((category: CategoryOptionType) => {
    categoryTitles.push(category.title);
  });
  let seriesTitles: string[] = [];
  seriesArray.forEach((series: SeriesOptionType) => {
    seriesTitles.push(series.title);
  });
  console.log("categoryTitles: ", categoryTitles);
  console.log("seriesTitles: ", seriesTitles);

  try {
    //* Clean up variants with deleted tags in db

    if (categoryTitles.length > 0) {
      const categoryPlaceholders = categoryTitles.map(() => "?").join(", ");
      let query = `DELETE FROM variants WHERE photo_id = ? AND category_id IN (SELECT id FROM categories WHERE title NOT IN (${categoryPlaceholders}))`;
      await db.query(query, [id, ...categoryTitles]);
    }

    if (seriesTitles.length > 0) {
      const seriesPlaceholders = seriesTitles.map(() => "?").join(", ");
      let query = `DELETE FROM variants WHERE photo_id = ? AND series_id IN (SELECT id FROM series WHERE title NOT IN (${seriesPlaceholders}))`;
      await db.query(query, [id, ...seriesTitles]);
    }
    for (const categoryTag of categoryArray) {
      for (const seriesTag of seriesArray) {
        const category = categoryTag.title;
        const series = seriesTag.title;
        /// Check if category exists in db
        let query = `SELECT * FROM categories WHERE title = ?`;
        const [categoryRows] = await db.query<RowDataPacket[]>(query, [
          category,
        ]);
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
          const [seriesResult] = await db.query<ResultSetHeader>(query, [
            series,
          ]);
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

        /// Check if variants exist in db
        query = `SELECT * FROM variants WHERE photo_id = ? AND category_id = ?  AND series_id = ?`;
        const [variantsCheck] = await db.query<RowDataPacket[]>(query, [
          id,
          categoryID,
          seriesID,
        ]);
        const variantExists =
          variantsCheck.length > 0 ? variantsCheck[0] : false;
        if (variantExists) {
          console.log(
            `variants found: ${util.inspect(variantExists, {
              showHidden: false,
              depth: null,
              colors: true,
            })}`
          );

          continue;
        }

        /// Create new variants in db
        query = `INSERT INTO variants(photo_id, category_id, series_id) VALUES(?, ?, ?)`;
        await db.query(query, [id, categoryID, seriesID]);
      }
    }
    res.status(200).json({ message: "Success!" });
  } catch (err) {
    console.log(`Error creating variants for photo?id=${id}: `, err);
  }
});

//* Get all categories title
router.get("/get_category", async (req: Request, res: Response) => {
  try {
    const query = `SELECT title FROM categories WHERE title != ""`;

    const [result] = await db.query(query);
    // console.log(
    //   `All categories title: ${util.inspect(result, {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })}`
    // );
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(`Error getting all categories: ${err}`);
    const errorMessage = (err as Error).message;
    res.status(400).json({ message: errorMessage });
  }
});

//* Get all series title
router.get("/get_series", async (req: Request, res: Response) => {
  try {
    const query = `SELECT title FROM series WHERE title != ""`;

    const [result] = await db.query(query);
    // console.log(
    //   `All series title: ${util.inspect(result, {
    //     showHidden: false,
    //     depth: null,
    //     colors: true,
    //   })}`
    // );
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(`Error getting all series: ${err}`);
    const errorMessage = (err as Error).message;
    res.status(400).json({ message: errorMessage });
  }
});

//* Get photo's categories & series
router.get("/get_photo_tag", async (req: Request, res: Response) => {
  const photoId = req.query.id;
  console.log(`param: ${photoId}`);
  try {
    let query = `
SELECT DISTINCT 
categories.title AS title
FROM 
    variants
JOIN 
    categories ON variants.category_id = categories.id
WHERE 
    variants.photo_id = ?`;

    const [categoriesResponse] = await db.query(query, [photoId]);
    console.log(
      `All categories title: ${util.inspect(categoriesResponse, {
        showHidden: false,
        depth: null,
        colors: true,
      })}`
    );

    query = `SELECT DISTINCT 
series.title AS title
FROM 
    variants
JOIN 
    series ON variants.series_id = series.id
WHERE 
    variants.photo_id = ?`;
    const [seriesResponse] = await db.query(query, [photoId]);
    console.log(
      `All series title: ${util.inspect(seriesResponse, {
        showHidden: false,
        depth: null,
        colors: true,
      })}`
    );
    res
      .status(200)
      .json({ data: { category: categoriesResponse, series: seriesResponse } });
  } catch (err) {
    console.log(`Error getting all categories: ${err}`);
    const errorMessage = (err as Error).message;
    res.status(400).json({ message: errorMessage });
  }
});

export default router;
