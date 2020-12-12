import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IMessage } from '../../types/IMessage';

export default async (req: Request, res: Response) => {
  const { userId, messageId } = req.body as IMessage;

  // try {
  //   const _message = await getRepository(User)
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.messages', 'messages')
  //     .where('user.id = :userId', { userId })
  //     .andWhere('messages.id = :messageId', { messageId })
  //     .getOne();

  //   if (!_message) {
  //     return res.status(400).send('유저 정보 없거나 메세지 없음');
  //   }
  // } catch (error) {
  //   return res.status(400).send(error);
  // }

  try {
    const authority = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userAuthorities', 'userAuthorities')
      .getOne();

    console.log(authority);

    return res.status(200).send('asdf');
  } catch (error) {
    return res.status(400).send('Asdf');
  }
};
