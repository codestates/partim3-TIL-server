"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const todo_1 = require("../src/models/todo");
const app = express_1.default();
const port = 5000;
// mongoose.connect(
//   'mongodb://localhost:27017/TIL-database',
//   {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   () => {
//     console.log("connected to database");
//   }
// )
// .on('error', console.error.bind(console, 'connection error'))
mongoose_1.default.connect("mongodb://localhost/TIL-database", {
    useNewUrlParser: true,
});
const db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    // we're connected!
});
app.use("/", routes_1.default);
app.use(cors_1.default());
app.get("/", (req, res) => {
    const silence = new todo_1.Todo({
        title: String, "asdf": ,
        description: String, "qvr": ,
    });
    console.log(silence.title);
    res.send("hello TIL");
});
app.set("port", port);
app.listen(app.get("port"), () => {
    console.log(`사용중인 포트 ${app.get("port")}`);
});
