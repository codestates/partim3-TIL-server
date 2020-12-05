import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { IUser } from '../../../types/IUser';

export default async (req: Request, res: Response) => {
  // const { idToken } = req.body as IUser;
  // const oauthType = req.params.id;

  // const responseData = await axios.get('https://api.github.com/user', {
  //   headers: {
  //     Authorization: `token ${idToken}`,
  //   },
  // });

  // if (responseData === undefined) {
  //   return res.status(401).send('idToken 확인 바람');
  // } else {
  //   const socialId = Number(responseData.data.id);
  //   const nickname = responseData.data.login;

  //   const token = await jwt.sign(
  //     {
  //       socialId,
  //     },
  //     `${process.env.TOKEN_SECRET}`
  //   );

  //   const user = await getRepository(User)
  //     .createQueryBuilder('user')
  //     .where('user.socialId= :socialId', { socialId })
  //     .getOne();

  //   if (user === undefined) {
  //     await getConnection()
  //       .createQueryBuilder()
  //       .insert()
  //       .into(User)
  //       .values({
  //         oauthType,
  //         nickname,
  //         socialId,
  //         token,
  //       })
  //       .execute()
  //       .then((result) => {
  //         return res.status(200).json({
  //           id: result.generatedMaps[0].id,
  //           nickname,
  //           token,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     await getConnection()
  //       .createQueryBuilder()
  //       .update(User)
  //       .set({ token })
  //       .where('socialId = :socialId', { socialId })
  //       .execute()
  //       .catch((error) => {
  //         console.log(error);
  //       });

  //     await getRepository(User)
  //       .createQueryBuilder('user')
  //       .where('user.socialId= :socialId', { socialId })
  //       .getOne()
  //       .then((result) => {
  //         return res.status(200).json({
  //           id: result?.id,
  //           nickname: result?.nickname,
  //           token: result?.token,
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }

  return res.status(400);
};
