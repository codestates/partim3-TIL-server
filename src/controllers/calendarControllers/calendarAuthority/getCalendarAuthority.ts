import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CalendarAuthority } from '../../../db/entities/CalendarAuthority';
import { User } from '../../../db/entities/User';

export default async (req: Request, res: Response): Promise<Response> => {
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
    const _authorities = await getRepository(CalendarAuthority)
      .createQueryBuilder('calendarAuthority')
      .leftJoin('calendarAuthority.user', 'user')
      .addSelect(['user.nickname'])
      .leftJoin('calendarAuthority.calendar', 'calendar')
      .addSelect(['calendar.name'])
      .where('calendarAuthority.ownerId = :ownerId', { ownerId: userId })
      .andWhere('calendarAuthority.user != :user', { user: userId })
      .getMany();

    return res.status(200).json({
      authorities: _authorities,
    });
  } catch (error) {
    return res.status(400).send(error);
  }
};
