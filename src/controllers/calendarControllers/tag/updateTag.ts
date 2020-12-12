import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Tag } from '../../../db/entities/Tag';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagId, tagName, tagColor, description } = req.body as ITag;

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
      .update(Tag)
      .set({
        tagName,
        tagColor,
        description,
      })
      .where('id = :tagId', { tagId })
      .execute();

    return res.status(200).send('태그 수정 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
