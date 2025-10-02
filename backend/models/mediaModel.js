const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['image', 'video', 'audio', 'document'],
    required: true
  }
}, {
  timestamps: true
});

// تحديد الفئة تلقائيًا بناءً على نوع الملف
mediaSchema.pre('save', function(next) {
  if (this.mimeType.startsWith('image/')) {
    this.category = 'image';
  } else if (this.mimeType.startsWith('video/')) {
    this.category = 'video';
  } else if (this.mimeType.startsWith('audio/')) {
    this.category = 'audio';
  } else {
    this.category = 'document';
  }
  next();
});

module.exports = mongoose.model('Media', mediaSchema);