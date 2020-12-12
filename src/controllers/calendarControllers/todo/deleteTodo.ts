import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { Calendar } from '../../../db/entities/Calendar';
import { UserCalendarAuthority } from '../../../db/entities/UserCalendarAuthority';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, todoId } = req.body as ITodo;

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :userId', { userId })
      .andWhere('myCalendars.id = :calendarId', { calendarId })
      .getOne();

    if (!_myCalendars) {
      return res
        .status(400)
        .send('유저 정보 없음 또는 가지고 있지 않은 캘린더');
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
    await getRepository(Todo)
      .createQueryBuilder('todo')
      .delete()
      .where('todo.id= :todoId', { todoId })
      .execute();

    return res.status(200).send('TODO 삭제 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
