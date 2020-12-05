import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';

export default async (req: Request, res: Response) => {
  const { email, password, nickname } = req.body as IUser;

  const _userEmail = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.email= :email', { email })
    .getOne();

  const _userNickname = await getRepository(User)
    .createQueryBuilder('user')
    .where('user.nickname= :nickname', { nickname })
    .getOne();

  if (_userNickname !== undefined) {
    if (_userNickname.nickname === nickname) {
      return res.status(409).send('닉네임 중복');
    }
  }

  if (_userEmail !== undefined) {
    if (_userEmail.email === email) {
      return res.status(409).send('가입되어 있는 이메일');
    }
  }

  if (_userEmail === undefined && _userNickname === undefined) {
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
  }

  return res.status(400);
};
