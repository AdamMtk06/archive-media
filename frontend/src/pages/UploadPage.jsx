import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/upload.css';

const UploadPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    type: 'image',
    tags: '',
    category: '',
    privacy: 'public'
  });
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      if (files && files[0]) {
        // تحديد نوع الملف تلقائياً بناءً على امتداده
        const file = files[0];
        const fileType = getFileType(file.name);
        setFormData({ 
          ...formData, 
          file: file,
          type: fileType
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // دالة لتحديد نوع الملف بناءً على الامتداد
  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image';
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext)) return 'video';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) return 'audio';
    return 'document';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fileType = getFileType(file.name);
      setFormData({ 
        ...formData, 
        file: file,
        type: fileType
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من وجود ملف
    if (!formData.file) {
      setUploadError('الرجاء اختيار ملف للرفع');
      return;
    }
    
    // التحقق من وجود عنوان
    if (!formData.title.trim()) {
      setUploadError('الرجاء إدخال عنوان للملف');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setMessage('');
    setUploadError('');

    try {
      const data = new FormData();
      data.append('file', formData.file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('tags', formData.tags);
      data.append('category', formData.category);
      data.append('privacy', formData.privacy);
      
      // الحصول على التوكن من localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUploadError('يجب تسجيل الدخول أولاً');
        setUploading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/media', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        }
      });
      
      setMessage('تم رفع الملف بنجاح');
      
      // إعادة التوجيه بعد فترة قصيرة
      setTimeout(() => {
        navigate('/media');
      }, 1500);
      
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response) {
        // خطأ من الخادم
        setUploadError(error.response.data.message || 'فشل رفع الملف');
      } else if (error.request) {
        // لم يتم استلام استجابة
        setUploadError('لا يوجد اتصال بالخادم');
      } else {
        // خطأ في الإعداد
        setUploadError('حدث خطأ أثناء رفع الملف');
      }
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      file: null,
      title: '',
      description: '',
      type: 'image',
      tags: '',
      category: '',
      privacy: 'public'
    });
    setMessage('');
    setUploadError('');
  };

  return (
    <div className="upload-page">
      <h1>رفع وسائط جديدة</h1>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {uploadError && (
        <div className="alert alert-danger">
          {uploadError}
        </div>
      )}

      <div className="upload-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <div 
            className={`file-upload ${dragActive ? 'dragover' : ''} ${formData.file ? 'has-file' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              name="file"
              className="file-input"
              style={{ display: 'none' }}
            />
            
            {formData.file ? (
              <div className="file-info">
                <div className="file-icon">
                  {formData.type === 'image' && '🖼️'}
                  {formData.type === 'video' && '🎬'}
                  {formData.type === 'audio' && '🎵'}
                  {formData.type === 'document' && '📄'}
                </div>
                <div>
                  <h3>{formData.file.name}</h3>
                  <p>{(formData.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                  type="button"
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData({...formData, file: null});
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="file-upload-content">
                <div className="file-upload-icon">📤</div>
                <h3>اسحب وأفلت الملف هنا أو انقر للاختيار</h3>
                <p>يدعم الصور والفيديوهات والصوتيات والمستندات</p>
                <button type="button">اختيار ملف</button>
              </div>
            )}
          </div>
          
          <div className="upload-details">
            <div className="form-group">
              <label>العنوان *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="أدخل عنواناً للملف"
                required
              />
            </div>
            
            <div className="form-group">
              <label>الوصف</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="أدخل وصفاً للملف"
                rows="3"
              ></textarea>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>النوع</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="image">صورة</option>
                  <option value="video">فيديو</option>
                  <option value="audio">صوت</option>
                  <option value="document">مستند</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>الفئة</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="مثال: طبيعة, أعمال, شخصي"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>العلامات</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="مثال: طبيعة, جمال, غروب"
              />
            </div>
            
            <div className="form-group">
              <label>الخصوصية</label>
              <div className="privacy-options">
                <label>
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.privacy === 'public'}
                    onChange={handleChange}
                  />
                  <span>عام</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={formData.privacy === 'private'}
                    onChange={handleChange}
                  />
                  <span>خاص</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="privacy"
                    value="unlisted"
                    checked={formData.privacy === 'unlisted'}
                    onChange={handleChange}
                  />
                  <span>غير مدرج</span>
                </label>
              </div>
            </div>
            
            {uploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p>{progress}% مكتمل</p>
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={resetForm}
                disabled={uploading}
              >
                إعادة تعيين
              </button>
              <button 
                type="submit" 
                disabled={uploading || !formData.file}
                className="btn-primary"
              >
                {uploading ? (
                  <>
                    <div className="loading-spinner"></div>
                    جاري الرفع...
                  </>
                ) : (
                  'رفع الوسائط'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadPage;