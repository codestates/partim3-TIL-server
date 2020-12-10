import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';
import { ITodo } from '../../../types/ITodo';
import { UserCalendarAuthority } from '../../../db/entities/UserCalendarAuthority';

export default async (req: Request, res: Response) => {
  const { userId, calendarId, todoId } = req.body as ITodo;

  const _calendarAuthorityUsers = await getRepository(UserCalendarAuthority)
    .createQueryBuilder('userCalendarAuthority')
    .leftJoinAndSelect('user.myCalendars', 'myCalendars')
    .where('userCalendarAuthority.id= :id', { id: userId })
    .getMany();

  // if (_myCalendars[0]) {
  //   let isCalendar = false as boolean;
  //   for await (const element of _myCalendars[0].myCalendars) {
  //     if (element.id === calendarId) {
  //       isCalendar = true;
  //     }
  //   }
  //   if (!isCalendar) {
  //     return res.status(409).send('유저가 가지고 있지 않은 캘린더');
  //   }
  // }

  // const _todo = await getRepository(User)
  //   .createQueryBuilder('user')
  //   .leftJoinAndSelect('user.myCalendars', 'myCalendars')
  //   .where('user.id= :id', { id: userId })
  //   .getMany();

  // if (_myCalendars[0]) {
  //   let isCalendar = false as boolean;
  //   for await (const element of _myCalendars[0].myCalendars) {
  //     if (element.id === calendarId) {
  //       isCalendar = true;
  //     }
  //   }
  //   if (!isCalendar) {
  //     return res.status(409).send('유저가 가지고 있지 않은 캘린더');
  //   }
  // }

  const result = await getRepository(Todo)
    .createQueryBuilder('todo')
    .delete()
    .where('todo.id= :id', { id: todoId })
    .execute();

  if (result) {
    if (result.affected) {
      return res.status(200).send('TODO 삭제 완료');
    } else {
      return res.status(409).send('TODO 삭제 오류');
    }
  }

  return res.status(400);
};
