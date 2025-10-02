import Media from "../models/mediaModel.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// @desc    رفع ملف جديد
// @route   POST /api/media/upload
// @access  Private
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم اختيار ملف" });
    }

    const { description, tags } = req.body;
    
    // إنشاء مجلد فرعي حسب تاريخ اليوم
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const dateFolder = `${year}-${month}-${day}`;
    
    // إنشاء المسار الكامل للملف
    const uploadDir = path.join(process.cwd(), "uploads", dateFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // إنشاء اسم فريد للملف
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(req.file.originalname);
    const newFileName = `${req.file.fieldname}-${uniqueSuffix}${fileExtension}`;
    const filePath = path.join(uploadDir, newFileName);
    
    // نقل الملف إلى الموقع النهائي
    fs.renameSync(req.file.path, filePath);
    
    // تحديد مسار المصغرة للصور
    let thumbnailPath = null;
    if (req.file.mimetype.startsWith("image/")) {
      thumbnailPath = filePath;
    }

    const newMedia = new Media({
      filename: newFileName,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: filePath,
      thumbnail: thumbnailPath,
      uploadedBy: req.user.id,
      description: description || "",
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    });

    const savedMedia = await newMedia.save();
    
    res.status(201).json({
      message: "تم رفع الملف بنجاح",
      media: savedMedia,
    });
  } catch (error) {
    console.error("خطأ في رفع الملف:", error);
    res.status(500).json({ 
      message: "حدث خطأ أثناء رفع الملف", 
      error: error.message,
    });
  }
};

// @desc    الحصول على جميع ملفات المستخدم
// @route   GET /api/media
// @access  Private
export const getUserMedia = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    
    // بناء استعلام البحث
    const query = { uploadedBy: req.user.id };
    if (category) {
      query.category = category;
    }
    
    const media = await Media.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Media.countDocuments(query);
    
    res.json({
      media,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("خطأ في جلب الملفات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الملفات" });
  }
};

// @desc    الحصول على ملف واحد
// @route   GET /api/media/:id
// @access  Private
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user.id,
    });
    
    if (!media) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }
    
    res.json(media);
  } catch (error) {
    console.error("خطأ في جلب الملف:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الملف" });
  }
};

// @desc    حذف ملف
// @route   DELETE /api/media/:id
// @access  Private
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user.id,
    });
    
    if (!media) {
      return res.status(404).json({ message: "الملف غير موجود" });
    }
    
    // حذف الملف من نظام الملفات
    if (fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }
    
    // حذف المصغرات إذا كانت موجودة
    if (media.thumbnail && fs.existsSync(media.thumbnail)) {
      fs.unlinkSync(media.thumbnail);
    }
    
    await Media.findByIdAndDelete(req.params.id);
    
    res.json({ message: "تم حذف الملف بنجاح" });
  } catch (error) {
    console.error("خطأ في حذف الملف:", error);
    res.status(500).json({ message: "حدث خطأ أثناء حذف الملف" });
  }
};

// @desc    الحصول على إحصائيات المستخدم
// @route   GET /api/media/stats/user
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const totalMedia = await Media.countDocuments({ uploadedBy: userId });
    
    const images = await Media.countDocuments({ 
      uploadedBy: userId,
      category: "image",
    });
    
    const videos = await Media.countDocuments({ 
      uploadedBy: userId,
      category: "video",
    });
    
    const audio = await Media.countDocuments({ 
      uploadedBy: userId,
      category: "audio",
    });
    
    const documents = await Media.countDocuments({ 
      uploadedBy: userId,
      category: "document",
    });
    
    const storageUsed = await Media.aggregate([
      { $match: { uploadedBy: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);
    
    // الحصول على حد التخزين للمستخدم (يمكن تعديله لاحقًا)
    const storageLimit = 1024 * 1024 * 1024; // 1GB افتراضي
    
    res.json({
      totalMedia,
      images,
      videos,
      audio,
      documents,
      storageUsed: storageUsed[0]?.totalSize || 0,
      storageLimit,
    });
  } catch (error) {
    console.error("خطأ في جلب الإحصائيات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء جلب الإحصائيات" });
  }
};

// @desc    البحث عن ملفات
// @route   GET /api/media/search
// @access  Private
export const searchMedia = async (req, res) => {
  try {
    const { query, category } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // بناء استعلام البحث
    const searchQuery = {
      uploadedBy: req.user.id,
      $or: [
        { originalName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    };
    
    if (category && category !== "all") {
      searchQuery.category = category;
    }
    
    const media = await Media.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Media.countDocuments(searchQuery);
    
    res.json({
      media,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("خطأ في البحث عن الملفات:", error);
    res.status(500).json({ message: "حدث خطأ أثناء البحث عن الملفات" });
  }
};