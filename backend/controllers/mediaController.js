// backend/controllers/mediaController.js
import Media from '../models/mediaModel.js';
import { getGFS } from '../config/gridfs.js';

// رفع ملف جديد
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'لم يتم اختيار أي ملف' });
    }

    const { title, description, type, tags, category, privacy } = req.body;
    const gfs = getGFS();
    if (!gfs) {
      return res.status(500).json({ message: 'خطأ في الاتصال بقاعدة البيانات' });
    }

    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const filename = `${Date.now()}-${req.file.originalname}`;

    // إنشاء stream للرفع
    const writeStream = gfs.bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
      metadata: { owner: req.user._id }
    });

    writeStream.end(req.file.buffer);

    writeStream.on('finish', async (file) => {
      const newMedia = new Media({
        title,
        description,
        type: type || 'document',
        tags: tagsArray,
        category: category || '',
        privacy: privacy || 'public',
        filename,
        fileId: file._id,
        owner: req.user._id
      });

      await newMedia.save();

      res.status(201).json({ message: 'تم رفع الملف بنجاح', media: newMedia });
    });

    writeStream.on('error', (error) => {
      console.error('خطأ في حفظ الملف:', error);
      res.status(500).json({ message: 'حدث خطأ أثناء حفظ الملف' });
    });

  } catch (error) {
    console.error('خطأ عام أثناء رفع الملف:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الملف' });
  }
};

// جلب جميع ملفات المستخدم
export const getUserMedia = async (req, res) => {
  try {
    const media = await Media.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الملفات' });
  }
};

// جلب ملف معين
export const getMediaFile = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'الملف غير موجود' });

    // التحقق من الصلاحيات
    if (media.owner.toString() !== req.user._id.toString() && media.privacy !== 'public') {
      return res.status(403).json({ message: 'غير مصرح لك بالوصول إلى هذا الملف' });
    }

    const gfs = getGFS();
    if (!gfs) return res.status(500).json({ message: 'خطأ في الاتصال بقاعدة البيانات' });

    const readStream = gfs.bucket.openDownloadStream(media.fileId);

    readStream.on('error', () => {
      res.status(404).json({ message: 'الملف غير موجود' });
    });

    res.set('Content-Type', media.type === 'image' ? 'image/jpeg' :
                            media.type === 'video' ? 'video/mp4' :
                            media.type === 'audio' ? 'audio/mpeg' : 'application/octet-stream');

    readStream.pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء جلب الملف' });
  }
};

// حذف ملف
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'الملف غير موجود' });

    if (media.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'غير مصرح لك بحذف هذا الملف' });
    }

    const gfs = getGFS();
    if (!gfs) return res.status(500).json({ message: 'خطأ في الاتصال بقاعدة البيانات' });

    await gfs.bucket.delete(media.fileId);
    await Media.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'تم حذف الملف بنجاح' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء حذف الملف' });
  }
};
