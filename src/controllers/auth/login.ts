import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response) => {
  const { email, password } = req.body as IUser;

  const user = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email= :email', { email })
    .getOne();

  if (user === undefined) {
    return res.status(401).send('회원 정보 없음');
  } else if (user.email === email && user.password === password) {
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
      userId: user.id,
      nickname: user.nickname,
      token,
    });
  }

  return res.status(400);
};
