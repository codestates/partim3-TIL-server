import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

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
    const _myTags = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tags', 'tags')
      .where('user.id= :userId', { userId })
      .getOne();

    if (_myTags) {
      return res.status(200).json({
        myTags: _myTags.tags,
      });
    } else {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
