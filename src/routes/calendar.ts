import express from 'express';
import calendarController from '../controllers/calendar';

const router = express.Router();

router.post('/todo', calendarController.todo);
router.post('/review', calendarController.review);
router.post('/addcalendar', calendarController.addCalendar);
router.post('/addtag', calendarController.addTag);
router.get('/day', calendarController.day);

export default router;
