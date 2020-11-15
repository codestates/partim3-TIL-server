import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../../db/entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async (req: Request, res: Response) => {
  const user = await getRepository(User)
    .createQueryBuilder("user")
    .where("user.email= :email", { email })
    .getOne();
};
