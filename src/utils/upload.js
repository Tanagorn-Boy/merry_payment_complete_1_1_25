import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (buffer, filename) => {
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: "test/test",
          use_filename: true,
          filename_override: filename,
          private: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error("Failed to upload file to Cloudinary."));
          } else {
            resolve(result);
          }
        },
      );
      stream.end(buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error.message);
    throw new Error("Failed to upload file to Cloudinary.");
  }
};

export { cloudinaryUpload };
