import express from 'express';
import calendarController from '../controllers/calendar';

const router = express.Router();

router.post('/todo', calendarController.todo);
router.post('/review', calendarController.review);
router.post('/addcalendar', calendarController.addCalendar);
router.post('/addtag', calendarController.addTag);

router.delete('/deletetag', calendarController.deleteTag);

router.get('/day', calendarController.day);
router.get('/calendars', calendarController.getCalendars);
router.get('/tags', calendarController.getTags);

export default router;
