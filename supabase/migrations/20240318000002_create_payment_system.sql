-- Create payment_intents table
create table if not exists payment_intents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  amount integer not null,
  currency text not null default 'usd',
  status text not null default 'pending',
  stripe_payment_intent_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table payment_intents enable row level security;

-- Create policies for payment_intents
create policy "Users can view their own payment intents"
  on payment_intents for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own payment intents"
  on payment_intents for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create function to create payment intent
create or replace function create_payment_intent(
  p_amount integer,
  p_currency text default 'usd'
)
returns json
language plpgsql
security definer
as $$
declare
  v_payment_intent payment_intents;
  v_stripe_payment_intent_id text;
begin
  -- Create payment intent record
  insert into payment_intents (
    user_id,
    amount,
    currency
  ) values (
    auth.uid(),
    p_amount,
    p_currency
  )
  returning * into v_payment_intent;

  -- Here you would typically call Stripe API to create a payment intent
  -- For now, we'll just return a mock response
  return json_build_object(
    'id', v_payment_intent.id,
    'amount', v_payment_intent.amount,
    'currency', v_payment_intent.currency,
    'status', v_payment_intent.status,
    'client_secret', 'mock_client_secret_' || v_payment_intent.id
  );
end;
$$; 