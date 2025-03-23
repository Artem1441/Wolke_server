"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_helper_1 = require("../helpers/jwt.helper");
const authenticateTokenMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ error: "Требуется токен" });
        return;
    }
    try {
        const decoded = (0, jwt_helper_1.jwtVerify)(token);
        req.user = decoded; // Добавляем декодированный токен в объект запроса
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Недействительный токен" });
        return;
    }
};
exports.default = authenticateTokenMiddleware;
