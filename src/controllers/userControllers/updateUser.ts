import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IUser } from '../../types/IUser';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, nickname, password } = req.body as IUser;
  let { newPassword } = req.body as IUser;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .andWhere('user.password = :password', { password })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없거나 틀린 기존 비밀번호');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    if (newPassword === null) {
      newPassword = password;
    }

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword, nickname })
      .where('id = :userId', { userId })
      .execute();

    return res.status(200).send('회원 정보 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
