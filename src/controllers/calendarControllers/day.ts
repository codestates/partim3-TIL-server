/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../db/entities/Calendar';
import { Todo } from '../../db/entities/Todo';
import { Review } from '../../db/entities/Review';
import { User } from '../../db/entities/User';
import { UserCalendarAuthority } from '../../db/entities/UserCalendarAuthority';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  const dateString = req.query.date as string;

  try {
    const myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .leftJoinAndSelect(
        'myCalendars.todos',
        'todos',
        'todos.scheduleDate = :dateString',
        { dateString }
      )
      .leftJoinAndSelect('todos.todoTags', 'todoTags')
      .leftJoinAndSelect('todoTags.tag', 'todotag')
      .leftJoinAndSelect(
        'myCalendars.reviews',
        'reviews',
        'reviews.scheduleDate = :dateString',
        { dateString }
      )
      .leftJoinAndSelect('reviews.reviewTags', 'reviewTags')
      .leftJoinAndSelect('reviewTags.tag', 'reviewtag')
      .where('user.id = :userId', { userId })
      .getOne();

    const shareCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userCalendarAuthorities',
        'userCalendarAuthorities'
      )
      .leftJoinAndSelect(
        'userCalendarAuthorities.calenderAuthority',
        'calenderAuthority'
      )
      .leftJoinAndSelect('calenderAuthority.calendar', 'calendar')
      .leftJoinAndSelect(
        'calendar.todos',
        'todos',
        'todos.scheduleDate = :dateString',
        { dateString }
      )
      .leftJoinAndSelect('todos.todoTags', 'todoTags')
      .leftJoinAndSelect('todoTags.tag', 'todotag')
      .leftJoinAndSelect(
        'calendar.reviews',
        'reviews',
        'reviews.scheduleDate = :dateString',
        { dateString }
      )
      .leftJoinAndSelect('reviews.reviewTags', 'reviewTags')
      .leftJoinAndSelect('reviewTags.tag', 'reviewtag')
      .where('user.id = :userId', { userId })
      .andWhere('calenderAuthority.owner != :userId', { userId })
      .getOne();

    console.log(shareCalendars);

    if (!myCalendars) {
      return res.status(400).send('유저 정보 없음');
    } else {
      let _shareCalendar: UserCalendarAuthority[] = [];
      if (shareCalendars) {
        _shareCalendar = shareCalendars.userCalendarAuthorities;
      }
      return res.status(200).json({
        myCalendars: myCalendars.myCalendars,
        shareCalendars: _shareCalendar,
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
