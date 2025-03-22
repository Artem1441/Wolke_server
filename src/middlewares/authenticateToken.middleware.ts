import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "../helpers/jwt.helper";

const authenticateTokenMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ error: "Требуется токен" });
    return;
  }

  try {
    const decoded = jwtVerify(token);
    req.user = decoded; // Добавляем декодированный токен в объект запроса
    next();
  } catch (error) {
    res.status(403).json({ error: "Недействительный токен" });
    return;
  }
};

export default authenticateTokenMiddleware;
