import { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import {dotenvdotlocal} from '.env.local'
export default function Home() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: 500 }), // Example amount in INR
    });

    const data = await response.json();

    if (data.id) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: data.amount,
        currency: 'INR',
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: data.id,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id } = response;

          // Save the transaction to Supabase
          const { error } = await supabase
            .from('transactions')
            .insert([
              {
                order_id: razorpay_order_id,
                payment_id: razorpay_payment_id,
                amount: data.amount / 100, // Convert from paise to INR
                status: 'successful',
              },
            ]);

          if (error) {
            console.error('Error saving transaction:', error);
          } else {
            alert('Payment successful! Payment ID: ' + razorpay_payment_id);
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      alert('Failed to create order.');
    }

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}
