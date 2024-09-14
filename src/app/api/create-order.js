import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,  // stored in Vercel environment
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // amount in paise
      currency: currency || "INR",
      receipt: "receipt#1",
      payment_capture: 1,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order); // send order to frontend
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
