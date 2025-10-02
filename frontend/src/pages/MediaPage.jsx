import React, { useState, useEffect } from 'react';
import MediaList from '../components/Media/MediaList';
import { getUserMedia, deleteMedia } from '../services/api';
import SearchBar from '../components/Shared/SearchBar';
import '../styles/MediaPage.css';

const MediaPage = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getUserMedia();
        setMedia(data);
        setFilteredMedia(data);
      } catch (error) {
        console.error('Error fetching user media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredMedia(media);
      return;
    }

    const filtered = media.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMedia(filtered);
  };

  const handleDelete = async () => {
    try {
      for (const item of selectedMedia) {
        await deleteMedia(item._id);
      }
      
      const updatedMedia = media.filter(item => !selectedMedia.some(selected => selected._id === item._id));
      setMedia(updatedMedia);
      setFilteredMedia(updatedMedia);
      setSelectedMedia([]);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting media:', error);
    }
  };

  const toggleSelectMedia = (item) => {
    if (selectedMedia.some(selected => selected._id === item._id)) {
      setSelectedMedia(selectedMedia.filter(selected => selected._id !== item._id));
    } else {
      setSelectedMedia([...selectedMedia, item]);
    }
  };

  const selectAllMedia = () => {
    if (selectedMedia.length === filteredMedia.length) {
      setSelectedMedia([]);
    } else {
      setSelectedMedia([...filteredMedia]);
    }
  };

  const filterByType = (type) => {
    setFilterType(type);
    if (type === 'all') {
      setFilteredMedia(media);
    } else {
      const filtered = media.filter(item => item.type === type);
      setFilteredMedia(filtered);
    }
  };

  // Sort media by date (newest first)
  const sortMediaByDate = () => {
    const sorted = [...filteredMedia].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setFilteredMedia(sorted);
  };

  // Sort media by name (A-Z)
  const sortMediaByName = () => {
    const sorted = [...filteredMedia].sort((a, b) => a.title.localeCompare(b.title));
    setFilteredMedia(sorted);
  };

  return (
    <div className="media-page">
      <div className="page-header">
        <div className="header-content">
          <h1>وسائطي</h1>
          <p>إدارة وتصفح جميع ملفات الوسائط الخاصة بك</p>
        </div>
        <div className="header-actions">
          <div className="view-mode-toggle">
            <button 
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⊞
            </button>
            <button 
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
          <div className="sort-dropdown">
            <select onChange={(e) => {
              if (e.target.value === 'date') sortMediaByDate();
              if (e.target.value === 'name') sortMediaByName();
            }}>
              <option value="date">الأحدث أولاً</option>
              <option value="name">ترتيب أبجدي</option>
            </select>
          </div>
          <button 
            className="btn-danger"
            disabled={selectedMedia.length === 0}
            onClick={() => setShowDeleteModal(true)}
          >
            حذف المحدد ({selectedMedia.length})
          </button>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />
      
      <div className="media-controls">
        <div className="control-item">
          <input
            type="checkbox"
            checked={selectedMedia.length === filteredMedia.length && filteredMedia.length > 0}
            onChange={selectAllMedia}
          />
          <span>تحديد الكل</span>
        </div>
        
        <div className="control-item">
          <span>إجمالي: {filteredMedia.length} عنصر</span>
        </div>
      </div>
      
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => filterByType('all')}
        >
          الكل
        </button>
        <button 
          className={`filter-tab ${filterType === 'image' ? 'active' : ''}`}
          onClick={() => filterByType('image')}
        >
          الصور
        </button>
        <button 
          className={`filter-tab ${filterType === 'video' ? 'active' : ''}`}
          onClick={() => filterByType('video')}
        >
          الفيديوهات
        </button>
        <button 
          className={`filter-tab ${filterType === 'audio' ? 'active' : ''}`}
          onClick={() => filterByType('audio')}
        >
          الصوتيات
        </button>
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الوسائط...</p>
        </div>
      ) : (
        <MediaList 
          media={filteredMedia} 
          onSelect={toggleSelectMedia}
          selectedItems={selectedMedia}
          viewMode={viewMode}
        />
      )}
      
      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>تأكيد الحذف</h3>
            <p>هل أنت متأكد من حذف {selectedMedia.length} عنصر؟ لا يمكن التراجع عن هذا الإجراء.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={handleDelete}>
                حذف
              </button>
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPage;