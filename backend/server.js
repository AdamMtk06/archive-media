import dotenv from "dotenv";

dotenv.config();

import express from "express";
import path from "path";
import morgan from "morgan";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js"; // إضافة مسارات الملفات
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import fs from "fs";
import cors from "cors";
import mongoose from "mongoose"; // إضافة mongoose
import { initGridFS } from "./config/gridfs.js"; // إعداد GridFS

connectDB();
const app = express();
app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);



// إعداد GridFS بعد الاتصال بقاعدة البيانات
mongoose.connection.once('open', () => {
  console.log('GridFS initialized'.green.bold);
  initGridFS();
});

app.use(cookieParser());
app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/media", mediaRoutes); // إضافة مسارات الملفات

if (process.env.NODE_ENV === "production") {
  const staticFolder = express.static(
    path.resolve(__dirname, "frontend", "build")
  );
  app.use(staticFolder);
  const buildFolder = path.join(__dirname, "frontend", "build");
  app.get("*", (req, res) => {
    if (fs.existsSync(buildFolder)) {
      const indexFile = path.resolve(
        __dirname,
        "frontend",
        "build",
        "index.html"
      );
      res.sendFile(indexFile);
    } else {
      res.send({
        message: "build folder not found !",
        path: buildFolder,
      });
    }
  });
} else {
  app.get("/", (req, res) => res.send("API is running..."));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);