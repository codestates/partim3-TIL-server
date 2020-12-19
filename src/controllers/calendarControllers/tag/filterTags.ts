import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Todo } from '../../../db/entities/Todo';

export default async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

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
    const _tags = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tags', 'tags')
      .leftJoinAndSelect('tags.todoTags', 'todoTags')
      .leftJoinAndSelect('todoTags.todo', 'todo')
      .leftJoinAndSelect('tags.reviewTags', 'reviewTags')
      .leftJoinAndSelect('reviewTags.review', 'review')
      .where('user.id = :userId', { userId })
      .getOne();

    return res.status(200).json({
      tags: _tags?.tags,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
