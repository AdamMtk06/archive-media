import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // تأكد من وجود هذا السطر
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import fs from "fs";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
dotenv.config();
connectDB();
app.use(cookieParser());
app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes); // تأكد من وجود هذا السطر

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