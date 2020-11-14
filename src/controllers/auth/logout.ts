import { Request, Response } from "express";
import { getConnection, IsNull } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const token = req.header("Authorization");

  res.removeHeader("Authorization");

  await getConnection()
    .createQueryBuilder()
    .update(User)
    .set({ token: undefined })
    .where("token = :token", { token })
    .execute();

  return res.status(400);
};
