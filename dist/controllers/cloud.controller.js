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
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const cloud_db_1 = require("../db/cloud.db");
const compressFile_helper_1 = require("../helpers/compressFile.helper");
const s3_helper_1 = require("../helpers/s3.helper");
class CloudController {
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { files } = req;
            const { is_active } = req.body;
            if (!files || !Array.isArray(files) || files.length === 0) {
                res.status(400).send("Нет файлов для загрузки");
                return;
            }
            console.log(is_active);
            const userId = req.user.id;
            const uploadedFiles = [];
            const unsupportedFiles = []; // Массив для хранения ошибок неподдерживаемых файлов
            for (const file of req.files) {
                const fileKey = (0, uuid_1.v4)();
                const fileType = file.mimetype.split("/")[1];
                const normalizedFileType = fileType === "jpeg"
                    ? "jpg"
                    : fileType === "quicktime" || fileType === "webm"
                        ? "mp4"
                        : fileType;
                const fileName = file.originalname;
                if (!["jpg", "png", "mp4", "mov", "avi", "quicktime"].includes(normalizedFileType)) {
                    console.warn(`Файл ${fileName} имеет неподдерживаемый формат. Пропускаем.`);
                    unsupportedFiles.push(fileName);
                    continue;
                }
                let compressedBuffer = file.buffer;
                try {
                    if (["jpg", "png"].includes(normalizedFileType)) {
                        compressedBuffer = yield (0, compressFile_helper_1.compressImage)(file.buffer);
                    }
                    else if (["mp4", "mov", "avi"].includes(normalizedFileType)) {
                        compressedBuffer = yield (0, compressFile_helper_1.compressVideo)(file.buffer);
                    }
                    // const data = await S3Upload(fileKey, compressedBuffer, file.mimetype);
                    // const url = data.Location;
                    const url = yield (0, s3_helper_1.S3Upload)(fileKey, compressedBuffer, file.mimetype);
                    console.log(url);
                    const id = yield (0, cloud_db_1.uploadFileQuery)(userId, fileName, normalizedFileType, compressedBuffer.length, url, is_active);
                    uploadedFiles.push({
                        id,
                        type: normalizedFileType,
                        url,
                    });
                }
                catch (error) {
                    console.error("Ошибка загрузки файла:", error);
                }
            }
            let responseMessage = {
                status: true,
                result: uploadedFiles,
            };
            if (unsupportedFiles.length > 0) {
                responseMessage = Object.assign(Object.assign({}, responseMessage), { message: `Файлы с неподдерживаемым форматом: ${unsupportedFiles.join(", ")}` });
            }
            res.status(200).json(responseMessage);
        });
    }
}
exports.default = new CloudController();
