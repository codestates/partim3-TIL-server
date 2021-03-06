import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { ICalendar } from '../../../types/ICalendar';
import { Calendar } from '../../../db/entities/Calendar';
import { CalendarAuthority } from '../../../db/entities/CalendarAuthority';
import { User } from '../../../db/entities/User';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, name, color } = req.body as ICalendar;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.CalendarAuthorities',
        'CalendarAuthorities',
        'CalendarAuthorities.ownerId = :ownerId',
        { ownerId: userId }
      )
      .leftJoinAndSelect('CalendarAuthorities.calendar', 'calendar')
      .where('user.id= :userId', { userId })
      .andWhere('calendar.name = :name', { name })
      .getOne();

    if (_myCalendars) {
      return res.status(400).send('이미 있는 캘린더 이름');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    const _calendar = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Calendar)
      .values({
        name,
        color,
        user: _user?.id,
      })
      .execute();

    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(CalendarAuthority)
      .values({
        read: true,
        write: true,
        auth: true,
        ownerNickname: _user?.nickname,
        calendar: _calendar.identifiers[0].id as number,
        user: _user?.id,
        ownerId: _user?.id,
      })
      .execute();

    return res.status(201).send('캘린더 생성 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
