-- Create payment_intents table
create table if not exists payment_intents (
  id uuid default uuid_generate_v4() primary key,
  amount integer not null,
  currency text not null default 'usd',
  status text not null default 'pending',
  stripe_payment_intent_id text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create payments table to store successful payments
create table if not exists payments (
  id uuid default uuid_generate_v4() primary key,
  payment_intent_id uuid references payment_intents(id),
  amount integer not null,
  currency text not null default 'usd',
  status text not null,
  stripe_payment_id text,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table payment_intents enable row level security;
alter table payments enable row level security;

-- Create policies for payment_intents
create policy "Users can insert their own payment intents"
  on payment_intents for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own payment intents"
  on payment_intents for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update their own payment intents"
  on payment_intents for update
  to authenticated
  using (auth.uid() = user_id);

-- Create policies for payments
create policy "Users can insert their own payments"
  on payments for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own payments"
  on payments for select
  to authenticated
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for payment_intents
create trigger update_payment_intents_updated_at
  before update on payment_intents
  for each row
  execute function update_updated_at_column();

-- Create indexes for better performance
create index if not exists idx_payment_intents_user_id on payment_intents(user_id);
create index if not exists idx_payment_intents_status on payment_intents(status);
create index if not exists idx_payments_user_id on payments(user_id);
create index if not exists idx_payments_payment_intent_id on payments(payment_intent_id); 