import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Calendar } from '../../../db/entities/Calendar';
import { ICalendar } from '../../../types/ICalendar';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, name, color } = req.body as ICalendar;

  const _myCalendars = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('user.id= :id', { id: userId })
    .getMany();

  if (_myCalendars[0]) {
    let isCalendar = false as boolean;
    for await (const element of _myCalendars[0].myCalendars) {
      if (element.id === calendarId) {
        isCalendar = true;
      }
    }
    if (!isCalendar) {
      return res.status(409).send('유저가 가지고 있지 않은 캘린더');
    }
  }

  const result = await getConnection()
    .createQueryBuilder()
    .update(Calendar)
    .set({
      name,
      color,
    })
    .where('id = :id', { id: calendarId })
    .execute();

  if (result) {
    if (result.affected) {
      return res.status(200).send('캘린더 수정 완료');
    } else {
      return res.status(409).send('캘린더 수정 오류');
    }
  }

  return res.status(400);
};
