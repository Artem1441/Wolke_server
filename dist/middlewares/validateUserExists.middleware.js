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
const auth_db_1 = require("../db/auth.db");
const validateUserExistsMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ error: "Отсутствует идентификатор пользователя" });
        return;
    }
    try {
        const user = yield (0, auth_db_1.getUserQuery)(userId);
        if (!user) {
            res
                .status(401)
                .json({ error: "Пользователь не найден или деактивирован" });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Ошибка при проверке пользователя:", error);
        res
            .status(500)
            .json({ error: "Серверная ошибка при проверке пользователя" });
        return;
    }
});
exports.default = validateUserExistsMiddleware;
