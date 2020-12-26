import { Request, Response } from 'express';
import { User } from '../../db/entities/User';
import socialController from './socialController';

export default (req: Request, res: Response): Response => {
  const { oauthType } = req.body as User;

  switch (oauthType) {
    case 'google':
      void socialController.google(req, res);
      break;
    default:
      res.status(409).send('oauthType 확인 바람');
      break;
  }
  return res.status(400);
};
