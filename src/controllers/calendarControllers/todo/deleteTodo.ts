import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { Calendar } from '../../../db/entities/Calendar';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, todoId } = req.body as ITodo;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .where('user.id= :userId', { userId })
      .andWhere('CalendarAuthorities.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    if (_user) {
      if (!_user.CalendarAuthorities[0].write) {
        return res.status(400).send('쓰기 권한 없음');
      }
    } else {
      return res.status(400).send('유저 정보 없음 또는 권한 없는 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _myTodo = await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .leftJoinAndSelect('calendar.todos', 'todos')
      .where('todos.calendarId = :calendarId', { calendarId })
      .andWhere('todos.id = :todoId', { todoId })
      .getOne();

    if (!_myTodo) {
      return res
        .status(400)
        .send('캘린더 정보 없음 또는 가지고 있지 않은 TODO');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Todo)
      .where('id= :todoId', { todoId })
      .execute();

    return res.status(200).send('TODO 삭제 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
