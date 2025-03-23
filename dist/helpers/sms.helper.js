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
exports.sendSms = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendSms = (phone, message) => __awaiter(void 0, void 0, void 0, function* () {
    const login = String(process.env.SMS_LOGIN);
    const password = String(process.env.SMS_PASSWORD);
    const sender = String(process.env.SMS_SENDER);
    const url = "https://smsc.ru/sys/send.php";
    const params = new URLSearchParams({
        login,
        psw: password,
        phones: `+${phone}`,
        mes: message,
        sender,
        charset: "utf-8",
        fmt: "3",
    });
    try {
        const response = yield axios_1.default.post(url, params);
        const data = response.data;
        if (data.id) {
            return {
                status: true,
                data: data.id,
            };
        }
        else {
            return {
                status: false,
                message: `Ошибка: ${data.error_code} - ${data.error}`,
            };
        }
    }
    catch (error) {
        return { status: false, message: "Ошибка при отправке письма по смс" };
    }
});
exports.sendSms = sendSms;
