import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Tag } from '../../../db/entities/Tag';
import { ITag } from '../../../types/ITag';

export default async (req: Request, res: Response) => {
  const { tagId } = req.body as ITag;

  const result = await getRepository(Tag)
    .createQueryBuilder('tag')
    .delete()
    .where('tag.id= :id', { id: tagId })
    .execute();

  if (result !== undefined) {
    if (result.affected) {
      return res.status(200).send('태그 삭제 완료');
    } else {
      return res.status(409).send('없는 태그 Id');
    }
  }

  return res.status(400);
};
