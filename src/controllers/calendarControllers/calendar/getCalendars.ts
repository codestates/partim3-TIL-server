import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :userId', { userId })
      .getOne();

    if (_myCalendars) {
      return res.status(200).json({
        myCalendars: _myCalendars.myCalendars,
        shareCalendars: [],
      });
    } else {
      return res.status(200).json({
        myCalendars: [],
        shareCalendars: [],
      });
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
