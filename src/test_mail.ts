import nodemailer from "nodemailer";

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

const transporter = nodemailer.createTransport({
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
async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
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
  } catch (error) {
    console.error("Ошибка при отправке письма:", error);
  }
}

// Вызов функции отправки
sendMail(
  "mail@wolke.ru",
  "Тестовая тема",
  "Привет! Это тестовое письмо."
);
