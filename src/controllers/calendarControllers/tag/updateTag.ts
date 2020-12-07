import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import { Tag } from '../../../db/entities/Tag';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagId, tagName, tagColor, description } = req.body as ITag;

  const _myTags = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.tags', 'tags')
    .where('user.id= :id', { id: userId })
    .getMany();

  if (_myTags[0]) {
    let isTag = false as boolean;
    for await (const element of _myTags[0].tags) {
      if (element.id === tagId) {
        isTag = true;
      }
    }
    if (!isTag) {
      return res.status(409).send('유저가 가지고 있지 않은 태그');
    }
  }

  const result = await getConnection()
    .createQueryBuilder()
    .update(Tag)
    .set({
      tagName,
      tagColor,
      description,
    })
    .where('id = :id', { id: tagId })
    .execute();

  if (result) {
    if (result.affected) {
      return res.status(200).send('태그 수정 완료');
    } else {
      return res.status(409).send('태그 수정 오류');
    }
  }

  return res.status(400);
};
