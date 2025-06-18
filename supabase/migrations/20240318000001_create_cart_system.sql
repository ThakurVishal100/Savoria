-- Create cart_items table
create table if not exists cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  menu_item_id uuid references menu_items(id) on delete cascade not null,
  quantity integer not null default 1,
  price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, menu_item_id)
);

-- Enable Row Level Security
alter table cart_items enable row level security;

-- Create policies for cart_items
create policy "Users can view their own cart items"
  on cart_items for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on cart_items for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on cart_items for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on cart_items for delete
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

-- Create trigger for cart_items
create trigger update_cart_items_updated_at
  before update on cart_items
  for each row
  execute function update_updated_at_column();

-- Create indexes for better performance
create index if not exists idx_cart_items_user_id on cart_items(user_id);
create index if not exists idx_cart_items_menu_item_id on cart_items(menu_item_id); 