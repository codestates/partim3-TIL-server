import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body as IUser;

  const token_secret = String(process.env.TOKEN_SECRET);

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email= :email', { email })
      .andWhere('user.password = :password', { password })
      .getOne();

    if (!_user) {
      return res.status(401).send('잘못된 이메일 또는 잘못된 비밀번호');
    }
    const _userId = _user.id;

    const token = jwt.sign({ _userId }, token_secret, {
      expiresIn: '30 minutes',
    });

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ token })
      .where('email = :email', { email })
      .execute();

    res.setHeader('authorization', token);
    return res.status(200).json({
      userId: _user.id,
      nickname: _user.nickname,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
