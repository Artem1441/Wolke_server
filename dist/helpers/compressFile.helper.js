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
exports.compressVideo = exports.compressImage = void 0;
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
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
const tinify_1 = __importDefault(require("tinify"));
tinify_1.default.key = "SrChG7xg56Tm3PW9fPyfVGWTMwJKVh3S";
const compressImage = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = tinify_1.default.fromBuffer(buffer);
        const compressedBuffer = Buffer.from(yield source.toBuffer());
        return compressedBuffer;
    }
    catch (error) {
        console.error("Ошибка при сжатии изображения:", error);
        throw error;
    }
});
exports.compressImage = compressImage;
const compressVideo = (inputBuffer) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const tempInputPath = path_1.default.join((0, os_1.tmpdir)(), `${(0, uuid_1.v4)()}.mp4`);
        const tempOutputPath = path_1.default.join((0, os_1.tmpdir)(), `${(0, uuid_1.v4)()}.mp4`);
        fs_1.default.writeFileSync(tempInputPath, inputBuffer);
        (0, fluent_ffmpeg_1.default)(tempInputPath)
            .output(tempOutputPath)
            .videoCodec("libx264")
            .format("mp4")
            .outputOptions("-preset fast")
            .outputOptions("-crf 28")
            .outputOptions("-vf scale=-2:720")
            .on("end", () => {
            const compressedBuffer = fs_1.default.readFileSync(tempOutputPath);
            fs_1.default.unlinkSync(tempInputPath);
            fs_1.default.unlinkSync(tempOutputPath);
            resolve(compressedBuffer);
        })
            .on("error", (err) => {
            fs_1.default.unlinkSync(tempInputPath);
            reject(err);
        })
            .run();
    });
});
exports.compressVideo = compressVideo;
