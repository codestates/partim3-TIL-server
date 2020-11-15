import { Request, Response } from "express";

import socialController from "./socialController";

export default (req: Request, res: Response) => {
  const { oauthType } = req.body;

  switch (oauthType) {
    case "github":
      socialController.github(req, res);
      break;
    case "kakao":
      socialController.kakao(req, res);
      break;
    case "google":
      socialController.google(req, res);
      break;
    case "naver":
      socialController.naver(req, res);
      break;
    default:
      res.status(409).send("oauthType 확인 바람");
      break;
  }
};
