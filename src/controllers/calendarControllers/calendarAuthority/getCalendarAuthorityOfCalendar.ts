import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Calendar } from '../../../db/entities/Calendar';

export default async (req: Request, res: Response) => {
  const calendarId = Number(req.query.calendarId);

  try {
    const _calendars = await getRepository(Calendar)
      .createQueryBuilder('calendar')
      .leftJoinAndSelect('calendar.authorities', 'authorities')
      .leftJoin('authorities.user', 'user')
      .addSelect(['user.nickname'])
      .andWhere('calendar.id= :calendarId', { calendarId })
      .getOne();

    if (_calendars) {
      return res.status(200).json({
        calendars: _calendars,
      });
    } else {
      return res.status(400).send('없는 캘린더');
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
