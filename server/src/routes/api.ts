import express, { Request, Response } from "express";
const app = express();
const router = express.Router();
// const uploadAPI = require("./uploadPhoto");
import uploadAPI from "./uploadPhoto";
import getPhotoAPI from "./getPhoto";
router.get("/", (req: Request, res: Response) => {
  res.send("this is the api route");
});

router.use("/upload", uploadAPI);
router.use("/photo", getPhotoAPI);

export default router;
