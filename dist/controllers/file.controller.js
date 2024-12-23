"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Настройка S3
const s3 = new aws_sdk_1.default.S3({
    endpoint: process.env.S3_ENDPOINT,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    s3ForcePathStyle: true,
});
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
});
class FileController {
    uploadFile(req, res) {
        if (!req.file) {
            return res.status(400).send("Нет файла для загрузки");
        }
        const params = {
            Bucket: process.env.S3_BUCKET || "",
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };
        s3.upload(params, (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Ошибка при загрузке файла");
            }
            res.status(200).json({
                message: "Файл успешно загружен",
                fileUrl: data.Location,
            });
        });
    }
    getFileUrl(req, res) {
        const { filename } = req.params;
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: filename,
        };
        const fileUrl = s3.getSignedUrl("getObject", params);
        res.json({ fileUrl });
    }
}
exports.default = new FileController();
