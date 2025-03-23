"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserData = void 0;
const validateUserData = (req, res, next) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).send("Name and email are required");
        return;
    }
    next();
};
exports.validateUserData = validateUserData;
