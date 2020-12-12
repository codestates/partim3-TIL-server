import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response) => {
  const { email, password } = req.body as IUser;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email= :email', { email })
      .andWhere('user.password = :password', { password })
      .getOne();

    if (!_user) {
      return res.status(401).send('잘못된 이메일 또는 잘못된 비밀번호');
    }

    // eslint-disable-next-line @typescript-eslint/await-thenable
    const token = await jwt.sign(
      {
        email,
      },
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${process.env.TOKEN_SECRET}`
    );

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ token })
      .where('email = :email', { email })
      .execute();

    return res.status(200).json({
      userId: _user.id,
      nickname: _user.nickname,
      token,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
