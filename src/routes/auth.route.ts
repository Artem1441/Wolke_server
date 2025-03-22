import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import authenticateTokenMiddleware from "../middlewares/authenticateToken.middleware";
import validateUserExistsMiddleware from "../middlewares/validateUserExists.middleware";

const router = Router();

router.get(
  "/auth/status",
  authenticateTokenMiddleware,
  validateUserExistsMiddleware,
  AuthController.status
);
router.get("/auth/logout", AuthController.logout);
router.post("/auth/signIn", AuthController.signIn);
router.post("/auth/signUp", AuthController.signUp);
router.post("/auth/confirmCode", AuthController.confirmCode);
router.post("/auth/refreshConfirmCode", AuthController.refreshConfirmCode);

export default router;
