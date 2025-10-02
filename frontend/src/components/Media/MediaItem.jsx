import React, { useState } from 'react';

const MediaItem = ({ media, onSelect, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`media-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(media)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="media-thumbnail">
        {media.type === 'image' && (
          <img src={media.url} alt={media.title} />
        )}
        {media.type === 'video' && (
          <div className="video-thumbnail">
            <video src={media.url} />
            <div className="play-icon">▶</div>
          </div>
        )}
        {media.type === 'audio' && (
          <div className="audio-thumbnail">
            <div className="audio-icon">🎵</div>
          </div>
        )}
        {isSelected && (
          <div className="selected-overlay">
            <div className="checkmark">✓</div>
          </div>
        )}
      </div>
      <div className="media-info">
        <h3>{media.title}</h3>
        <p>{new Date(media.uploadDate).toLocaleDateString('ar-EG')}</p>
      </div>
    </div>
  );
};

export default MediaItem;