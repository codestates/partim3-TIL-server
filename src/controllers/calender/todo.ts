import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Todo } from "../../db/entities/Todo";

export default async (req: Request, res: Response) => {
  const { id, title, sceduleTime } = req.body;

  const result = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Todo)
    .values({
      title,
      sceduleTime,
      user: id,
    })
    .execute()
    .then(() => {
      return res.status(200).send("todo 생성 완료");
    })
    .catch((error) => {
      return res.status(401).send(error);
    });
  return res.status(400);
};
