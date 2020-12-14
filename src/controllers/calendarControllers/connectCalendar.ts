import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../db/entities/User';
import { IMessage } from '../../types/IMessage';
import { CalendarAuthority } from '../../db/entities/CalendarAuthority';
import { UserCalendarAuthority } from '../../db/entities/UserCalendarAuthority';
import { Calendar } from '../../db/entities/Calendar';

export default async (req: Request, res: Response) => {
  const { userId, messageId } = req.body as IMessage;

  try {
    const authorities = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'user.userCalendarAuthorities',
        'userCalendarAuthorities'
      )
      .getOne();

    console.log(authorities?.userCalendarAuthorities);

    // const _message = await getRepository(User)
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.messages', 'messages')
    //   .where('user.id = :userId', { userId })
    //   .andWhere('messages.id = :messageId', { messageId })
    //   .getOne();

    // console.log(_message);

    // if (!_message) {
    //   return res.status(400).send('유저 정보 없거나 메세지 없음');
    // }

    // const _authority = await getRepository(User)
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.userAuthorities', 'userAuthorities')
    //   .where('userAuthorities.userId = :userId', { userId })
    //   .getOne();

    // console.log(_authority);
    // // let ids: number[];

    // const _myAuthority = await getRepository(Calendar)
    //   .createQueryBuilder('calendar')
    //   .leftJoinAndSelect('calendar.authorities', 'authorities')
    //   .where('authorities.id IN (:...ids)', { ids: [1, 2, 3] })
    //   .andWhere('authorities.calendarId = :calendarId', {
    //     calendarId: _message.messages[0].shareCalendar,
    //   })
    //   .getMany();

    // console.log(_myAuthority);

    // if (_myAuthority) {
    //   return res.status(400).send('공유되고 있는 캘린더');
    // } else {
    // }

    return res.status(200).send('asdf');
  } catch (error) {
    return res.status(400).send('Asdf');
  }
};
