import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { tmpdir } from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// export const compressImage = async (buffer: Buffer): Promise<Buffer> => {
//   const image = sharp(buffer);
//   const metadata = await image.metadata();

//   if (metadata.format === "png") {
//     return image
//       .png({
//         quality: 80,
//         compressionLevel: 9,
//         progressive: true,
//         palette: false,
//         adaptiveFiltering: true,
//       })
//       .toBuffer();
//   }

//   if (metadata.format === "jpeg" || metadata.format === "jpg") {
//     return image
//       .jpeg({
//         quality: 70,
//         progressive: true,
//         optimizeScans: true,
//         chromaSubsampling: '4:4:4',
//       })
//       .toBuffer();
//   }

//   return buffer;
// };
import tinify from "tinify";

tinify.key = "SrChG7xg56Tm3PW9fPyfVGWTMwJKVh3S";

export const compressImage = async (buffer: Buffer): Promise<Buffer> => {
  try {
    const source = tinify.fromBuffer(buffer);

    const compressedBuffer = Buffer.from(await source.toBuffer());

    return compressedBuffer;
  } catch (error) {
    console.error("Ошибка при сжатии изображения:", error);
    throw error;
  }
};

export const compressVideo = async (inputBuffer: Buffer): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const tempInputPath = path.join(tmpdir(), `${uuidv4()}.mp4`);
    const tempOutputPath = path.join(tmpdir(), `${uuidv4()}.mp4`);

    fs.writeFileSync(tempInputPath, inputBuffer);

    ffmpeg(tempInputPath)
      .output(tempOutputPath)
      .videoCodec("libx264")
      .format("mp4")
      .outputOptions("-preset fast")
      .outputOptions("-crf 28")
      .outputOptions("-vf scale=-2:720")
      .on("end", () => {
        const compressedBuffer = fs.readFileSync(tempOutputPath);
        fs.unlinkSync(tempInputPath);
        fs.unlinkSync(tempOutputPath);
        resolve(compressedBuffer);
      })
      .on("error", (err) => {
        fs.unlinkSync(tempInputPath);
        reject(err);
      })
      .run();
  });
};
