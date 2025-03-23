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
exports.uploadFileQuery = void 0;
const _1 = __importDefault(require("."));
const uploadFileQuery = (userId, fileName, normalizedFileType, fileSize, url, is_active) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `
    INSERT INTO files (user_id, file_name, file_type, file_size, file_url, is_active)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
    const result = yield (0, _1.default)(query, [
        userId,
        fileName,
        normalizedFileType,
        fileSize,
        url,
        is_active
    ]);
    return result.rows[0].id;
});
exports.uploadFileQuery = uploadFileQuery;
