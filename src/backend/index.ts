import express, { Request } from "express";

const app = express();
const PORT = 3000;
app.get("/", (req: Request, res) => {
  res.send("Welcome!");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
