// src/app.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import usersRouter from "./routes/users.route";
// import fileRouter from "./routes/file.route"; // Импорт нового маршрута

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use("/api", usersRouter);
// app.use("/api/files", fileRouter); // Используем новый роутер для файлов

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
