import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../../db/entities/Calendar';
import { User } from '../../../db/entities/User';
import { IUser } from '../../../types/IUser';

export default async (req: Request, res: Response) => {
  const { userId, calendarId } = req.body as IUser;

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

  const result = await getRepository(Calendar)
    .createQueryBuilder('calendar')
    .delete()
    .where('calendar.id= :id', { id: calendarId })
    .execute();

  if (result) {
    if (result.affected) {
      return res.status(200).send('캘린더 삭제 완료');
    } else {
      return res.status(409).send('캘린더 삭제 오류');
    }
  }

  return res.status(400);
};
