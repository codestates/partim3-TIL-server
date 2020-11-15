import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../../db/entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { OAuth2Client } from "google-auth-library";

dotenv.config();

export default async (req: Request, res: Response) => {
  const { oauthType, idToken } = req.body;

  const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENTID,
  });

  const payload = ticket.getPayload();

  if (payload === undefined) {
    res.status(409).send("error");
  } else {
    const userid = payload["sub"];
    const nickname = payload["name"];

    const token: any = await jwt.sign(
      {
        userid,
      },
      `${process.env.TOKEN_SECRET}`
    );

    const user = await getRepository(User)
      .createQueryBuilder("user")
      .where("user.socialId= :socialId", { socialId: userid })
      .getOne();

    if (user === undefined) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          oauthType,
          nickname,
          socialId: userid,
          token,
        })
        .execute()
        .then((result) => {
          return res.status(200).json({
            id: result.generatedMaps[0].id,
            nickname,
            token,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({ token: "1234" })
        .where("socialId = :socialId", { socialId: userid })
        .execute()
        .catch((error) => {
          console.log(error);
        });

      await getRepository(User)
        .createQueryBuilder("user")
        .where("user.socialId= :socialId", { socialId: userid })
        .getOne()
        .then((result) => {
          return res.status(200).json({
            id: result?.id,
            nickname: result?.nickname,
            token: result?.token,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  return res.status(400);
};
