import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth";
import dbConnection from "./utils/typeormConnection";

const app = express();
const port = process.env.PORT || 5000;

dbConnection();

app.set("port", port);

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use("/users", authRouter);

app.get("/", (req, res) => {
  res.send("hello TIL");
});

app.listen(app.get("port"), () => {
  console.log(`사용중인 포트 ${app.get("port")}`);
});
