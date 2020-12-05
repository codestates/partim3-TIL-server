import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tag } from '../../db/entities/Tag';
import { User } from '../../db/entities/User';
import { ITag } from '../../types/ITag';

export default async (req: Request, res: Response) => {
  const { userId, tagName, tagColor, description } = req.body as ITag;

  const myTags = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.tags', 'tags')
    .where('user.id= :id', { id: userId })
    .getMany();

  console.log(myTags[0]);

  if (myTags[0]) {
    for await (const element of myTags[0].tags) {
      if (element.tagName === tagName) {
        return res.status(409).send('이미 있는 태그 이름');
      }
    }
  }

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
    .execute()
    .then(() => {
      return res.status(201).send('태그 생성 완료');
    })
    .catch((error) => {
      return res.status(409).send(error);
    });

  return res.status(400);
};
