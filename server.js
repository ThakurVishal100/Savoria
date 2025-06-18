const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3001;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors());
app.use(express.json());

// Middleware to verify Supabase JWT
const verifyAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/create-payment-intent', verifyAuth, async (req, res) => {
  try {
    const { amount, payment_intent_id } = req.body;

    // Create a payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update the payment intent record in Supabase
    const { error } = await supabase
      .from('payment_intents')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        status: 'created'
      })
      .eq('id', payment_intent_id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint to handle Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Find the payment intent in our database
    const { data: paymentIntentData, error: findError } = await supabase
      .from('payment_intents')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .single();

    if (findError) {
      console.error('Error finding payment intent:', findError);
      return res.status(500).json({ error: 'Error finding payment intent' });
    }

    // Create a payment record
    const { error: insertError } = await supabase
      .from('payments')
      .insert([
        {
          payment_intent_id: paymentIntentData.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: 'succeeded',
          stripe_payment_id: paymentIntent.id,
          user_id: paymentIntentData.user_id
        }
      ]);

    if (insertError) {
      console.error('Error creating payment record:', insertError);
      return res.status(500).json({ error: 'Error creating payment record' });
    }

    // Update payment intent status
    const { error: updateError } = await supabase
      .from('payment_intents')
      .update({ status: 'succeeded' })
      .eq('id', paymentIntentData.id);

    if (updateError) {
      console.error('Error updating payment intent:', updateError);
      return res.status(500).json({ error: 'Error updating payment intent' });
    }
  }

  res.json({ received: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 