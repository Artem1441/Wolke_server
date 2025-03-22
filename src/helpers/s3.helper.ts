// import AWS from "aws-sdk";
// import dotenv from "dotenv";
// dotenv.config();

// const s3 = new AWS.S3({
//   endpoint: process.env.S3_ENDPOINT,
//   accessKeyId: process.env.S3_ACCESS_KEY,
//   secretAccessKey: process.env.S3_SECRET_KEY,
//   s3ForcePathStyle: true,
// });

// export const S3Upload = async (fileKey: any, compressedBuffer: any, mimetype: any) => {
//   const params = {
//     Bucket: process.env.S3_BUCKET || "",
//     Key: fileKey,
//     Body: compressedBuffer,
//     ContentType: mimetype,
//   };

//   return await s3.upload(params).promise();
// };

import { S3 } from "@aws-sdk/client-s3"; // Новый SDK для S3
import dotenv from "dotenv";
dotenv.config();

// Создаем экземпляр S3 клиента
const s3 = new S3({
  endpoint: String(process.env.S3_ENDPOINT),
  region: String(process.env.S3_REGION),
  credentials: {
    accessKeyId: String(process.env.S3_ACCESS_KEY),
    secretAccessKey: String(process.env.S3_SECRET_KEY),
  },
  forcePathStyle: true, // Это нужно для использования с MinIO или другими серверами, поддерживающими S3 API
});

// Переписанная функция загрузки
export const S3Upload = async (
  fileKey: string,
  compressedBuffer: Buffer,
  mimetype: string
) => {
  try {
    const params = {
      Bucket: String(process.env.S3_BUCKET), // Указываем имя бакета
      Key: fileKey, // Имя файла
      Body: compressedBuffer, // Тело запроса (содержимое файла)
      ContentType: mimetype, // Тип контента (например, image/jpeg)
      ContentDisposition: "inline", // Для inline-отображения (опционально)
      CacheControl: "max-age=31536000", // Контроль кеширования
    };

    // Загружаем файл в S3 с использованием метода `putObject`
    await s3.putObject(params); // Здесь нет поля Location, метод просто завершает загрузку без возврата данных

    // Формируем и возвращаем URL загруженного файла
    // const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;
    // return fileUrl;  // Возвращаем сформированный URL

    const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileKey}`;
    return fileUrl;
  } catch (error: any) {
    console.error("Ошибка загрузки в S3:", error);
    return "";
  }
};
