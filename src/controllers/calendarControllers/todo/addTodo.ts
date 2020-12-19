import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { ITodo } from '../../../types/ITodo';
import { Todo } from '../../../db/entities/Todo';
import { TodoTag } from '../../../db/entities/TodoTag';

export default async (req: Request, res: Response) => {
  const { userId, title, scheduleDate, calendarId, tags } = req.body as ITodo;

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
    const _todo = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Todo)
      .values({
        title,
        scheduleDate,
        calendar: calendarId,
      })
      .execute();

    for await (const e of tags) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(TodoTag)
        .values({
          tag: e,
          todo: _todo.identifiers[0].id as number,
        })
        .execute();
    }

    return res.status(201).send('Todo 생성 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
