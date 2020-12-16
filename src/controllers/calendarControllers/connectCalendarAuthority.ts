import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IMessage } from '../../types/IMessage';
import { UserCalendarAuthority } from '../../db/entities/UserCalendarAuthority';
import { Message } from '../../db/entities/Message';

export default async (req: Request, res: Response) => {
  const { userId, messageId, answer } = req.body as IMessage;

  try {
    const _message = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.messages', 'messages')
      .where('user.id= :userId', { userId })
      .andWhere('messages.id = :messageId', { messageId })
      .getOne();

    if (!_message) {
      return res
        .status(400)
        .send('유저 정보 없음 또는 가지고 있지 않은 메세지');
    }

    const _authority = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userCalendarAuthorities',
        'userCalendarAuthorities'
      )
      .innerJoinAndSelect(
        'userCalendarAuthorities.calenderAuthority',
        'calenderAuthority'
      )
      .where('user.id= :userId', { userId })
      .andWhere('calenderAuthority.calendarId = :calendarId', {
        calendarId: _message.messages[0].shareCalendar,
      })
      .getOne();

    if (_authority) {
      await getRepository(Message)
        .createQueryBuilder('message')
        .delete()
        .where('message.id= :messageId', { messageId })
        .execute();
      return res.status(400).send('공유중인 캘린더(메세지 삭제)');
    }

    if (answer) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserCalendarAuthority)
        .values({
          user: userId,
          calenderAuthority: _message.messages[0].shareCalendar,
        })
        .execute();
      return res.status(201).send('수락 -> 권한 연결 완료 및 메세지 삭제');
    } else {
      await getRepository(Message)
        .createQueryBuilder('message')
        .delete()
        .where('message.id= :messageId', { messageId })
        .execute();
      return res.status(200).send('거절 -> 메세지 삭제');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
