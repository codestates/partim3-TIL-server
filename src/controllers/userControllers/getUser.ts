import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response): Promise<Response> => {
  const userId = Number(req.query.userId);

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (_user) {
      return res.status(200).json({
        nickname: _user.nickname,
      });
    } else {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
