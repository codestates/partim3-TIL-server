import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Calendar } from '../../../db/entities/Calendar';
import { ICalendar } from '../../../types/ICalendar';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, calendarId, name, color } = req.body as ICalendar;

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
      if (_user.CalendarAuthorities[0].write) {
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
      } else {
        return res.status(400).send('쓰기 권한 없음');
      }
    } else {
      return res.status(400).send('유저 정보 없음 또는 권한 없는 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
