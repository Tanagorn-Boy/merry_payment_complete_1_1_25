import Stripe from "stripe";
import connectionPool from "@/utils/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false, // Stripe ต้องการ payload แบบ raw
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // อ่าน raw body
      const rawBody = await new Promise((resolve) => {
        let data = "";
        req.on("data", (chunk) => {
          data += chunk;
        });
        req.on("end", () => {
          resolve(data);
        });
      });

      // ตรวจสอบความถูกต้องของ Webhook
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // จัดการ Events ที่ได้รับ
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;

      // ดึงข้อมูลที่ต้องการจาก paymentIntent
      const gatewayTransactionId = paymentIntent.id;
      const paymentMethod = paymentIntent.payment_method_types[0]; // เช่น 'card'
      const currency = paymentIntent.currency.toUpperCase(); // เช่น 'THB'
      const paymentDate = new Date(paymentIntent.created * 1000); // แปลง timestamp

      // สมมติว่ามี package_id และ user_id ใน metadata
      const packageId = paymentIntent.metadata.packages_id;
      const userId = paymentIntent.metadata.user_id;

      console.log("Received payment_intent.succeeded event");
      console.log(
        "PaymentIntent Data:",
        JSON.stringify(paymentIntent, null, 2),
      );

      const paymentStatus = "Success"; // สำเร็จแล้ว
      try {
        // ขั้นตอนที่ 1: ยกเลิก Package เดิมที่ Active
        const cancelOldSubscriptionQuery = `
        UPDATE subscriptions
        SET subscription_status = 'Cancelled', subscription_end_date = NOW()
        WHERE payment_id IN (
          SELECT payment_id 
          FROM payment 
          WHERE user_id = $1
        ) AND subscription_status = 'Active'
      `;
        await connectionPool.query(cancelOldSubscriptionQuery, [userId]);
        console.log("Previous active subscription cancelled successfully.");

        // ขั้นตอนที่ 2: บันทึกข้อมูลการชำระเงินใหม่ลงในตาราง payment
        const query = `
          INSERT INTO payment (currency_id, gateway_transaction_id, payment_method, payment_date, package_id, user_id, payment_status)
          VALUES (
            (SELECT currency_id FROM currency WHERE currency_code = $1 LIMIT 1),
            $2, $3, $4, $5, $6, $7
          )
        `;

        const values = [
          currency, // currency เช่น 'THB'
          gatewayTransactionId, // paymentIntent.id
          paymentMethod, // เช่น 'card'
          paymentDate, // วันที่ชำระเงิน
          packageId, // package_id จาก metadata
          userId, // user_id จาก metadata
          paymentStatus, // 'succeeded'
        ];

        console.log("Query:", query);
        console.log("Values:", values);

        await connectionPool.query(query, values);
        console.log("Payment data saved to database successfully.");

        res.status(200).json({ received: true });
      } catch (dbError) {
        console.error("Error saving payment to database:", dbError.message);
        res
          .status(500)
          .json({ error: "Failed to save payment data to database." });
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;

      // ตัวอย่าง: แจ้งเตือนเมื่อการชำระเงินล้มเหลว
      console.log("PaymentIntent failed:", paymentIntent.id);
    } else {
      // ถ้าประเภท Event ไม่ได้รองรับ
      console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
    // ส่งการตอบกลับให้ Stripe
  } else {
    // กรณี Method ไม่ใช่ POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
