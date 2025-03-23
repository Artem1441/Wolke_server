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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInQuery = exports.signUpQuery = exports.getUserBy = exports.getUserQuery = exports.createVerificatioCodeQuery = void 0;
const _1 = __importDefault(require("."));
const bcrypt_helper_1 = require("../helpers/bcrypt.helper");
const createVerificatioCodeQuery = (_a) => __awaiter(void 0, [_a], void 0, function* ({ login, type, value, code, expiresAt, }) {
    yield (0, _1.default)(`INSERT INTO verification_codes (user_login, type, value, code, expires_at)
     VALUES ($1, $2, $3, $4, $5)`, [login, type, value, code, expiresAt]);
});
exports.createVerificatioCodeQuery = createVerificatioCodeQuery;
const getUserQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE id = $1`;
    const result = yield (0, _1.default)(query, [id]);
    return result.rows[0];
});
exports.getUserQuery = getUserQuery;
const getUserBy = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE ${key} = $1`;
    const result = yield (0, _1.default)(query, [value]);
    return result.rows[0];
});
exports.getUserBy = getUserBy;
const signUpQuery = (name, email, phone, login, password) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `INSERT INTO users (name, email, phone, login, password) VALUES ($1, $2, $3, $4, $5) RETURNING id;`;
    const result = yield (0, _1.default)(query, [name, email, phone, login, password]);
    return result.rows[0].id;
});
exports.signUpQuery = signUpQuery;
const signInQuery = (login, password) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM users WHERE login = $1`;
    const result = yield (0, _1.default)(query, [login]);
    const user = result.rows[0];
    if (!user)
        return { status: false, message: "Нет пользователя с таким логином" };
    console.log(password, user.password);
    const isCorrectPassword = yield (0, bcrypt_helper_1.bcryptCompare)(password, user.password);
    if (!isCorrectPassword)
        return { status: false, message: "Пароль не подходит" };
    return { status: true, data: user.id };
});
exports.signInQuery = signInQuery;
