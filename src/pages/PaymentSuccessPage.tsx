import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { toast } from 'react-hot-toast';

interface PaymentSuccessState {
  amount: number;
  itemName: string;
  clientSecret: string;
}

export function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as PaymentSuccessState;

  useEffect(() => {
    // Redirect if no payment data
    if (!state?.amount || !state?.itemName || !state?.clientSecret) {
      toast.error('Invalid payment information');
      navigate('/menu');
    }
  }, [state, navigate]);

  if (!state?.amount || !state?.itemName || !state?.clientSecret) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item</span>
                  <span className="font-medium text-gray-900">{state.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-900">${(state.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              <p className="text-gray-600 mb-4">
                Your order has been confirmed. You will receive an email confirmation shortly.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/menu')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Back to Menu
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200"
              >
                View Order History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 