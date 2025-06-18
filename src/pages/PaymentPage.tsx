import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface PaymentPageState {
  amount: number;
  itemName: string;
}

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const state = location.state as PaymentPageState;

  useEffect(() => {
    // Redirect if no payment data
    if (!state?.amount || !state?.itemName) {
      toast.error('Invalid payment information');
      navigate('/menu');
    }
  }, [state, navigate]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Get the current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        toast.error('Please sign in to complete payment');
        navigate('/auth');
        return;
      }

      console.log('Creating payment intent for:', {
        amount: state.amount,
        userId: user.id
      });

      // Call the database function to create a payment intent
      const { data, error } = await supabase
        .rpc('create_payment_intent', {
          p_amount: state.amount,
          p_currency: 'usd'
        });

      if (error) {
        console.error('Payment intent error:', error);
        toast.error('Failed to create payment. Please try again.');
        return;
      }

      if (!data?.client_secret) {
        console.error('No client secret in response:', data);
        toast.error('Invalid payment response. Please try again.');
        return;
      }

      console.log('Payment intent created successfully:', data);

      // Redirect to success page
      navigate('/payment/success', {
        state: {
          amount: state.amount,
          itemName: state.itemName,
          clientSecret: data.client_secret
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state?.amount || !state?.itemName) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Complete Your Order</h1>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item</span>
                  <span className="font-medium text-gray-900">{state.itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-medium text-gray-900">${(state.amount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <p className="text-gray-600 mb-4">
                We accept all major credit cards and secure payments through Stripe.
              </p>
              {/* Add Stripe Elements here when ready */}
            </div>

            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Complete Payment'}
            </button>

            <button
              onClick={() => navigate('/menu')}
              className="w-full border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 