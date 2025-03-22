import { Request, Response, NextFunction } from "express";
import { getUserQuery } from "../db/auth.db";

const validateUserExistsMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Отсутствует идентификатор пользователя" });
    return;
  }

  try {
    const user = await getUserQuery(userId);

    if (!user) {
      res
        .status(401)
        .json({ error: "Пользователь не найден или деактивирован" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Ошибка при проверке пользователя:", error);
    res
      .status(500)
      .json({ error: "Серверная ошибка при проверке пользователя" });
    return;
  }
};

export default validateUserExistsMiddleware;
