import { Request, Response, NextFunction } from "express";

export const validateUserData = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).send("Name and email are required");
    return;
  }
  next();
};
