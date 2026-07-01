import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pos_logos',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional scaling
  },
});

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
  }
};

export const extractPublicId = (url) => {
  if (!url) return null;
  // Extracts the public ID from a standard Cloudinary URL
  // Example: https://res.cloudinary.com/.../pos_logos/j3q9...
  const parts = url.split('/');
  const fileWithExtension = parts.pop();
  const folder = parts.pop();
  const filename = fileWithExtension.split('.')[0];
  return `${folder}/${filename}`;
};
