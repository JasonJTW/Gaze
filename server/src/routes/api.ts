import express, { Request, Response } from "express";
const app = express();
const router = express.Router();
const uploadAPI = require("./uploadPhoto");

router.get("/", (req: Request, res: Response) => {
  res.send("this is the api route");
});

router.use("/upload", uploadAPI);

module.exports = router;
