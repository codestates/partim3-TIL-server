import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const { userId, date } = req.params;

  const resultTodos: Array<any> = [];
  const resultReviews: Array<any> = [];

  const todos = await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.todos", "todo")
    .where("user.id = :id", { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < result[0].todos.length; i++) {
          if (result[0].todos[i].scheduleTime === date) {
            resultTodos.push(result[0].todos[i]);
          }
        }
      }
      console.log("todos ", result[0].todos);
    })
    .catch((error) => {
      res.status(401).send(error);
    });

  const reviews = await getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.reviews", "review")
    .where("user.id = :id", { id: userId })
    .getMany()
    .then((result) => {
      if (result !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < result[0].reviews.length; i++) {
          if (result[0].reviews[i].scheduleTime === date) {
            resultReviews.push(result[0].reviews[i]);
          }
        }
      }
    })
    .catch((error) => {
      res.status(401).send(error);
    });

  return res.status(200).json({
    resultTodos,
    resultReviews,
  });

  return res.status(400);
};
