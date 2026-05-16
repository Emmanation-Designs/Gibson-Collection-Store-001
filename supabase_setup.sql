-- ==============================================================================
-- Setup Script for Gibson Collections Supabase Account
-- ==============================================================================
-- Run this entire script in the Supabase SQL Editor

-- 1. Create the `products` table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  image_urls text[],
  discount numeric DEFAULT 0,
  colors text[],
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS) on the `products` table
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to ensure clean slate (avoids errors on re-runs)
DROP POLICY IF EXISTS "Public can read products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- 4. Create proper policies for the `products` table
-- EVERYONE can read products
CREATE POLICY "Public can read products"
  ON public.products FOR SELECT
  USING (true);

-- ONLY admins can insert/create products
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ONLY admins can update products
CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ONLY admins can delete products
CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );


-- ==============================================================================
-- Add `orders` table
-- ==============================================================================

-- 4a. Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id), -- Nullable, for guest checkouts
  phone text NOT NULL,
  address text NOT NULL,
  subtotal numeric NOT NULL,
  total text NOT NULL,
  items jsonb NOT NULL, -- Will store an array of cart items
  status text DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
  created_at timestamptz DEFAULT now()
);

-- 4b. Enable RLS on `orders`
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 4c. Drop existing policies for orders
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete all orders" ON public.orders;

-- 4d. Create policies for `orders` table
-- Users can read their own orders
CREATE POLICY "Users can read their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can insert an order (guest checkout allowed)
-- Warning: In a fully strict system you might want to force login.
CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
  ON public.orders FOR SELECT
  USING (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- Admins can update all orders
CREATE POLICY "Admins can update all orders"
  ON public.orders FOR UPDATE
  USING (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- Admins can delete all orders
CREATE POLICY "Admins can delete all orders"
  ON public.orders FOR DELETE
  USING (
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ==============================================================================
-- Add Payment tracking to `orders` table
-- ==============================================================================

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS paid_at timestamptz;


-- ==============================================================================
-- Storage Bucket Setup for Product Images
-- ==============================================================================

-- 5. Create the storage bucket dynamically (if it does not exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. (Skipped: RLS is already enabled by default on storage.objects)

-- 7. Drop existing storage policies
DROP POLICY IF EXISTS "Public can read images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete images" ON storage.objects;

-- 8. Create proper policies for the `product-images` bucket
-- EVERYONE can view images
CREATE POLICY "Public can read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- ONLY admins can upload images
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND 
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ONLY admins can update existing images
CREATE POLICY "Admins can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND 
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ONLY admins can delete images
CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND 
    auth.email() IN ('gibsoncollections1@gmail.com', 'gibsoncollections2@gmail.com')
  );

-- ==============================================================================
-- DONE!
-- After running this, go to Authentication -> "Providers" in Supabase, 
-- and ensure "Email/Password" is enabled.
-- ==============================================================================
