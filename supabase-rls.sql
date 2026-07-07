-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read" ON products FOR SELECT USING (true);
CREATE POLICY "Public read" ON promotions FOR SELECT USING (true);

-- Admin write access (authenticated users)
CREATE POLICY "Admin insert" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON subcategories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON subcategories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON subcategories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON promotions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON promotions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON promotions FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON orders FOR DELETE USING (auth.role() = 'authenticated');

-- Profiles: users can read their own, admins read all
CREATE POLICY "Read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admin insert" ON profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');

-- Wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own wishlist" ON wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own wishlist" ON wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own wishlist" ON wishlists FOR DELETE USING (auth.uid() = user_id);
