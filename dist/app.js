"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const routes_1 = __importDefault(require("./routes"));
typeorm_1.createConnection()
    .then(() => {
    console.log("Database Connected :)");
})
    .catch((error) => console.log(error));
const app = express_1.default();
const port = process.env.PORT || 5000;
app.set("port", port);
app.use(morgan_1.default("dev"));
app.use("/", routes_1.default);
app.use(cors_1.default());
app.get("/", (req, res) => {
    res.send("hello TIL");
});
app.listen(app.get("port"), () => {
    console.log(`사용중인 포트 ${app.get("port")}`);
});
