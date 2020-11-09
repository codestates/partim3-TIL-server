import express from "express";
import cors from "cors";
import indexRouter from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

app.use("/", indexRouter);
app.use(cors());

app.get("/", (req, res) => {
  res.send("hello TIL");
});

app.set("port", port);
app.listen(app.get("port"), () => {
  console.log(`사용중인 포트 ${app.get("port")}`);
});
