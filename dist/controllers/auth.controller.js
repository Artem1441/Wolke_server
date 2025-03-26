"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_helper_1 = require("../helpers/bcrypt.helper");
const jwt_helper_1 = require("../helpers/jwt.helper");
const verification_helper_1 = require("../helpers/verification.helper");
const auth_db_1 = require("../db/auth.db");
class AuthController {
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });
            res.status(200).json({ message: "Вы вышли" });
        });
    }
    status(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, login } = req.user;
            const token = (0, jwt_helper_1.jwtSign)({ id, login });
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({ status: true });
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, login, password } = req.body;
                const isUniqEmail = yield (0, auth_db_1.getUserBy)("email", email);
                const isUniqPhone = yield (0, auth_db_1.getUserBy)("phone", phone);
                const isUniqLogin = yield (0, auth_db_1.getUserBy)("login", login);
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
                const hashedPassword = yield (0, bcrypt_helper_1.bcryptHash)(password);
                yield (0, auth_db_1.signUpQuery)(name, email, phone, login, hashedPassword);
                yield (0, verification_helper_1.generateVerificationCode)(login, "email", email);
                yield (0, verification_helper_1.generateVerificationCode)(login, "phone", phone);
                res.status(200).json({ status: true });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: false, message: "Что-то пошло не так" });
            }
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, password } = req.body;
                const isSignIn = yield (0, auth_db_1.signInQuery)(login, password);
                if (!isSignIn.status) {
                    res.status(500).json({ status: false, message: isSignIn.message });
                    return;
                }
                const token = (0, jwt_helper_1.jwtSign)({ id: isSignIn.data, login });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
                res.status(200).json({ status: true });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ status: false, message: "Что-то пошло не так" });
            }
        });
    }
    confirmCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { login, type, value, code } = req.body;
                const user = yield (0, auth_db_1.getUserBy)("login", login);
                if (!["phone", "email"].includes(type)) {
                    res.status(400).json({ error: "Неверный тип" });
                    return;
                }
                const response = yield (0, verification_helper_1.verifyCode)(login, type, value, code);
                const token = (0, jwt_helper_1.jwtSign)({ id: user.id, login });
                if (response.status) {
                    res.cookie("token", token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                }
                res.status(response.status ? 200 : 400).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ error: "Ошибка сервера" });
                return;
            }
        });
    }
    refreshConfirmCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { login } = req.body;
            const user = yield (0, auth_db_1.getUserBy)("login", login);
            if (!user) {
                res.status(500).json({
                    status: false,
                    message: "Пользователя не существует",
                });
                return;
            }
            yield (0, verification_helper_1.generateVerificationCode)(login, "email", user.email);
            yield (0, verification_helper_1.generateVerificationCode)(login, "phone", user.phone);
        });
    }
}
exports.default = new AuthController();
