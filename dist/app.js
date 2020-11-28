"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_1 = __importDefault(require("./routes/auth"));
const calendar_1 = __importDefault(require("./routes/calendar"));
const typeormConnection_1 = __importDefault(require("./utils/typeormConnection"));
const app = express_1.default();
const port = process.env.PORT || 5000;
typeormConnection_1.default();
app.set("port", port);
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_1.default({
    origin: ["http://localhost:3000"],
    credentials: true,
}));
app.use("/users", auth_1.default);
app.use("/calendar", calendar_1.default);
app.get("/", (req, res) => {
    res.send("hello TIL");
});
app.listen(app.get("port"), () => {
    console.log(`사용중인 포트 ${app.get("port")}`);
});
