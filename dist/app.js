"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const users_route_1 = __importDefault(require("./routes/users.route"));
// import fileRouter from "./routes/file.route"; // Импорт нового маршрута
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express_1.default.json());
app.use("/api", users_route_1.default);
// app.use("/api/files", fileRouter); // Используем новый роутер для файлов
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
