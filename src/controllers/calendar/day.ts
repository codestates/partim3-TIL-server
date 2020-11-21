import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const userId2: string = req.query.userId!;
  const date: String = req.query.date;

  console.log("데이트다", JSON.parse(date));

  const todos: Array<any> = [];
  const reviews: Array<any> = [];

  // await getRepository(User)
  //   .createQueryBuilder("user")
  //   .leftJoinAndSelect("user.todos", "todo")
  //   .where("user.id = :id", { id: puserId })
  //   .getMany()
  //   .then((result) => {
  //     if (result !== undefined) {
  //       // tslint:disable-next-line: prefer-for-of
  //       for (let i = 0; i < result[0].todos.length; i++) {
  //         if (result[0].todos[i].scheduleTime === date) {
  //           todos.push(result[0].todos[i]);
  //         }
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(401).send(error);
  //   });

  // await getRepository(User)
  //   .createQueryBuilder("user")
  //   .leftJoinAndSelect("user.reviews", "review")
  //   .where("user.id = :id", { id: userId })
  //   .getMany()
  //   .then((result) => {
  //     if (result !== undefined) {
  //       // tslint:disable-next-line: prefer-for-of
  //       for (let i = 0; i < result[0].reviews.length; i++) {
  //         const currentDay = JSON.parse(result[0].reviews[i].scheduleTime);
  //         if (currentDay.year === date) {
  //           reviews.push(result[0].reviews[i]);
  //         }
  //       }
  //     }
  //   })
  //   .catch((error) => {
  //     res.status(401).send(error);
  //   });

  return res.status(200).json({
    todos,
    reviews,
  });

  return res.status(400);
};
