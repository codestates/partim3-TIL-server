import express from "express";
import authController from "../controllers/auth";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/mypage", authController.mypage);
router.post("/logout", authController.logout);
router.post("/social/:id", authController.social);

export default router;
