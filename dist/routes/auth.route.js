"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authenticateToken_middleware_1 = __importDefault(require("../middlewares/authenticateToken.middleware"));
const validateUserExists_middleware_1 = __importDefault(require("../middlewares/validateUserExists.middleware"));
const router = (0, express_1.Router)();
router.get("/auth/status", authenticateToken_middleware_1.default, validateUserExists_middleware_1.default, auth_controller_1.default.status);
router.get("/auth/logout", auth_controller_1.default.logout);
router.post("/auth/signIn", auth_controller_1.default.signIn);
router.post("/auth/signUp", auth_controller_1.default.signUp);
router.post("/auth/confirmCode", auth_controller_1.default.confirmCode);
router.post("/auth/refreshConfirmCode", auth_controller_1.default.refreshConfirmCode);
exports.default = router;
