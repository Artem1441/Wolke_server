// src/app.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route";
import cloudRouter from "./routes/cloud.route";
import { sendEmail } from "./helpers/mail.helper";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

sendEmail("artem.volcano@gmail.com", "Test", "test")
app.use(
  cors({
    origin: process.env.CORS_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/api", authRouter);
app.use("/api", cloudRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
