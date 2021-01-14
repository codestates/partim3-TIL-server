import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default (req: Request, res: Response): void => {
  const token_secret = String(process.env.TOKEN_SECRET);

  try {
    if (req.headers.authorization) {
      const authorization = req.headers.authorization;
      const token = authorization.split('Bearer ')[1];
      jwt.verify(token, token_secret);
      res.status(200).send('유효한 토큰');
    } else {
      res.status(400).send('authorization 없음');
    }
  } catch (error) {
    res.status(400).send(error);
  }
};
