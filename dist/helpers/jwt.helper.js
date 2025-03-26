"use strict";
// helpers/jwt.helper.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = exports.jwtSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSign = ({ id, login }) => {
    return jsonwebtoken_1.default.sign({ id, login }, String(process.env.JWT_SECRET_KEY), {
        expiresIn: "1d",
    });
};
exports.jwtSign = jwtSign;
const jwtVerify = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
};
exports.jwtVerify = jwtVerify;
