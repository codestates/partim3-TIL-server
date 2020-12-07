import { Request, Response } from 'express';
import { getRepository, getConnection } from 'typeorm';
import { User } from '../../../db/entities/User';
import jwt from 'jsonwebtoken';

export default async (req: Request, res: Response) => {
  return res.status(400);
};
