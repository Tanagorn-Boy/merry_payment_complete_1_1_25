import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ฟังก์ชันอัปโหลดไฟล์ไปยัง Cloudinary โดยใช้ Buffer
export const cloudinaryUpload = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};
