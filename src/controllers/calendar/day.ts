import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);
  const date = JSON.parse(req.query.date as string);

  console.log("데이트다", typeof userId, date);

  const todos: Array<any> = [];
  const reviews: Array<any> = [];

  await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.todos", "todo")
    .where("user.id = :id", { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < result[0].todos.length; i++) {
          const currentDay = JSON.parse(result[0].reviews[i].scheduleTime);
          if (
            currentDay.year === date.year &&
            currentDay.month === date.year &&
            currentDay.day === date.day
          ) {
            todos.push(result[0].todos[i]);
          }
        }
      }
    })
    .catch((error) => {
      res.status(401).send(error);
    });

  await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.reviews", "review")
    .where("user.id = :id", { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < result[0].reviews.length; i++) {
          const currentDay = JSON.parse(result[0].reviews[i].scheduleTime);
          if (
            currentDay.year === date.year &&
            currentDay.month === date.year &&
            currentDay.day === date.day
          ) {
            reviews.push(result[0].reviews[i]);
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
