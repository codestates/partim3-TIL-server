import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../db/entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req: Request, res: Response) => {

  const { email, password } = req.body;

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.email= :email", { email })
    .getOne();

  if (user === undefined) {
    return res.status(401).send("회원 정보 없음");
  } else if (user.email === email && user.password === password) {
    const token: any = await jwt.sign(
      {
        email,
      },
      `${process.env.TOKEN_SECRET}`
    );

    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ token })
      .where("email = :email", { email })
      .execute();

    return res.status(200).json({
      id: user.id,
      nickname: user.nickname,
      token,
    });
  }

  return res.status(400);
};
