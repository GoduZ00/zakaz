-- Reviews (отзывы клиентов, публичная отправка + показ)
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
CREATE POLICY "Public can read reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert reviews" ON reviews;
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);

-- Стартовый отзыв (запустить один раз)
INSERT INTO reviews (name, rating, text) VALUES
  ('Борис', 5, 'Хорошая компания! Профессиональный подход к Клиентам, широкий ассортимент товаров.');
