import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const { id } = req.body;

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ token: undefined })
    .where("id = :id", { id })
    .execute()
    .then(() => {
      return res.status(200).send("토큰 삭제 완료");
    });

  return res.status(400);
};
