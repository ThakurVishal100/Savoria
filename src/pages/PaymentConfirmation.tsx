import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';

const PaymentConfirmation = () => {
  const [searchParams] = useSearchParams();
  const stripe = useStripe();
  const [status, setStatus] = useState<'processing' | 'succeeded' | 'failed'>('processing');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = searchParams.get('payment_intent_client_secret');

    if (!clientSecret) {
      setStatus('failed');
      setMessage('No payment information found.');
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {
        switch (paymentIntent?.status) {
          case 'succeeded':
            setStatus('succeeded');
            setMessage('Payment successful!');
            break;
          case 'processing':
            setStatus('processing');
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setStatus('failed');
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setStatus('failed');
            setMessage('Something went wrong.');
            break;
        }
      })
      .catch(() => {
        setStatus('failed');
        setMessage('An error occurred while retrieving payment status.');
      });
  }, [stripe, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        <div
          className={`p-4 rounded-lg mb-4 ${
            status === 'succeeded'
              ? 'bg-green-100 text-green-700'
              : status === 'processing'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
        {status === 'succeeded' && (
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentConfirmation; 