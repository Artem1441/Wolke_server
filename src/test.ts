import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import bodyParser from "body-parser";
import multer from "multer";
import multerS3 from "multer-s3";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || "",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_KEY || "",
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: process.env.S3_BUCKET || "",
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/upload", upload.array("upl", 25), (req: any, res, next) => {
  if (req.files) {
    res.send({
      message: "Uploaded!",
      urls: req.files.map((file: any) => {
        return {
          url: file.location,
          name: file.key,
          type: file.mimetype,
          size: file.size,
        };
      }),
    });
  } else {
    res.status(400).send("No files uploaded");
  }
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
