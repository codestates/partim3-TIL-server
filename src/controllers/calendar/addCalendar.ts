import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { ICalendar } from '../../types/ICalendar';
import { Calendar } from '../../db/entities/Calendar';
import { CalendarAuthority } from '../../db/entities/CalendarAuthority';
import { IUser } from '../../types/IUser';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response) => {
  const { id } = req.body as IUser;
  const { name, color } = req.body as ICalendar;

  const myCalendars = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('user.id= :id', { id })
    .getMany();

  if (myCalendars[0]) {
    for await (const element of myCalendars[0].myCalendars) {
      if (element.name === name) {
        return res.status(401).send('이미 있는 캘린더 이름');
      }
    }
  }

  const calendar = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Calendar)
    .values({
      name,
      color,
      owner: id,
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
      ownerNickname: myCalendars[0].nickname,
      calendar: calendar.identifiers[0].id as number,
      owner: id,
    })
    .execute()
    .then(() => {
      return res.status(200).send('캘린더 생성 완료');
    })
    .catch((error) => {
      return res.status(401).send(error);
    });

  return res.status(400);
};
