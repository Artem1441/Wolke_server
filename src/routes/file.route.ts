import { Router } from "express";
import multer from "multer";
import FileController from "../controllers/file.controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post("/upload", upload.single("file"), (req: any, res: any) => {
  if (req.file) {
    return FileController.uploadFile(req, res);
  } else {
    return res.status(400).send("Нет файла для загрузки");
  }
});

export default router;
