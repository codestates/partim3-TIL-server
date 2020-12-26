import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { ISocial } from '../../../types/ISocial';

export default async (req: Request, res: Response): Promise<Response> => {
  const { idToken, oauthType } = req.body as ISocial;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENTID);

  const token_secret = String(process.env.TOKEN_SECRET);

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
          })
          .execute();

        const userId = _user.identifiers[0].id as number;

        const token = jwt.sign({ userId }, token_secret, {
          expiresIn: '30 minutes',
        });

        await getConnection()
          .createQueryBuilder()
          .update(User)
          .set({
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
          return res.status(400).send('등록되지 않은 유저');
        } else {
          const userId = _user.id;

          const token = jwt.sign({ userId }, token_secret, {
            expiresIn: '30 minutes',
          });

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
    return res.status(400).send(error);
  }
};
