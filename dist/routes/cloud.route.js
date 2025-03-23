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
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloud_controller_1 = __importDefault(require("../controllers/cloud.controller"));
const db_1 = __importDefault(require("../db"));
const authenticateToken_middleware_1 = __importDefault(require("../middlewares/authenticateToken.middleware"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = (0, express_1.Router)();
router.post("/cloud/upload", authenticateToken_middleware_1.default, upload.array("files"), cloud_controller_1.default.upload);
router.get("/cloud/gallery", authenticateToken_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;
        const query = `
        SELECT file_url AS url, file_type AS type 
        FROM files 
        WHERE user_id = $1 AND is_active = true 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
        const { rows } = yield (0, db_1.default)(query, [userId, limit, offset]);
        res.json(rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ошибка при получении галереи" });
    }
}));
exports.default = router;
