import express, { Request, Response } from "express";
const app = express();
const router = express.Router();
// const uploadAPI = require("./uploadPhoto");
import uploadAPI from "./uploadPhoto";
const getPhotoAPI = require("./getPhoto");
router.get("/", (req: Request, res: Response) => {
  res.send("this is the api route");
});

router.use("/upload", uploadAPI);

export default router;
