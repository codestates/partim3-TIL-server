import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { ITodo } from '../../types/ITodo';
import { Todo } from '../../db/entities/Todo';

export default async (req: Request, res: Response) => {
  const { title, scheduleDate, calendarId } = req.body as ITodo;

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Todo)
    .values({
      title,
      scheduleDate,
      calendar: calendarId,
    })
    .execute()
    .then(() => {
      return res.status(200).send('Todo 생성 완료');
    })
    .catch((error) => {
      return res.status(401).send(error);
    });
  return res.status(400);
};
