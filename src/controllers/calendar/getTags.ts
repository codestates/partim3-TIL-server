import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  const _myTags = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.tags', 'tags')
    .where('user.id= :id', { id: userId })
    .getMany()
    .catch((error) => {
      res.status(409).send(error);
    });

  console.log(_myTags);
  if (_myTags) {
    if (_myTags[0]) {
      return res.status(200).json({
        myTags: _myTags[0].tags,
      });
    }
  }

  return res.status(400);
};
