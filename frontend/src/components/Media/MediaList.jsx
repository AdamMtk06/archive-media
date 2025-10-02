import React from 'react';
import MediaItem from './MediaItem';

const MediaList = ({ media, onSelect, selectedItems }) => {
  if (media.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <h3>لا توجد وسائط متاحة</h3>
        <p>لم يتم العثور على وسائط تطابق بحثك</p>
      </div>
    );
  }

  return (
    <div className="media-grid">
      {media.map(item => (
        <MediaItem 
          key={item._id} 
          media={item} 
          onSelect={onSelect}
          isSelected={selectedItems.some(selected => selected._id === item._id)}
        />
      ))}
    </div>
  );
};

export default MediaList;