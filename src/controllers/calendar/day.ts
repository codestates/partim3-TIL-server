/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';
import { IDate } from '../../types/IDate';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  const date = JSON.parse(req.query.date as string) as IDate;

  const todos: Array<any> = [];
  const reviews: Array<any> = [];

  await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.todos', 'todo')
    .where('user.id = :id', { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        for (const element of result[0].todos) {
          const currentDay = JSON.parse(element.scheduleTime) as IDate;
          if (
            currentDay.year === date.year &&
            currentDay.month === date.month &&
            currentDay.day === date.day
          ) {
            todos.push(element);
          }
        }
      }
    })
    .catch((error) => {
      res.status(401).send(error);
    });

  await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.reviews', 'review')
    .where('user.id = :id', { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        for (const element of result[0].reviews) {
          const currentDay = JSON.parse(element.scheduleTime) as IDate;
          if (
            currentDay.year === date.year &&
            currentDay.month === date.month &&
            currentDay.day === date.day
          ) {
            reviews.push(element);
          }
        }
      }
    })
    .catch((error) => {
      res.status(401).send(error);
    });

  return res.status(200).json({
    todos,
    reviews,
  });

  return res.status(400);
};
