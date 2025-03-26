// helpers/jwt.helper.ts

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const jwtSign = ({ id, login }: any): string => {
  return jwt.sign({ id, login }, String(process.env.JWT_SECRET_KEY), {
    expiresIn: "1d",
  });
};

export const jwtVerify = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
};
