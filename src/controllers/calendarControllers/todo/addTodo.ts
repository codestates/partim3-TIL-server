import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { ITodo } from '../../../types/ITodo';
import { Todo } from '../../../db/entities/Todo';

export default async (req: Request, res: Response) => {
  const { userId, title, scheduleDate, calendarId } = req.body as ITodo;

  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Todo)
      .values({
        title,
        scheduleDate,
        calendar: calendarId,
      })
      .execute();

    return res.status(201).send('Todo 생성 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
