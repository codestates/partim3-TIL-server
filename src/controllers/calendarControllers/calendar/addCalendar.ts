import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { ICalendar } from '../../../types/ICalendar';
import { Calendar } from '../../../db/entities/Calendar';
import { CalendarAuthority } from '../../../db/entities/CalendarAuthority';
import { User } from '../../../db/entities/User';

export default async (req: Request, res: Response) => {
  const { userId, name, color } = req.body as ICalendar;

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :userId', { userId })
      .andWhere('myCalendars.name = :name', { name })
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

    const calendar = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Calendar)
      .values({
        name,
        color,
        owner: userId,
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
        calendar: calendar.identifiers[0].id as number,
        owner: userId,
      })
      .execute();

    return res.status(201).send('캘린더 생성 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
