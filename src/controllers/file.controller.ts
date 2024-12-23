// src/controllers/file.controller.ts
import { Request, Response } from "express";
import multer from "multer";
import AWS from "aws-sdk";

// Настройка S3
const s3 = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  s3ForcePathStyle: true,
});

const upload = multer({
  storage: multer.memoryStorage(),
});

class FileController {
  uploadFile(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).send("Нет файла для загрузки");
    }

    const params = {
      Bucket: process.env.S3_BUCKET || "",
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    s3.upload(params, (err: any, data: any) => {
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

  getFileUrl(req: Request, res: Response) {
    const { filename } = req.params;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: filename,
    };

    const fileUrl = s3.getSignedUrl("getObject", params);

    res.json({ fileUrl });
  }
}

export default new FileController();
