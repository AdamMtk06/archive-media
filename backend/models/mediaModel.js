// backend/models/mediaModel.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const MediaSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true, enum: ['image', 'video', 'audio', 'document'] },
  tags: [String],
  category: String,
  privacy: { type: String, enum: ['public', 'private', 'unlisted'], default: 'public' },
  filename: String,
  fileId: { type: Schema.Types.ObjectId, ref: 'Upload.files' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// ✅ منع OverwriteModelError
const Media = mongoose.models.Media || mongoose.model('Media', MediaSchema);

export default Media;
