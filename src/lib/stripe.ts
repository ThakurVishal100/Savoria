import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Replace with your Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createPaymentIntent = async (amount: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to make a payment');
    }

    const { data, error } = await supabase
      .from('payment_intents')
      .insert([
        {
          amount,
          currency: 'usd',
          status: 'pending',
          user_id: user.id
        }
      ])
      .select()
      .single();

    if (error) throw error;

    // Create a payment intent on your backend
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabase.auth.session()?.access_token}`
      },
      body: JSON.stringify({ 
        amount,
        payment_intent_id: data.id
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const { clientSecret } = await response.json();
    return { clientSecret };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export { stripePromise }; 