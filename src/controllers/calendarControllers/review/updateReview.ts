import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';
import { IReview } from '../../../types/IReview';
import { ReviewTag } from '../../../db/entities/ReviewTag';
import { Tag } from '../../../db/entities/Tag';

export default async (req: Request, res: Response): Promise<Response> => {
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
    const _myReview = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .leftJoinAndSelect('calendar.reviews', 'reviews')
      .where('user.id = :userId', { userId })
      .andWhere('reviews.id = :reviewId', { reviewId })
      .getOne();

    if (!_myReview) {
      return res.status(400).send('가지고 있지 않은 REVIEW');
    }

    const _myTags = await getRepository(Tag)
      .createQueryBuilder('tag')
      .getMany();

    if (_myTags) {
      for await (const id of tags) {
        let isExist = false;
        for await (const e of _myTags) {
          if (e.id === id) {
            isExist = true;
          }
        }
        if (!isExist) {
          return res.status(400).send('없는 태그');
        }
      }
    }

    await getConnection()
      .createQueryBuilder()
      .update(Review)
      .set({
        title,
        context,
        imageUrl,
        scheduleTime,
        calendar: calendarId,
      })
      .where('id= :reviewId', { reviewId })
      .execute();

    const _review = getRepository(Review)
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.reviewTags', 'reviewTags')
      .leftJoinAndSelect('reviewTags.tag', 'tag')
      .select('tag.id')
      .where('review.id = :reviewId', { reviewId });

    const _tags = await getRepository(Tag)
      .createQueryBuilder('tag')
      .where('tag.id IN (' + _review.getQuery() + ')')
      .setParameters(_review.getParameters())
      .getMany();

    for await (const e of _tags) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(ReviewTag)
        .where({
          tag: e.id,
          review: reviewId,
        })
        .execute();
    }

    for await (const e of tags) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ReviewTag)
        .values({
          tag: e,
          review: reviewId,
        })
        .execute();
    }

    return res.status(200).send('Review 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
