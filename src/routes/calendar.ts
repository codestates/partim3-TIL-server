import express from 'express';
import calendarController from '../controllers/calendarControllers';

const router = express.Router();

router.post('/todo', calendarController.addTodo);
router.post('/review', calendarController.addReview);
router.post('/addtag', calendarController.addTag);
router.post('/addcalendar', calendarController.addCalendar);
router.post(
  '/connectcalendarauthority',
  calendarController.connectCalendarAuthority
);

router.put('/updatetag', calendarController.updateTag);
router.put('/updatecalender', calendarController.updateCalendar);
router.put('/updatetodo', calendarController.updateTodo);
router.put('/updatereview', calendarController.updateReview);

router.delete('/deletetodo', calendarController.deleteTodo);
router.delete('/deletetag', calendarController.deleteTag);
router.delete('/deletecalendar', calendarController.deleteCalendar);
router.delete('/deletereview', calendarController.deleteReview);

router.get('/day', calendarController.day);
router.get('/calendars', calendarController.getCalendars);
router.get('/tags', calendarController.getTags);

export default router;
