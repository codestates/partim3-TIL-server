import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../../db/entities/Calendar';
import { User } from '../../../db/entities/User';
import { IUser } from '../../../types/IUser';

export default async (req: Request, res: Response) => {
  const { userId, calendarId } = req.body as IUser;

  try {
    const _myCalendars = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.myCalendars', 'myCalendars')
      .where('user.id= :id', { id: userId })
      .orWhere('myCalendars.id = :id', { id: calendarId })
      .getOne();

    if (!_myCalendars) {
      return res.status(400).send('유저가 가지고 있지 않은 캘린더');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .delete()
      .where('calendar.id= :id', { id: calendarId })
      .execute();

    return res.status(200).send('캘린더 삭제 완료');
  } catch (error) {
    return res.status(400).send('캘린더 삭제 오류');
  }
};
