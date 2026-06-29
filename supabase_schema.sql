-- UP SCHEMA FOR AMIEL GÂTEAUX / BELLA MASSA
-- Run this in your Supabase SQL Editor to prepare your database tables.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'doces' | 'salgadas' | 'bolos' | 'aniversario'
    price NUMERIC(10, 2) NOT NULL,
    ingredients TEXT[] DEFAULT '{}',
    image_url TEXT NOT NULL,
    description TEXT,
    sizes JSONB DEFAULT '[]'::jsonb, -- Array of sizes with { id, name, price }
    hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create Policies for Products
CREATE POLICY "Allow public read access to products"
    ON public.products FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated/admin write access to products"
    ON public.products FOR ALL
    USING (true) -- In a real production app, restrict to authenticated/admin e.g. (auth.role() = 'authenticated')
    WITH CHECK (true);


-- 3. Create Settings Table (for hidden categories)
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY, -- e.g., 'hidden_categories'
    value JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create Policies for Settings
CREATE POLICY "Allow public read access to settings"
    ON public.settings FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated/admin write access to settings"
    ON public.settings FOR ALL
    USING (true)
    WITH CHECK (true);


-- 4. Create Orders Table (Optional, for order management)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_method TEXT NOT NULL,
    address JSONB,
    payment_method TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC(10, 2) NOT NULL,
    observation TEXT,
    status TEXT DEFAULT 'pending'::text, -- 'pending' | 'preparing' | 'delivered' | 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create Policies for Orders
CREATE POLICY "Allow anyone to create an order"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public to read their own orders or authenticated users to read all"
    ON public.orders FOR SELECT
    USING (true);


-- 5. Seed Initial Data (Optional)
-- You can use this to populate your Supabase database with default items.
INSERT INTO public.products (id, name, category, price, ingredients, image_url, description, sizes, hidden)
VALUES 
('sweet-1', 'Torta Banoffee', 'doces', 92.50, ARRAY['Banana Nanica', 'Doce de Leite Caseiro', 'Chantilly Leve', 'Toque de Canela', 'Massa de Chocolate'], 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80', 'Camadas generosas do melhor doce de leite, bananas frescas fatiadas e chantilly fresco salpicado com canela.', '[{"id":"size-3-p","name":"Individual (Fatia)","price":19.00},{"id":"size-3-m","name":"Média (1.2kg)","price":92.50},{"id":"size-3-g","name":"Grande (2.2kg)","price":155.00}]'::jsonb, false),
('savory-1', 'Empadão de Frango com Catupiry', 'salgadas', 85.00, ARRAY['Peito de Frango Desfiado', 'Catupiry Autêntico', 'Azeitonas Verdes', 'Massa Podre Amanteigada'], 'https://images.unsplash.com/photo-1628115843023-6496005bb9be?auto=format&fit=crop&w=600&q=80', 'O verdadeiro empadão brasileiro com massa super amanteigada que desmancha na boca e recheio ultra cremoso.', '[{"id":"size-5-p","name":"Individual (Mini)","price":17.50},{"id":"size-5-m","name":"Médio (1.5kg)","price":85.00},{"id":"size-5-g","name":"Grande (2.5kg)","price":135.00}]'::jsonb, false),
('savory-2', 'Torta Cremosa de Palmito', 'salgadas', 88.00, ARRAY['Palmito Pupunha', 'Ervilhas Frescas', 'Molho Bechamel', 'Queijo Parmesão Gratinado'], 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80', 'Uma torta vegetariana sofisticada, recheada com palmito macio e molho branco temperado com ervas finas.', '[{"id":"size-6-p","name":"Individual (Mini)","price":18.00},{"id":"size-6-m","name":"Médio (1.5kg)","price":88.00},{"id":"size-6-g","name":"Grande (2.5kg)","price":138.00}]'::jsonb, false),
('cake-1', 'Bolo de Cenoura com Brigadeiro', 'bolos', 65.00, ARRAY['Cenouras Orgânicas', 'Chocolate Belga 50%', 'Massa Fofinha', 'Granulado Gourmet'], 'https://images.unsplash.com/photo-1622896784083-cc051313dbab?auto=format&fit=crop&w=600&q=80', 'Bolo de cenoura ultra fofinho com cobertura super cremosa e brilhante de chocolate belga meio amargo.', '[{"id":"size-8-p","name":"Pequeno (1kg)","price":45.00},{"id":"size-8-m","name":"Médio (1.8kg)","price":65.00},{"id":"size-8-g","name":"Grande (2.8kg)","price":98.00}]'::jsonb, false)
ON CONFLICT (id) DO NOTHING;

-- Seed hidden categories setting
INSERT INTO public.settings (key, value)
VALUES ('hidden_categories', '[]'::jsonb)
ON CONFLICT (key) DO NOTHING;
