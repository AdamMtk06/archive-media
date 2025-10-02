import React, { useState } from 'react';
import { uploadMedia } from '../../services/api';

const UploadForm = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('الرجاء اختيار ملف');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);

    try {
      await uploadMedia(formData);
      setMessage('تم رفع الملف بنجاح!');
      setFile(null);
      setTitle('');
      setDescription('');
      onUploadSuccess();
    } catch (error) {
      setMessage('فشل رفع الملف: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>رفع وسائط جديدة</h2>
      {message && <div className={`message ${message.includes('نجاح') ? 'success' : 'error'}`}>{message}</div>}
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>اختر ملف:</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,video/*,audio/*"
            required
          />
        </div>
        
        <div className="form-group">
          <label>العنوان:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>الوصف:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <button type="submit" disabled={uploading}>
          {uploading ? 'جاري الرفع...' : 'رفع الملف'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;