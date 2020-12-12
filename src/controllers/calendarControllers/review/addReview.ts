import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';
import { IReview } from '../../../types/IReview';

export default async (req: Request, res: Response) => {
  const {
    userId,
    title,
    context,
    imageUrl,
    scheduleDate,
    scheduleTime,
    calendarId,
  } = req.body as IReview;

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :userId', { userId })
      .andWhere('myCalendars.id = :calendarId', { calendarId })
      .getOne();

    if (!_myCalendars) {
      return res
        .status(400)
        .send('유저 정보 없음 또는 가지고 있지 않은 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Review)
      .values({
        title,
        context,
        imageUrl,
        scheduleDate,
        scheduleTime,
        calendar: calendarId,
      })
      .execute();

    return res.status(201).send('Review 생성 완료');
  } catch (error) {
    return res.status(409).send(error);
  }
};
