import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { Calendar } from '../../../db/entities/Calendar';
import { TodoTag } from '../../../db/entities/TodoTag';
import { Tag } from '../../../db/entities/Tag';

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
    const _myTodo = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .leftJoinAndSelect('calendar.todos', 'todos')
      .where('user.id = :userId', { userId })
      .andWhere('todos.id = :todoId', { todoId })
      .getOne();

    if (!_myTodo) {
      return res.status(400).send('가지고 있지 않은 TODO');
    }

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

    await getConnection()
      .createQueryBuilder()
      .update(Todo)
      .set({
        title,
        scheduleDate,
        calendar: calendarId,
      })
      .where('id = :todoId', { todoId })
      .execute();

    const _todo = getRepository(Todo)
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.todoTags', 'todoTags')
      .leftJoinAndSelect('todoTags.tag', 'tag')
      .select('tag.id')
      .where('todo.id = :todoId', { todoId });

    const _tags = await getRepository(Tag)
      .createQueryBuilder('tag')
      .where('tag.id IN (' + _todo.getQuery() + ')')
      .setParameters(_todo.getParameters())
      .getMany();

    for await (const e of _tags) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(TodoTag)
        .where({
          tag: e.id,
          todo: todoId,
        })
        .execute();
    }

    for await (const e of tags) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(TodoTag)
        .values({
          tag: e,
          todo: todoId,
        })
        .execute();
    }

    return res.status(200).send('TODO 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
