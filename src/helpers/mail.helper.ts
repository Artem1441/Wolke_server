// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();

// export const sendEmail = async (
//   email: string,
//   topic: string,
//   message: string
// ) => {
//   console.log(
//     email,
//     topic,
//     message,
//     String(process.env.MAIL_USER),
//     String(process.env.MAIL_PASSWORD)
//   );
//   // const transporter = nodemailer.createTransport({
//   //   service: "gmail", // or other services like 'yahoo', 'outlook'
//   //   auth: {
//   //     user: String(process.env.MAIL_USER),
//   //     pass: String(process.env.MAIL_PASSWORD), // https://myaccount.google.com/apppasswords?pli=1&rapt=AEjHL4PpOEhFWSLQSBlGFN2GGdelEusmBXNcKRAUlNbqOKjxNkbm5tblyXeehDi_boDUCGm4jhoQ1MKuqnUb2gykr7hJu2fCKsxR1ULDrmJB0bCF79NkgbE (if 2-step autentification is on)
//   //   },
//   // });

//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: String(process.env.MAIL_USER),
//       pass: String(process.env.MAIL_PASSWORD),
//     },
//     logger: true,
//     debug: true,
//   });

//   const mailOptions = {
//     from: String(process.env.MAIL_USER),
//     to: email,
//     subject: topic,
//     text: message,
//   };

//   try {
//     return transporter.sendMail(mailOptions, (error, info) => {
//       console.log(error, info);
//       if (error) return `Ошибка: ${error}`;
//       else return `Письмо отправлено: ${info.response}`;
//     });
//   } catch (error) {
//     console.log(error);
//     return { status: false, message: "Ошибка при отправке письма на почту" };
//   }
// };

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (
  email: string,
  topic: string,
  message: string
) => {
  const form = new FormData();
  form.append("email", email);
  form.append("topic", topic);
  form.append("message", message);


  try {
    const response = await axios.post(
      "https://art-studio-web-admin.ru/send/wolke/send",
      form,
    );

    console.log(response.data); // Логируем ответ от PHP
    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке запроса на PHP:", error);
    return { status: false, message: "Ошибка при отправке письма на почту" };
  }
};
