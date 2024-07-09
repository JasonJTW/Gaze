import express, { Request, Response } from "express";
const app = express();
const router = express.Router();
// const uploadAPI = require("./uploadPhoto");
import uploadAPI from "./uploadPhoto";
import getPhotoAPI from "./getPhoto";
import authAPI from "./auth";
router.get("/", (req: Request, res: Response) => {
  res.send("this is the api route");
});

router.use("/upload", uploadAPI);
router.use("/photo", getPhotoAPI);
router.use("/user", authAPI);

export default router;
