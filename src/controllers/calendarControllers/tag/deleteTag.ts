import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tag } from '../../../db/entities/Tag';
import { User } from '../../../db/entities/User';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagId } = req.body as ITag;

  try {
    const _myTags = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tags', 'tags')
      .where('user.id= :userId', { userId })
      .andWhere('tags.id = :tagId', { tagId })
      .getOne();

    if (!_myTags) {
      return res.status(400).send('유저 정보 없음 또는 가지고 있지 않은 태그');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Tag)
      .where('id = :tagId', { tagId })
      .execute();

    return res.status(200).send('태그 삭제 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
