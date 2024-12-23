"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const file_controller_1 = __importDefault(require("../controllers/file.controller"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.post("/upload", upload.single("file"), (req, res) => {
    if (req.file) {
        return file_controller_1.default.uploadFile(req, res);
    }
    else {
        return res.status(400).send("Нет файла для загрузки");
    }
});
exports.default = router;
