import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';

export default async (req: Request, res: Response) => {
  const { email, password, nickname } = req.body as IUser;

  try {
    const _userEmail = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.email= :email', { email })
      .getOne();

    const _userNickname = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.nickname= :nickname', { nickname })
      .getOne();

    if (_userEmail) {
      return res.status(400).send('가입되어 있는 이메일');
    }
    if (_userNickname) {
      return res.status(400).send('닉네임 중복');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const result = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email,
        password,
        nickname,
      })
      .execute();

    return res
      .status(201)
      .json({ userId: result.generatedMaps[0].id as number });
  } catch (error) {
    return res.status(400).send(error);
  }
};
