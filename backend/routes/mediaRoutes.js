import express from 'express';
import { uploadMedia, getUserMedia, getMediaFile, deleteMedia } from '../controllers/mediaController.js';
import { protect } from '../middlewares/authMidlleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// تأكد أن مجلد uploads موجود
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// إعداد Multer لتخزين الملفات في مجلد uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// مسار رفع ملف جديد
router.post(
  '/',
  protect,
  upload.single('file'),
  async (req, res, next) => {
    console.log('=== Upload Request Start ===');
    console.log('User:', req.user ? req.user.id : 'No user');
    console.log('File:', req.file ? req.file.originalname : 'No file');
    next();
  },
  uploadMedia
);

// عرض ملفات المستخدم الحالي
router.get('/user', protect, async (req, res, next) => {
  console.log('=== Get User Media ===');
  console.log('User:', req.user ? req.user.id : 'No user');
  next();
}, getUserMedia);

// عرض ملف محدد
router.get('/file/:id', protect, async (req, res, next) => {
  console.log('=== Get Media File ===');
  console.log('User:', req.user ? req.user.id : 'No user');
  console.log('File ID:', req.params.id);
  next();
}, getMediaFile);

// حذف ملف
router.delete('/:id', protect, async (req, res, next) => {
  console.log('=== Delete Media File ===');
  console.log('User:', req.user ? req.user.id : 'No user');
  console.log('File ID:', req.params.id);
  next();
}, deleteMedia);

export default router;
