import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { IUser } from '../../types/IUser';
import { User } from '../../db/entities/User';
import { Message } from '../../db/entities/Message';

export default async (req: Request, res: Response) => {
  const {
    userId,
    otherNickname,
    read,
    write,
    auth,
    description,
    calendarId,
  } = req.body as IUser;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .where('user.id= :userId', { userId })
      .andWhere('CalendarAuthorities.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    if (_user) {
      if (_user.nickname === otherNickname) {
        return res.status(400).send('같은 사용자');
      }
      if (!_user.CalendarAuthorities[0].auth) {
        return res.status(400).send('공유 권한 없음');
      }
    } else {
      return res.status(400).send('유저 정보 없음 또는 권한 없는 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.CalendarAuthorities', 'CalendarAuthorities')
      .where('user.nickname= :otherNickname', { otherNickname })
      .andWhere('CalendarAuthorities.calendarId = :calendarId', {
        calendarId,
      })
      .getOne();

    console.log(_user);

    if (_user) {
      return res.status(400).send('없는 닉네임 또는 공유중인 캘린더');
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
            read,
            write,
            auth,
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
