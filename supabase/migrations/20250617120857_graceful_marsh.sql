/*
  # Restaurant Management System Schema

  1. New Tables
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `image_url` (text)
      - `category` (text)
      - `is_available` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reservations`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `date` (date)
      - `time` (time)
      - `party_size` (integer)
      - `special_requests` (text, optional)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text, default 'unread')
      - `created_at` (timestamp)
    
    - `restaurant_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `value` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access to menu items
    - Add policies for public insert access to reservations and contact messages
    - Add policies for authenticated admin access to manage data
*/

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  image_url text,
  category text NOT NULL DEFAULT 'main',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  date date NOT NULL,
  time time NOT NULL,
  party_size integer NOT NULL CHECK (party_size > 0 AND party_size <= 20),
  special_requests text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

-- Create restaurant_settings table
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Policies for menu_items (public read, admin write)
CREATE POLICY "Anyone can view available menu items"
  ON menu_items
  FOR SELECT
  USING (is_available = true);

CREATE POLICY "Authenticated users can manage menu items"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for reservations (public insert, admin manage)
CREATE POLICY "Anyone can create reservations"
  ON reservations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for contact_messages (public insert, admin read)
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for restaurant_settings (admin only)
CREATE POLICY "Authenticated users can view settings"
  ON restaurant_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage settings"
  ON restaurant_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image_url, category) VALUES
  ('Truffle Risotto', 'Creamy arborio rice with black truffle, parmesan, and fresh herbs', 28.00, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', 'main'),
  ('Wagyu Beef Tenderloin', 'Premium wagyu with roasted vegetables and red wine reduction', 45.00, 'https://images.pexels.com/photos/299347/pexels-photo-299347.jpeg?auto=compress&cs=tinysrgb&w=400', 'main'),
  ('Atlantic Salmon', 'Pan-seared salmon with quinoa pilaf and citrus beurre blanc', 32.00, 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=400', 'main'),
  ('Lobster Bisque', 'Rich and creamy lobster soup with cognac and fresh herbs', 18.00, 'https://images.pexels.com/photos/539451/pexels-photo-539451.jpeg?auto=compress&cs=tinysrgb&w=400', 'appetizer'),
  ('Duck Confit', 'Slow-cooked duck leg with cherry gastrique and roasted potatoes', 38.00, 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400', 'main'),
  ('Chocolate Soufflé', 'Warm chocolate soufflé with vanilla bean ice cream', 16.00, 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400', 'dessert');

-- Insert default restaurant settings
INSERT INTO restaurant_settings (key, value) VALUES
  ('restaurant_name', 'Savoria'),
  ('restaurant_phone', '(555) 123-4567'),
  ('restaurant_email', 'info@savoria.com'),
  ('restaurant_address', '123 Culinary Avenue, Downtown District, NY 10001'),
  ('opening_hours', 'Tuesday - Sunday: 5:30 PM - 10:30 PM, Monday: Closed'),
  ('max_party_size', '20'),
  ('reservation_advance_days', '30');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_menu_items_updated_at
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at
  BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();