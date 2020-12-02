import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { ICalendar } from '../../types/ICalendar';
import { Calendar } from '../../db/entities/Calendar';
import { CalendarAuthority } from '../../db/entities/CalendarAuthority';
import { IUser } from '../../types/IUser';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const id = req.params.id;

  const _myCalendars = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('user.id= :id', { id })
    .getMany();

  if (_myCalendars[0]) {
    return res.status(200).json({
      myCalendars: _myCalendars[0].myCalendars,
    });
  }

  return res.status(400);
};
