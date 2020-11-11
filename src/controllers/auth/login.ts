import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../db/entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req: Request, res: Response) => {
  const { email, password, nickname, oauthType, id } = req.body;

  if (
    oauthType === "kakao" ||
    oauthType === "github" ||
    oauthType === "naver" ||
    oauthType === "google"
  ) {
    const user: any = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.socialId= :socialId", { socialId: id })
      .getOne();

    if (user === undefined) {
      const token = await jwt.sign(
        {
          id,
        },
        `${process.env.TOKEN_SECRET}`
      );

      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          oauthType,
          nickname,
          socialId: id,
        })
        .execute();

      res.setHeader("Authorizatioin", token);

      return res.status(200).send("유저데이터 추가 및 토큰 생성완료");
    } else if (user.socialId === id && user.oauthType === oauthType) {
      const token = await jwt.sign(
        {
          id,
        },
        `${process.env.TOKEN_SECRET}`
      );

      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ token })
        .where("socialId = :socialId", { socialId: id })
        .execute();

      res.setHeader("Authorizatioin", token);

      return res.status(200).send("토큰 생성 완료");
    } else {
      return res
        .status(409)
        .send("아이디는 같은데 타입이 다른게 데이터 베이스에 있음");
    }
  } else {
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

      res.setHeader("Authorizatioin", token);

      return res.status(200).send("로그인 완료 및 토큰 생성 완료");
    }
  }
  return res.status(400);
};
