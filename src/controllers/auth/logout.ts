import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';

export default async (req: Request, res: Response) => {
  const { userId } = req.body as IUser;

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ token: undefined })
    .where('id = :id', { id: userId })
    .execute()
    .then(() => {
      return res.status(200).send('로그아웃 성공');
    });

  return res.status(400);
};
