import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tag } from '../../../db/entities/Tag';
import { User } from '../../../db/entities/User';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagName, tagColor, description } = req.body as ITag;

  const myTags = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.tags', 'tags')
    .where('user.id= :id', { id: userId })
    .getMany();

  if (myTags[0]) {
    for await (const element of myTags[0].tags) {
      if (element.tagName === tagName) {
        return res.status(409).send('이미 있는 태그 이름');
      }
    }
  }

  const result = await getConnection()
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

  if (result === undefined) {
    return res.status(409).send(result);
  } else {
    return res.status(201).send('태그 생성 완료');
  }

  return res.status(400);
};
