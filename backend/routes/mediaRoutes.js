import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  uploadMedia,
  getUserMedia,
  getMediaById,
  deleteMedia,
  getUserStats,
  searchMedia,
  adminDeleteMedia,
  adminGetAllMedia,
} from "../controllers/mediaController.js";

const router = express.Router();

// إعداد التخزين المؤقت
const tempStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// فلتر الملفات
const fileFilter = (req, file, cb) => {
  // قبول جميع أنواع الملفات
  cb(null, true);
};

const upload = multer({ 
  storage: tempStorage,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
  fileFilter: fileFilter,
});

// مسارات الوسائط للمستخدمين العاديين
router.post("/upload", protect, upload.single("file"), uploadMedia);
router.get("/", protect, getUserMedia);
router.get("/stats/user", protect, getUserStats);
router.get("/search", protect, searchMedia);
router.get("/:id", protect, getMediaById);
router.delete("/:id", protect, deleteMedia);

// مسارات الوسائط للمشرفين
router.delete("/admin/:id", protect, admin, adminDeleteMedia);
router.get("/admin/all", protect, admin, adminGetAllMedia);

export default router;