import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { ITodo } from '../../../types/ITodo';
import { Todo } from '../../../db/entities/Todo';
import { TodoTag } from '../../../db/entities/TodoTag';
import { Tag } from '../../../db/entities/Tag';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, title, scheduleDate, calendarId, tags } = req.body as ITodo;

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
    const _myTags = await getRepository(Tag)
      .createQueryBuilder('tag')
      .getMany();

    if (_myTags) {
      for await (const id of tags) {
        let isExist = false;
        for await (const e of _myTags) {
          if (e.id === id) {
            isExist = true;
          }
        }
        if (!isExist) {
          return res.status(400).send('없는 태그');
        }
      }
    }

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
