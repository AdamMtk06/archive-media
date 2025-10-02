// backend/config/gridfs.js
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let gfs;

export const initGridFS = () => {
  if (mongoose.connection.readyState === 1) {
    const conn = mongoose.connection.db;
    const bucket = new GridFSBucket(conn, { bucketName: 'uploads' });
    gfs = { bucket };
    return gfs;
  }
  return null;
};

export const getGFS = () => {
  if (!gfs) console.error('GridFS غير متصل بعد');
  return gfs;
};
