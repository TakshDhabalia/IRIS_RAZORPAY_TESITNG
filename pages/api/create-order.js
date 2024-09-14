import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_API_KEY,
      key_secret: process.env.RAZORPAY_API_SECRET,
    });

    const options = {
      amount: amount * 100, // Amount in paise (smallest currency unit)
      currency: 'INR',
      receipt: 'receipt_order_1234',
    };

    try {
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
