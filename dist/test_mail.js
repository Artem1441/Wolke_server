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
const nodemailer_1 = __importDefault(require("nodemailer"));
// Настройка транспорта для отправки писем
// const transporter = nodemailer.createTransport({
//   host: "smtp.mail.ru", // SMTP-сервер. Уточните у вашего хостинг-провайдера.
//   port: 465, // Порт для SSL
//   secure: true, // Использовать SSL
//   auth: {
//     user: "mail@wolke.ru", // Ваша почта
//     pass: "fZ8aX7xX8fwI9xB0", // Пароль от почты
//   },
// });
const transporter = nodemailer_1.default.createTransport({
    host: 'mail.hosting.reg.ru',
    port: 465, // Порт для SSL
    secure: true, // SSL/TLS
    auth: {
        user: 'mail@wolke.ru', // Ваша почта
        pass: 'fZ8aX7xX8fwI9xB0', // Пароль от почты
    },
    logger: true, // Включить логирование
    debug: true,
});
// Функция отправки письма
function sendMail(to, subject, text) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail({
                from: '"Wolke Service" <mail@wolke.ru>', // От кого (можно указать имя)
                to, // Кому
                subject, // Тема письма
                text, // Текст письма
                headers: {
                    'X-Mailer': 'Nodemailer', // Указывает, что используется Nodemailer
                    'Precedence': 'bulk', // Для массовой рассылки
                },
                // html: '<b>Это письмо в HTML формате</b>' // Если хотите отправить HTML
            });
            console.log("Письмо отправлено: %s", info.messageId);
        }
        catch (error) {
            console.error("Ошибка при отправке письма:", error);
        }
    });
}
// Вызов функции отправки
sendMail("mail@wolke.ru", "Тестовая тема", "Привет! Это тестовое письмо.");
