/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../db/entities/Calendar';
import { Todo } from '../../db/entities/Todo';
import { Review } from '../../db/entities/Review';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  const dateString = req.query.date as string;

  const myCalendars = await getRepository(User)
    .createQueryBuilder('calendar')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('user.id= :id', { id: userId })
    .getOne();

  if (!myCalendars) {
    return res.status(200).json({
      myCalendars: [],
      shareCalendars: [],
    });
  }

  const _myCalendars = await getRepository(Calendar)
    .createQueryBuilder('calendar')
    .leftJoinAndSelect('calendar.todos', 'todos')
    .leftJoinAndSelect('calendar.reviews', 'reviews')
    .where('calendar.owner= :owner', { owner: userId })
    .getMany();

  if (_myCalendars.length > 0) {
    for await (const element of _myCalendars) {
      const todos: Array<Todo> = [];
      const reviews: Array<Review> = [];

      element.todos.forEach((e) => {
        if (e.scheduleDate === dateString) {
          todos.push(e);
        }
      });
      element.reviews.forEach((e) => {
        if (e.scheduleDate === dateString) {
          reviews.push(e);
        }
      });

      element.todos = todos;
      element.reviews = reviews;
    }

    return res.status(200).json({
      myCalendars: _myCalendars,
      shareCalendars: [],
    });
  } else {
    return res.status(409).send('캘린더 없음');
  }

  return res.status(400);
};
