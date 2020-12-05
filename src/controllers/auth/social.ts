import { Request, Response } from 'express';
import { User } from '../../db/entities/User';
import socialController from './socialController';

export default (req: Request, res: Response) => {
  const { oauthType } = req.body as User;

  switch (oauthType) {
    case 'github':
      void socialController.github(req, res);
      break;
    case 'kakao':
      void socialController.kakao(req, res);
      break;
    case 'google':
      void socialController.google(req, res);
      break;
    case 'naver':
      void socialController.naver(req, res);
      break;
    default:
      res.status(409).send('oauthType 확인 바람');
      break;
  }
};
