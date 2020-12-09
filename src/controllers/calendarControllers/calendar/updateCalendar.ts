import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Calendar } from '../../../db/entities/Calendar';
import { ICalendar } from '../../../types/ICalendar';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, name, color } = req.body as ICalendar;

  try {
    const _calendarAuthority = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userAuthorities', 'userAuthorities')
      .where('user.id= :id', { id: userId })
      // .andWhere('userAuthorities.calendarId= :calendarId', { calendarId })
      .getOne();

    console.log(_calendarAuthority);
    if (!_calendarAuthority) {
      return res.status(401).send('사용가능한 캘린더 없음');
    } else {
      // if (!_calendarAuthority.myCalendarAuthorities[0].write) {
      //   return res.status(401).send('캘린더 쓰기 권한 없음');
      // }
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
      .where('id = :id', { id: calendarId })
      .execute();

    return res.status(200).send('캘린더 수정 완료');
  } catch (error) {
    return res.status(400).send('캘린더 수정 오류');
  }
};
