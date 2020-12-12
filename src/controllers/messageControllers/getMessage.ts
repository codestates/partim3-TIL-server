import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  try {
    const _messages = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.messages', 'messages')
      .where('user.id= :userId', { userId })
      .getOne();

    console.log(_messages);

    if (_messages) {
      return res.status(200).json({
        myMessages: _messages.messages,
      });
    } else {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
