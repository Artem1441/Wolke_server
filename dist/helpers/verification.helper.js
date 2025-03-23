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
exports.verifyCode = exports.generateVerificationCode = void 0;
const db_1 = __importDefault(require("../db"));
const auth_db_1 = require("../db/auth.db");
const mail_helper_1 = require("./mail.helper");
const sms_helper_1 = require("./sms.helper");
const generateVerificationCode = (login, type, value) => __awaiter(void 0, void 0, void 0, function* () {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    yield (0, auth_db_1.createVerificatioCodeQuery)({
        login,
        type,
        value,
        code,
        expiresAt,
    });
    if (type === "phone") {
        yield (0, sms_helper_1.sendSms)(value, `Ваш код подтверждения: ${code}`);
    }
    else {
        yield (0, mail_helper_1.sendEmail)(value, "Код подтверждения", `Ваш код: ${code}`);
    }
});
exports.generateVerificationCode = generateVerificationCode;
const verifyCode = (login, type, value, code) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(login, type, value, code);
    const result = yield (0, db_1.default)(`SELECT * FROM verification_codes
       WHERE user_login = $1 AND type = $2 AND value = $3 AND code = $4
       AND expires_at > NOW() AND is_used = false`, [login, type, value, code]);
    if (result.rowCount === 0) {
        return { status: false, message: "Неверный или просроченный код" };
    }
    yield (0, db_1.default)(`UPDATE verification_codes SET is_used = true WHERE id = $1`, [
        result.rows[0].id,
    ]);
    if (type === "phone") {
        yield (0, db_1.default)(`UPDATE users SET is_confirmed_phone = true WHERE login = $1`, [
            login,
        ]);
    }
    else {
        yield (0, db_1.default)(`UPDATE users SET is_confirmed_email = true WHERE login = $1`, [
            login,
        ]);
    }
    return {
        status: true,
        message: `${type === "phone" ? "Телефон" : "Email"} подтверждён`,
    };
});
exports.verifyCode = verifyCode;
