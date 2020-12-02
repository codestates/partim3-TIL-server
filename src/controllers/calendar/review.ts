import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Review } from '../../db/entities/Review';
import { IReview } from '../../types/IReview';

export default async (req: Request, res: Response) => {
  const {
    title,
    context,
    imageUrl,
    scheduleTime,
    calendarId,
  } = req.body as IReview;

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values({
      title,
      context,
      imageUrl,
      scheduleTime,
      calendar: calendarId,
    })
    .execute()
    .then(() => {
      return res.status(200).send('Review 생성 완료');
    })
    .catch((error) => {
      return res.status(401).send(error);
    });

  return res.status(400);
};
