"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_s3_1 = require("@aws-sdk/client-s3");
const body_parser_1 = __importDefault(require("body-parser"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const s3 = new client_s3_1.S3Client({
    endpoint: process.env.S3_ENDPOINT || "",
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET_KEY || "",
    },
});
const upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3,
        acl: "public-read",
        bucket: process.env.S3_BUCKET || "",
        key: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
});
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/upload", upload.array("upl", 25), (req, res, next) => {
    if (req.files) {
        res.send({
            message: "Uploaded!",
            urls: req.files.map((file) => {
                return {
                    url: file.location,
                    name: file.key,
                    type: file.mimetype,
                    size: file.size,
                };
            }),
        });
    }
    else {
        res.status(400).send("No files uploaded");
    }
});
app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});
