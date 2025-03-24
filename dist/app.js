"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const cloud_route_1 = __importDefault(require("./routes/cloud.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// sendEmail("artem.volcano@gmail.com", "Test", "test")
app.use((0, cors_1.default)({
    origin: process.env.CORS_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.use(express_1.default.json());
app.use("/api", auth_route_1.default);
app.use("/api", cloud_route_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
