import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../../db/entities/Calendar';
import { User } from '../../../db/entities/User';
import { IUser } from '../../../types/IUser';

export default async (req: Request, res: Response) => {
  const { userId, calendarId } = req.body as IUser;

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
        await getRepository(Calendar)
          .createQueryBuilder('calendar')
          .delete()
          .where('calendar.id= :calendarId', { calendarId })
          .execute();

        return res.status(200).send('캘린더 삭제 완료');
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
