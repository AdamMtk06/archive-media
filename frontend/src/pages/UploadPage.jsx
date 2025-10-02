import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadMedia } from '../services/api';
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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setFormData({
        ...formData,
        file: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
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
      setFormData({
        ...formData,
        file: e.dataTransfer.files[0]
      });
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      setMessage('الرجاء اختيار ملف للرفع');
      return;
    }
    
    setUploading(true);
    setProgress(0);
    
    try {
      const uploadData = new FormData();
      uploadData.append('file', formData.file);
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('type', formData.type);
      uploadData.append('tags', formData.tags);
      uploadData.append('category', formData.category);
      uploadData.append('privacy', formData.privacy);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);
      
      await uploadMedia(uploadData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setMessage('تم رفع الملف بنجاح');
      
      // Redirect to media page after a short delay
      setTimeout(() => {
        navigate('/media');
      }, 1500);
    } catch (error) {
      setMessage('فشل رفع الملف: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1>رفع وسائط جديدة</h1>

      {message && <div className={`alert ${message.includes('نجاح') ? 'alert-success' : 'alert-danger'}`}>{message}</div>}

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
                <p>يدعم الصور والفيديوهات والصوتيات</p>
                <button type="button">اختيار ملف</button>
              </div>
            )}
          </div>
          
          <div className="upload-details">
            <div className="form-group">
              <label>العنوان</label>
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
        </form>
      </div>
    </div>
  );
};

export default UploadPage;