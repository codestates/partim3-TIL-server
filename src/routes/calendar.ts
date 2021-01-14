import express from 'express';
import calendarController from '../controllers/calendarControllers';

const router = express.Router();

router.post('/todo', calendarController.addTodo);
router.post('/review', calendarController.addReview);
router.post('/tag', calendarController.addTag);
router.post('/calendar', calendarController.addCalendar);
router.post(
  '/connectcalendarauthority',
  calendarController.connectCalendarAuthority
);

router.put('/tag', calendarController.updateTag);
router.put('/calender', calendarController.updateCalendar);
router.put('/todo', calendarController.updateTodo);
router.put('/review', calendarController.updateReview);

router.delete('/todo', calendarController.deleteTodo);
router.delete('/tag', calendarController.deleteTag);
router.delete('/calendar', calendarController.deleteCalendar);
router.delete('/review', calendarController.deleteReview);
router.delete('/calendarauthority', calendarController.deleteCalendarAuthority);

router.get('/day', calendarController.day);
router.get('/tags', calendarController.getTag);
router.get('/todos', calendarController.getTodo);
router.get('/reviews', calendarController.getReview);
router.get('/calendars', calendarController.getCalendar);
router.get('/filterTags', calendarController.filterTags);
router.get('/calendarauthority', calendarController.getCalendarAuthority);
router.get(
  '/calendarauthorityofcalendar',
  calendarController.getCalendarAuthorityOfCalendar
);

export default router;
