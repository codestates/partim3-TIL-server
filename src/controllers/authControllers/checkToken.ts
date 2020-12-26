import { Request, Response } from 'express';
import { IUser } from '../../types/IUser';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response): void => {
  const { token } = req.body as IUser;
  const token_secret = String(process.env.TOKEN_SECRET);

  try {
    jwt.verify(token, token_secret);
    res.status(200).send('유효한 토큰');
  } catch (error) {
    res.status(400).send(error);
  }
};
