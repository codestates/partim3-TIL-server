import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tag } from '../../../db/entities/Tag';
import { User } from '../../../db/entities/User';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagId } = req.body as ITag;

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

  const result = await getRepository(Tag)
    .createQueryBuilder('tag')
    .delete()
    .where('tag.id= :id', { id: tagId })
    .execute();

  if (result) {
    if (result.affected) {
      return res.status(200).send('태그 삭제 완료');
    } else {
      return res.status(409).send('없는 태그 Id');
    }
  }

  return res.status(400);
};
