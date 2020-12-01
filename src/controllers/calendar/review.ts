import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { Review } from '../../db/entities/Review';

export default async (req: Request, res: Response) => {
  const { id, title, context, imageUrl, scheduleTime } = req.body as Review;

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Review)
    .values({
      title,
      context,
      imageUrl,
      scheduleTime,
      calendar: id,
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
