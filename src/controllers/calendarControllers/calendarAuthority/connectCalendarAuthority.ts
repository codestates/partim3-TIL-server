import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { IMessage } from '../../../types/IMessage';
import { Message } from '../../../db/entities/Message';
import { CalendarAuthority } from '../../../db/entities/CalendarAuthority';

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

    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .where('user.id= :userId', { userId })
      .andWhere('CalendarAuthorities.calendarId = :calendarId', {
        calendarId: _message.messages[0].shareCalendar,
      })
      .getOne();

    if (_user) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Message)
        .where('id= :messageId', { messageId })
        .execute();
      return res.status(400).send('공유중인 캘린더(메세지 삭제)');
    }

    const _fromUser = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :fromUser', { fromUser: _message.messages[0].fromUser })
      .getOne();

    if (!_fromUser) {
      return res.status(400).send('받아온 메세지 주인 없음');
    }

    if (answer) {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(CalendarAuthority)
        .values({
          read: _message.messages[0].read,
          write: _message.messages[0].write,
          auth: _message.messages[0].auth,
          ownerNickname: _fromUser.nickname,
          calendar: _message.messages[0].shareCalendar,
          user: userId,
          ownerId: _message.messages[0].fromUser,
        })
        .execute();

      await getRepository(Message)
        .createQueryBuilder('message')
        .delete()
        .where('message.id= :messageId', { messageId })
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
