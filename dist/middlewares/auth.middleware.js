"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const checkAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).send("Unauthorized");
        return;
    }
    next();
};
exports.checkAuth = checkAuth;
