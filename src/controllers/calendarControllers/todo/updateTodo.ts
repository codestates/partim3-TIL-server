import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { Calendar } from '../../../db/entities/Calendar';

export default async (req: Request, res: Response) => {
  const {
    userId,
    calendarId,
    title,
    scheduleDate,
    todoId,
    tags,
  } = req.body as ITodo;

  try {
    const _authority = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userCalendarAuthorities',
        'userCalendarAuthorities'
      )
      .innerJoinAndSelect(
        'userCalendarAuthorities.calenderAuthority',
        'calenderAuthority'
      )
      .where('user.id= :userId', { userId })
      .andWhere('calenderAuthority.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    if (!_authority) {
      return res.status(400).send('유저 정보 없음 또는 권한이 없는 캘린더');
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
      .update(Todo)
      .set({
        title,
        scheduleDate,
      })
      .where('id = :todoId', { todoId })
      .execute();

    return res.status(200).send('TODO 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
