import { RSA_NO_PADDING } from "constants";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.email= :email", { email })
    .getOne();

  if (user === undefined) {
    return res.status(401).send("회원가입 해야함");
  } else {
    if (user.email === email && user.password === password) {
      return res.status(200).send("로그인 완료");
    }
  }
  return res.status(400);
};
