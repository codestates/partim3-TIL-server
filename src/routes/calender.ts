import express from "express";
import calenderController from "../controllers/calender";

const router = express.Router();

router.post("/todo", calenderController.todo);
router.post("/review", calenderController.review);

export default router;
