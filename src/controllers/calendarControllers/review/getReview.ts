import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';

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
    const _calendarAthoritys = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .select('calendar.id')
      .where('user.id = :userId', { userId });

    const _reviews = await getRepository(Review)
      .createQueryBuilder('review')
      .where('review.calendarId IN (' + _calendarAthoritys.getQuery() + ')')
      .setParameters(_calendarAthoritys.getParameters())
      .getMany();

    return res.status(200).json({
      reviews: _reviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
