import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../db/entities/User";

export default async (req: Request, res: Response) => {
  const { id, nickname, password, newPassword } = req.body;

  const user: any = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.id= :id", { id })
    .getOne();

  if (
    user.password === password &&
    user.password !== newPassword &&
    user.nickname === nickname
  ) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword })
      .where("id = :id", { id })
      .execute();

    return res.status(200).send("비밀번호 변경 완료!!");
  } else if (
    user.password === password &&
    user.password !== newPassword &&
    user.nickname !== nickname
  ) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: newPassword, nickname })
      .where("id = :id", { id })
      .execute();

    return res.status(200).send("닉네임, 비밀번호 변경 완료!!");
  } else if (
    user.password !== password ||
    (user.password !== newPassword && user.nickname !== nickname)
  ) {
    await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ nickname })
      .where("id = :id", { id })
      .execute();

    return res.status(200).send("닉네임 완료!!");
  } else if (
    user.password === password &&
    user.password === newPassword &&
    user.nickname === nickname
  ) {
    return res.status(409).send("변경사항 없음!!");
  } else {
  }
  return res.status(400);
};
