import { Request, Response } from "express";
import { bcryptHash } from "../helpers/bcrypt.helper";
import { jwtSign } from "../helpers/jwt.helper";
import {
  generateVerificationCode,
  verifyCode,
} from "../helpers/verification.helper";
import { getUserBy, signInQuery, signUpQuery } from "../db/auth.db";

class AuthController {
  async logout(req: any, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Вы вышли" });
  }

  async status(req: any, res: Response) {
    const { id, login } = req.user;
    const token = jwtSign({ id, login });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure только в проде
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ status: true });
  }

  async signUp(req: Request, res: Response) {
    try {
      const { name, email, phone, login, password } = req.body;

      const isUniqEmail = await getUserBy("email", email);
      const isUniqPhone = await getUserBy("phone", phone);
      const isUniqLogin = await getUserBy("login", login);
      if (isUniqEmail) {
        res.status(500).json({
          status: false,
          message: "Пользователь с такой почтой уже есть в сервисе",
        });
        return;
      }
      if (isUniqPhone) {
        res.status(500).json({
          status: false,
          message: "Пользователь с таким номером уже есть в сервисе",
        });
        return;
      }
      if (isUniqLogin) {
        res.status(500).json({
          status: false,
          message: "Пользователь с таким логином уже есть в сервисе",
        });
        return;
      }

      const hashedPassword = await bcryptHash(password);
      await signUpQuery(name, email, phone, login, hashedPassword);

      await generateVerificationCode(login, "email", email);
      await generateVerificationCode(login, "phone", phone);

      res.status(200).json({ status: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, message: "Что-то пошло не так" });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const { login, password } = req.body;
      const isSignIn = await signInQuery(login, password);
      if (!isSignIn.status) {
        res.status(500).json({ status: false, message: isSignIn.message });
        return;
      }

      const token = jwtSign({ id: isSignIn.data, login });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Secure только в проде
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ status: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ status: false, message: "Что-то пошло не так" });
    }
  }

  async confirmCode(req: any, res: Response) {
    try {
      const { login, type, value, code } = req.body;

      const user = await getUserBy("login", login);

      if (!["phone", "email"].includes(type)) {
        res.status(400).json({ error: "Неверный тип" });
        return;
      }

      const response = await verifyCode(
        login,
        type as "phone" | "email",
        value,
        code
      );

      const token = jwtSign({ id: user.id, login });

      if (response.status) {
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Secure только в проде
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res.status(response.status ? 200 : 400).json(response);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Ошибка сервера" });
      return;
    }
  }

  async refreshConfirmCode(req: any, res: Response) {
    const { login } = req.body;
    const user = await getUserBy("login", login);
    if (!user) {
      res.status(500).json({
        status: false,
        message: "Пользователя не существует",
      });
      return;
    }

    await generateVerificationCode(login, "email", user.email);
    await generateVerificationCode(login, "phone", user.phone);
  }
}

export default new AuthController();
