import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';

export default async (req: Request, res: Response): Promise<Response> => {
  const userId = Number(req.query.userId);

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _calendarAthoritys = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .select('calendar.id')
      .where('user.id = :userId', { userId });

    const _todos = await getRepository(Todo)
      .createQueryBuilder('todo')
      .where('todo.calendarId IN (' + _calendarAthoritys.getQuery() + ')')
      .setParameters(_calendarAthoritys.getParameters())
      .getMany();

    return res.status(200).json({
      todos: _todos,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
