import { Request, response, Response } from "express";
import { getRepository, getConnection } from "typeorm";
import { User } from "../../../db/entities/User";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export default async (req: Request, res: Response) => {
  const { token } = req.body;

  process.env.GITHUB_CLIENTID;
  process.env.GITHUB_SECRET;

  const responseData = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: "token " + "aa7c1f94be67796390ada2eea6834d57d798e748",
    },
  });
  res.status(200).send("dldf");
};
