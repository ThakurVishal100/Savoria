-- Create menu_items table
create table if not exists menu_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  category text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table menu_items enable row level security;

-- Create policies for menu_items
create policy "Anyone can view menu items"
  on menu_items for select
  to authenticated
  using (true);

create policy "Only admins can insert menu items"
  on menu_items for insert
  to authenticated
  with check (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can update menu items"
  on menu_items for update
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

create policy "Only admins can delete menu items"
  on menu_items for delete
  to authenticated
  using (auth.jwt() ->> 'role' = 'admin');

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for menu_items
create trigger update_menu_items_updated_at
  before update on menu_items
  for each row
  execute function update_updated_at_column();

-- Create indexes for better performance
create index if not exists idx_menu_items_category on menu_items(category); 