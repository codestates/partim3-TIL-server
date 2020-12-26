import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { CalendarAuthority } from '../../../db/entities/CalendarAuthority';
import { User } from '../../../db/entities/User';
import { IUser } from '../../../types/IUser';

export default async (req: Request, res: Response): Promise<Response> => {
  const { userId, authorityId } = req.body as IUser;

  try {
    const _user = await getRepository(User)
      .createQueryBuilder('user')
      .where('user.id= :userId', { userId })
      .getOne();

    if (!_user) {
      return res.status(400).send('유저 정보 없음');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    const _authority = await getRepository(CalendarAuthority)
      .createQueryBuilder('calendarAuthority')
      .where('calendarAuthority.ownerId = :ownerId', { ownerId: userId })
      .andWhere('calendarAuthority.user != :user', { user: userId })
      .andWhere('calendarAuthority.id = :authorityId', { authorityId })
      .getOne();

    if (_authority) {
      if (_authority.id === authorityId) {
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(CalendarAuthority)
          .where('id = :authorityId', { authorityId })
          .execute();

        return res.status(200).send('권한 삭제 완료');
      } else {
        return res.status(400).send('권한 아이디 불일치');
      }
    } else {
      return res.status(400).send('없는 권한');
    }
  } catch (error) {
    return res.status(400).send(error);
  }
};
