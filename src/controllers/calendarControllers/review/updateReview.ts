import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Review } from '../../../db/entities/Review';
import { Calendar } from '../../../db/entities/Calendar';
import { IReview } from '../../../types/IReview';
import { ReviewTag } from '../../../db/entities/ReviewTag';
import { Tag } from '../../../db/entities/Tag';

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
    const _myTags = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tags', 'tags')
      .where('user.id = :userId', { userId })
      .getOne();

    if (_myTags) {
      for await (const id of tags) {
        let isExist = false;
        for await (const e of _myTags.tags) {
          if (e.id === id) {
            isExist = true;
          }
        }
        if (!isExist) {
          return res.status(400).send('사용자가 가지고 있지 않은 태그');
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
      })
      .where('id= :reviewId', { reviewId })
      .execute();

    const _review = getRepository(Review)
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.todoTags', 'todoTags')
      .leftJoinAndSelect('todoTags.tag', 'tag')
      .select('tag.id')
      .where('todo.id = :todoId', { reviewId });

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
