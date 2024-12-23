"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const router = (0, express_1.Router)();
// router.get("/users", checkAuth, UserController.getUsers);
// router.post("/users", checkAuth, validateUserData, UserController.createUser);
router.get("/users", users_controller_1.default.getUsers);
router.post("/users", users_controller_1.default.createUser);
exports.default = router;
