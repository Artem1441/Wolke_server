import { Router } from "express";
import UserController from "../controllers/users.controller";
import { checkAuth } from "../middlewares/auth.middleware";
import { validateUserData } from "../middlewares/validation.middleware";

const router = Router();

// router.get("/users", checkAuth, UserController.getUsers);
// router.post("/users", checkAuth, validateUserData, UserController.createUser);

router.get("/users", UserController.getUsers);
router.post("/users", UserController.createUser);

export default router;
