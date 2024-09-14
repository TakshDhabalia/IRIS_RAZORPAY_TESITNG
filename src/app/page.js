"use client";
import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';


function PaymentPage() {
  const [amount, setAmount] = useState(500); // set default amount
  const [order, setOrder] = useState(null);

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount, // pass amount in INR
          currency: "INR",
        }),
      });

      const orderData = await response.json();
      setOrder(orderData); // store order for further use
      console.log(orderData); // show order details
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <div>
      <h1>Razorpay Payment Integration</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount"
      />
      <button onClick={handlePayment}>Pay Now</button>
      {order && (
        <div>
          <h2>Order Details</h2>
          <p>Order ID: {order.id}</p>
          <p>Amount: {order.amount / 100} INR</p>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;
