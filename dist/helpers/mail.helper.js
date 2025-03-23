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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendEmail = (email, topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(email, topic, message, String(process.env.MAIL_USER), String(process.env.MAIL_PASSWORD));
    // const transporter = nodemailer.createTransport({
    //   service: "gmail", // or other services like 'yahoo', 'outlook'
    //   auth: {
    //     user: String(process.env.MAIL_USER),
    //     pass: String(process.env.MAIL_PASSWORD), // https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4PpOEhFWSLQSBlGFN2GGdelEusmBXNcKRAUlNbqOKjxNkbm5tblyXeehDi_boDUCGm4jhoQ1MKuqnUb2gykr7hJu2fCKsxR1ULDrmJB0bCF79NkgbE (if 2-step autentification is on)
    //   },
    // });
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: String(process.env.MAIL_USER),
            pass: String(process.env.MAIL_PASSWORD),
        },
    });
    const mailOptions = {
        from: String(process.env.MAIL_USER),
        to: email,
        subject: topic,
        text: message,
    };
    try {
        return transporter.sendMail(mailOptions, (error, info) => {
            console.log(error, info);
            if (error)
                return `Ошибка: ${error}`;
            else
                return `Письмо отправлено: ${info.response}`;
        });
    }
    catch (error) {
        console.log(error);
        return { status: false, message: "Ошибка при отправке письма на почту" };
    }
});
exports.sendEmail = sendEmail;
