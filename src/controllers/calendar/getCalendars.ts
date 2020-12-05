import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  const _myCalendars = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('user.id= :id', { id: userId })
    .getMany()
    .catch((error) => {
      res.status(409).send(error);
    });

  if (_myCalendars) {
    if (_myCalendars[0]) {
      return res.status(200).json({
        myCalendars: _myCalendars[0].myCalendars,
        shareCalendars: [],
      });
    }
  }

  return res.status(400);
};
