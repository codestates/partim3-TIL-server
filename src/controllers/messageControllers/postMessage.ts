import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { IUser } from '../../types/IUser';
import { User } from '../../db/entities/User';
import { Message } from '../../db/entities/Message';

export default async (req: Request, res: Response) => {
  const { userId, otherNickname, description, calendarId } = req.body as IUser;

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :userId', { userId })
      .andWhere('myCalendars.id = :calendarId', { calendarId })
      .getOne();

    if (!_myCalendars) {
      return res
        .status(400)
        .send('유저 정보 없음 또는 가지고 있지 않은 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.messages',
        'messages',
        'messages.fromUser = :userId AND messages.shareCalendar = :calendarId',
        {
          userId,
          calendarId,
        }
      )
      .where('user.nickname= :otherNickname', { otherNickname })
      .getOne();

    if (_user) {
      if (_user.messages.length > 0) {
        return res.status(400).send('전송된 공유');
      } else {
        await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Message)
          .values({
            description,
            fromUser: userId,
            shareCalendar: calendarId,
            user: _user.id,
          })
          .execute();

        return res.status(201).send('전송 완료');
      }
    } else {
      return res.status(400).send('없는 닉네임');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
