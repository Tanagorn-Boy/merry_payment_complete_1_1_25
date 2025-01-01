import connectionPool from "@/utils/db";
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";
import multer from "multer";
import cloudinary from "cloudinary";
import jwt from "jsonwebtoken";

// ตั้งค่า Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ตั้งค่า multer ให้ใช้ MemoryStorage
const multerUpload = multer({ storage: multer.memoryStorage() });

// กำหนด config สำหรับ Next.js API Route (ต้องปิด bodyParser)
export const config = {
  api: {
    bodyParser: false, // ปิด bodyParser เพื่อให้ formidable จัดการ request body เอง
  },
};

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    if (!id) {
      return res.status(400).json({ error: "Package ID is required." });
    }
    try {
      // ตัวอย่างการลบข้อมูล (แทนที่ connectionPool ตามจริง)
      const query = `DELETE FROM packages WHERE package_id = $1`;
      await connectionPool.query(query, [id]);

      return res
        .status(200)
        .json({ message: `Package with ID ${id} deleted successfully!` });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Failed to delete package." });
    }
  } else if (req.method === "GET") {
    try {
      const query = `SELECT * FROM packages WHERE package_id = $1`;
      const { rows } = await connectionPool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Package not found." });
      }

      return res.status(200).json(rows[0]);
    } catch (error) {
      console.error("Database Error:", error.message);
      return res.status(500).json({ error: "Failed to fetch package data." });
    }
  } else if (req.method === "PUT") {
    multerUpload.single("icon")(req, res, async (err) => {
      if (err) {
        console.error("File upload error:", err);
        return res.status(500).json({ error: "File upload failed" });
      }

      try {
        // ตรวจสอบ Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        let adminId;

        try {
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          adminId = decoded.admin_id;
        } catch (err) {
          console.error("JWT Verification Error:", err.message);
          return res.status(401).json({ error: "Invalid Token" });
        }

        // ข้อมูลจาก body
        const { name_package, limit_match, description, price } = req.body;

        if (!name_package || !limit_match || !description || !price) {
          return res.status(400).json({ error: "Missing required fields." });
        }

        let iconUrl = null;

        // อัปโหลดรูปภาพใหม่ไปยัง Cloudinary (ถ้ามี)
        if (req.file) {
          try {
            const uploadResult = await cloudinaryUpload(req.file.buffer);
            iconUrl = uploadResult.url;
          } catch (uploadError) {
            console.error("Cloudinary Upload Error:", uploadError.message);
            return res
              .status(500)
              .json({ error: "Failed to upload new icon to Cloudinary." });
          }
        } else {
          // ถ้าไม่มีรูปภาพใหม่ให้ใช้รูปเดิมจากฐานข้อมูล
          const query = `SELECT icon_url FROM packages WHERE package_id = $1`;
          const { rows } = await connectionPool.query(query, [id]);
          iconUrl = rows[0]?.icon_url || null;
        }

        // อัปเดตข้อมูลในฐานข้อมูล
        const updateQuery = `
          UPDATE packages
          SET name_package = $1, description = $2, limit_match = $3, price = $4, icon_url = $5, updated_date = NOW(), created_by = $6
          WHERE package_id = $7
        `;
        await connectionPool.query(updateQuery, [
          name_package,
          description,
          limit_match,
          price,
          iconUrl,
          adminId,
          id,
        ]);

        return res.status(200).json({
          message: "Package updated successfully!",
          icon_url: iconUrl,
        });
      } catch (error) {
        console.error("Error updating package:", error.message);
        return res.status(500).json({ error: "Failed to update package." });
      }
    });
  } else {
    res.setHeader("Allow", ["DELETE", "GET", "PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
