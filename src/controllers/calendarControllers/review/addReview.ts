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
    tags,
  } = req.body as IReview;

  try {
    const _authority = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userCalendarAuthorities',
        'userCalendarAuthorities'
      )
      .innerJoinAndSelect(
        'userCalendarAuthorities.calenderAuthority',
        'calenderAuthority'
      )
      .where('user.id= :userId', { userId })
      .andWhere('calenderAuthority.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    if (!_authority) {
      return res.status(400).send('유저 정보 없음 또는 권한이 없는 캘린더');
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
