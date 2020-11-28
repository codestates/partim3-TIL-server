import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Todo } from '../../db/entities/Todo';

export default async (req: Request, res: Response) => {
  const { id, title, scheduleTime } = req.body as Todo;

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Todo)
    .values({
      title,
      scheduleTime,
      user: id,
    })
    .execute()
    .then(() => {
      return res.status(200).send('Review 생성 완료');
    })
    .catch((error) => {
      return res.status(401).send(error);
    });
  return res.status(400);
};
