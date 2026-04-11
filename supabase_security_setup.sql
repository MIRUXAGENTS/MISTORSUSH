-- 1. Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- 2. PRODUCTS: Everyone can read, only Admins can write
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin CRUD Products" ON products;
CREATE POLICY "Admin CRUD Products" ON products FOR ALL 
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 3. CONFIG: Everyone can read, only Admins can write
DROP POLICY IF EXISTS "Public Read Config" ON config;
CREATE POLICY "Public Read Config" ON config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin CRUD Config" ON config;
CREATE POLICY "Admin CRUD Config" ON config FOR ALL
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'))
WITH CHECK (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 4. PROFILES: Users can read/update their own profile, Admins can do everything
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- 5. ORDERS: Public can INSERT, only Admins can view/update
DROP POLICY IF EXISTS "Public can insert orders" ON orders;
CREATE POLICY "Public can insert orders" ON orders FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Admins can update orders" ON orders;
CREATE POLICY "Admins can update orders" ON orders FOR UPDATE
USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
