import express from 'express';
import authController from '../controllers/authControllers';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/social', authController.social);
router.post('/token', authController.checkToken);

export default router;
