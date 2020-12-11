import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tag } from '../../../db/entities/Tag';
import { User } from '../../../db/entities/User';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagName, tagColor, description } = req.body as ITag;

  try {
    const _myTags = await getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.tags', 'tags')
      .where('user.id= :userId', { userId })
      .andWhere('tags.tagName = :tagName', { tagName })
      .getOne();

    if (_myTags) {
      return res.status(400).send('이미 있는 태그 이름');
    }
  } catch (error) {
    return res.status(400).send(error);
  }

  try {
    await getConnection()
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values({
        tagName,
        tagColor,
        description,
        user: userId,
      })
      .execute();

    return res.status(201).send('태그 생성 완료');
  } catch (error) {
    return res.status(400).send(error);
  }
};
