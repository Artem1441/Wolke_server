import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { uploadFileQuery } from "../db/cloud.db";
import { compressImage, compressVideo } from "../helpers/compressFile.helper";
import { S3Upload } from "../helpers/s3.helper";

interface UploadResponse {
  status: boolean;
  result: {
    id: any;
    type: string;
    url: string;
  }[];
  message?: string;
}

class CloudController {
  async upload(req: any, res: Response) {
    const { files } = req;
    const { is_active } = req.body;
    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).send("Нет файлов для загрузки");
      return;
    }

    console.log(is_active);

    const userId = req.user.id;
    const uploadedFiles = [];
    const unsupportedFiles = [];

    for (const file of req.files) {
      const fileKey = uuidv4();
      const fileType = file.mimetype.split("/")[1];
      const normalizedFileType =
        fileType === "jpeg"
          ? "jpg"
          : fileType === "quicktime" || fileType === "webm"
          ? "mp4"
          : fileType;
      const fileName = file.originalname;

      if (
        !["jpg", "png", "mp4", "mov", "avi", "quicktime"].includes(
          normalizedFileType
        )
      ) {
        console.warn(
          `Файл ${fileName} имеет неподдерживаемый формат. Пропускаем.`
        );
        unsupportedFiles.push(fileName);
        continue;
      }

      let compressedBuffer = file.buffer;

      try {
        if (["jpg", "png"].includes(normalizedFileType)) {
          compressedBuffer = await compressImage(file.buffer);
        } else if (["mp4", "mov", "avi"].includes(normalizedFileType)) {
          compressedBuffer = await compressVideo(file.buffer);
        }

        const url = await S3Upload(fileKey, compressedBuffer, file.mimetype);

        const id = await uploadFileQuery(
          userId,
          fileName,
          normalizedFileType,
          compressedBuffer.length,
          url,
          is_active
        );

        uploadedFiles.push({
          id,
          type: normalizedFileType,
          url,
        });
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);
      }
    }

    let responseMessage: UploadResponse = {
      status: true,
      result: uploadedFiles,
    };

    if (unsupportedFiles.length > 0) {
      responseMessage = {
        ...responseMessage,
        message: `Файлы с неподдерживаемым форматом: ${unsupportedFiles.join(
          ", "
        )}`,
      };
    }

    res.status(200).json(responseMessage);
  }
}

export default new CloudController();
