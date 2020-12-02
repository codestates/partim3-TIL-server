import { Request, Response } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Tag } from '../../db/entities/Tag';
import { IUser } from '../../types/IUser';
import { User } from '../../db/entities/User';
import { ITag } from '../../types/ITag';

export default async (req: Request, res: Response) => {
  const { id } = req.body as IUser;
  const { tagName, tagColor } = req.body as ITag;

  const myTags = await getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.tags', 'tags')
    .where('user.id= :id', { id })
    .getMany();

  console.log(myTags);
  // if (myCalendars[0]) {
  //   for await (const element of myCalendars[0].myCalendars) {
  //     if (element.name === name) {
  //       return res.status(401).send('이미 있는 캘린더 이름');
  //     }
  //   }
  // }

  await getConnection()
    .createQueryBuilder()
    .insert()
    .into(Tag)
    .values({
      tagName,
      tagColor,
      user: id,
    })
    .execute();

  return res.status(400);
};
