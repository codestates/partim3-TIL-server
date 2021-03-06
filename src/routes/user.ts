import express from 'express';
import messageController from '../controllers/messageControllers';
import usercontroller from '../controllers/userControllers';

const router = express.Router();

router.post('/message', messageController.postMessage);
router.post('/isuser', usercontroller.isUser);

router.get('/user', usercontroller.getUser);
router.get('/lastindex', usercontroller.getLastIndexofUsers);

router.put('/user', usercontroller.updateUser);

router.get('/message', messageController.getMessage);

export default router;
