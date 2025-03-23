"use strict";
// import AWS from "aws-sdk";
// import dotenv from "dotenv";
// dotenv.config();
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
exports.S3Upload = void 0;
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
const client_s3_1 = require("@aws-sdk/client-s3"); // Новый SDK для S3
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Создаем экземпляр S3 клиента
const s3 = new client_s3_1.S3({
    endpoint: String(process.env.S3_ENDPOINT),
    region: String(process.env.S3_REGION),
    credentials: {
        accessKeyId: String(process.env.S3_ACCESS_KEY),
        secretAccessKey: String(process.env.S3_SECRET_KEY),
    },
    forcePathStyle: true, // Это нужно для использования с MinIO или другими серверами, поддерживающими S3 API
});
// Переписанная функция загрузки
const S3Upload = (fileKey, compressedBuffer, mimetype) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield s3.putObject(params); // Здесь нет поля Location, метод просто завершает загрузку без возврата данных
        // Формируем и возвращаем URL загруженного файла
        // const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${fileKey}`;
        // return fileUrl;  // Возвращаем сформированный URL
        const fileUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${fileKey}`;
        return fileUrl;
    }
    catch (error) {
        console.error("Ошибка загрузки в S3:", error);
        return "";
    }
});
exports.S3Upload = S3Upload;
