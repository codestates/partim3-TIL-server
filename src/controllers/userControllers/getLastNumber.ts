import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../db/entities/User';

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const _userCount = await getRepository(User)
      .createQueryBuilder('user')
      .getCount();

    return res.status(200).send(_userCount);
  } catch (error) {
    return res.status(400).send(error);
  }
};
