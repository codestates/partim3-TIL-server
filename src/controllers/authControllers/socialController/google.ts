import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ISocial } from '../../../types/ISocial';

export default async (req: Request, res: Response) => {
  const { idToken, oauthType } = req.body as ISocial;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENTID,
    });

    const payload = ticket.getPayload();

    if (payload === undefined) {
      return res.status(400).send('payload undefined');
    } else {
      const socialId = payload['sub'];
      const nickname = payload['name'];

      const token = jwt.sign(
        {
          socialId,
        },
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${process.env.TOKEN_SECRET}`
      );

      const user = await getRepository(User)
        .createQueryBuilder('user')
        .where('user.socialId= :socialId', { socialId })
        .getOne();

      if (user === undefined) {
        const _user = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(User)
          .values({
            oauthType,
            nickname,
            socialId,
            token,
          })
          .execute();

        return res.status(201).json({
          userId: _user.identifiers[0].id as number,
          nickname,
          token,
        });
      } else {
        const _user = await getRepository(User)
          .createQueryBuilder('user')
          .where('user.socialId= :socialId', { socialId })
          .getOne();

        if (!_user) {
          res.status(400).send('등록되지 않은 유저');
        } else {
          await getConnection()
            .createQueryBuilder()
            .update(User)
            .set({ token })
            .where('socialId = :socialId', { socialId })
            .execute();

          return res.status(200).json({
            userId: _user.id,
            nickname: _user.nickname,
            token: token,
          });
        }
      }
    }
  } catch (error) {
    return res.status(400);
  }
};
