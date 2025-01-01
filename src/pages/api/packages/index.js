import connectionPool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Query ดึงข้อมูลและจัดเรียงตาม package_id
      const query = `
        SELECT 
          packages.package_id AS id, 
          packages.name_package AS title, 
          packages.price, 
          currency.currency_code,  
          packages.limit_match AS limit, 
          packages.description, 
          packages.icon_url,
          packages.stripe_price_id
        FROM packages
        JOIN currency ON packages.currency_id = currency.currency_id
        ORDER BY packages.package_id;
      `;

      const result = await connectionPool.query(query);

      // แปลง description จาก JSON string ให้เป็น array
      const updatedPackages = result.rows.map((pkg) => ({
        ...pkg,
        details: JSON.parse(pkg.description), // แปลง string เป็น array
      }));

      // ส่งข้อมูลที่แปลงแล้วกลับไปยัง Front
      res.status(200).json(updatedPackages);
    } catch (error) {
      console.error("Error fetching packages:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
