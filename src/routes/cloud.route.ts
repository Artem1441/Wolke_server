import { Router } from "express";
import multer from "multer";
import CloudController from "../controllers/cloud.controller";
import queryDB from "../db";
import authenticateTokenMiddleware from "../middlewares/authenticateToken.middleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post(
  "/cloud/upload",
  authenticateTokenMiddleware,
  upload.array("files"),
  CloudController.upload
);

router.get(
  "/cloud/gallery",
  authenticateTokenMiddleware,
  async (req: any, res) => {
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
      const { rows } = await queryDB(query, [userId, limit, offset]);
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Ошибка при получении галереи" });
    }
  }
);

export default router;
