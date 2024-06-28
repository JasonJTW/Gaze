import express, { Request, Response } from "express";
const app = express();
const port = process.env.PORT || 3000;
import { config } from "dotenv";
config();
const clientHostName = process.env.ClientHostName;
const cors = require("cors");
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 50, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later 🥲.",
});
app.use(express.json()); // 確保 Express 能夠解析 JSON 請求體
app.use(express.urlencoded({ extended: true })); // 確保 Express 能夠解析 URL 編碼的請求體
app.use(limiter);
app.get("/", (req: Request, res: Response) => {
  console.log(`Hello! `);
  res.send("Hello there!");
});

const apiRoutes = require("./routes/api");
app.use(
  cors({
    origin: clientHostName, // Allow requests from this ip
    methods: ["GET", "POST", "PUT", "DELETE"], // 允許的 HTTP 方法
    allowedHeaders: ["Content-Type", "Authorization"], // 允許的 HTTP 標頭
  })
);
app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
