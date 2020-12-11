import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { UserCalendarAuthority } from '../../../db/entities/UserCalendarAuthority';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, todoId } = req.body as ITodo;

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
