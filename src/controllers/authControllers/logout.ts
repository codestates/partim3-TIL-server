import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';

export default async (req: Request, res: Response) => {
  const { userId } = req.body as IUser;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ token: undefined })
      .where('id = :userId', { userId })
      .execute();

    return res.status(200).send('로그아웃 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
