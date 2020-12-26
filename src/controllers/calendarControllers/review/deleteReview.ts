import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';
import { Calendar } from '../../../db/entities/Calendar';
import { IReview } from '../../../types/IReview';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, calendarId, reviewId } = req.body as IReview;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .where('user.id= :userId', { userId })
      .andWhere('CalendarAuthorities.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    if (_user) {
      if (!_user.CalendarAuthorities[0].write) {
        return res.status(400).send('쓰기 권한 없음');
      }
    } else {
      return res.status(400).send('유저 정보 없음 또는 권한 없는 캘린더');
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
      .delete()
      .from(Review)
      .where('id = :reviewId', { reviewId })
      .execute();

    return res.status(200).send('Review 삭제 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
