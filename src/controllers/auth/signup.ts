import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const { email, password, nickname } = req.body;
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.email= :email", { email })
    .getOne();

  if (user === undefined) {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        email,
        password,
        nickname,
      })
      .execute();

    return res.status(200).send("회원 가입 완료");
  } else {
    if (user.email === email) {
      return res.status(409).send("가입되어 있는 이메일");
    }
  }
  res.status(400);
};
