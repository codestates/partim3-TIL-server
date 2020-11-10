import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import morgan from "morgan";

import authRouter from "./routes/auth";

createConnection()
  .then(() => {
    console.log("Database Connected :)");
  })
  .catch((error) => console.log(error));

const app = express();

const port = process.env.PORT || 5000;
app.set("port", port);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", authRouter);

app.get("/", (req, res) => {
  res.send("hello TIL");
});

app.listen(app.get("port"), () => {
  console.log(`사용중인 포트 ${app.get("port")}`);
});
