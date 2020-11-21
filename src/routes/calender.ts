import express from "express";
import calenderController from "../controllers/calender";

const router = express.Router();

router.post("/todo", calenderController.todo);
router.post("/review", calenderController.review);
router.post("/day", calenderController.day);

export default router;
