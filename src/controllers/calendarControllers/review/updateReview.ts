import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';
import { Calendar } from '../../../db/entities/Calendar';
import { IReview } from '../../../types/IReview';

export default async (req: Request, res: Response) => {
  const {
    userId,
    calendarId,
    reviewId,
    title,
    context,
    imageUrl,
    scheduleTime,
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
    const _myReview = await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .leftJoinAndSelect('calendar.reviews', 'reviews')
      .where('reviews.calendarId = :calendarId', { calendarId })
      .andWhere('reviews.id = :reviewId', { reviewId })
      .getOne();

    if (!_myReview) {
      return res
        .status(400)
        .send('캘린더 정보 없음 또는 가지고 있지 않은 REVIEW');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .update(Review)
      .set({
        title,
        context,
        imageUrl,
        scheduleTime,
      })
      .where('id= :reviewId', { reviewId })
      .execute();

    return res.status(200).send('Review 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
