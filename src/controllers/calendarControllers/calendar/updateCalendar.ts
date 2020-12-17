import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Calendar } from '../../../db/entities/Calendar';
import { ICalendar } from '../../../types/ICalendar';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, name, color } = req.body as ICalendar;

  try {
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
        calendarId,
      })
      .getOne();

    if (!_authority) {
      return res.status(400).send('유저 정보 없음 또는 권한이 없는 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

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
    await getConnection()
      .createQueryBuilder()
      .update(Calendar)
      .set({
        name,
        color,
      })
      .where('id = :calendarId', { calendarId })
      .execute();

    return res.status(200).send('캘린더 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
