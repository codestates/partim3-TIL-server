import express from "express";
import calenderController from "../controllers/calender";

const router = express.Router();

router.post("/todo", calenderController.todo);

export default router;
