-- Categories
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  opt_tooltip TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subcategories
CREATE TABLE subcategories (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  article TEXT,
  description TEXT,
  characteristics JSONB DEFAULT '[]',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_wholesale NUMERIC(10,2),
  price_opt NUMERIC(10,2),
  price_large_wholesale NUMERIC(10,2),
  stock_status TEXT DEFAULT 'in_stock',
  quantity INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  sku_variants JSONB DEFAULT '[]',
  box_quantity INTEGER DEFAULT 1000,
  box_label TEXT DEFAULT 'кор',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promotions (Aktsii)
CREATE TABLE promotions (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  discount TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  address TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  total NUMERIC(10,2),
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (for admin users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists (for client users)
CREATE TABLE wishlists (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Seed categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Механические торговые автоматы', 'mekhanicheskie_torgovye_avtomaty_catalog', 1),
  ('Наполнители для торговых автоматов', 'napolniteli-dlya-torgovykh-avtomatov', 2);

-- Seed subcategories for Механические торговые автоматы
INSERT INTO subcategories (category_id, name, slug, sort_order) VALUES
  (1, 'Торговые автоматы', 'torgovye-avtomaty', 1),
  (1, 'Монетоприемники и пластины к ним', 'monetopriemniki', 2),
  (1, 'Распределители', 'raspredeliteli', 3),
  (1, 'Детали и части', 'detali-i-chasti', 4),
  (1, 'Стойки, кронштейны, швеллеры', 'stoyki-kronshteyny-shvellery', 5),
  (1, 'Наклейки', 'nakleyki', 6);

-- Seed subcategories for Наполнители
INSERT INTO subcategories (category_id, name, slug, sort_order) VALUES
  (2, 'Жевательная резинка', 'zhevatelnaya-rezinka', 1),
  (2, 'Конфеты', 'konfety', 2),
  (2, 'Мячи-прыгуны', 'myachi-pryguny', 3),
  (2, 'Игрушки', 'igrushki', 4),
  (2, 'Бахилы в капсулах', 'bakhily-v-kapsulakh', 5),
  (2, 'Капсулы пустые', 'kapsuly-pustye', 6);

-- News
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  image_url TEXT,
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Category filter groups (admin-configurable characteristic-based filters)
-- subcategory_id = specific subcategory, category_id = "Все товары категории"
CREATE TABLE category_filter_groups (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES categories(id) ON DELETE CASCADE,
  subcategory_id BIGINT REFERENCES subcategories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  characteristic_label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer sections (admin-editable)
CREATE TABLE footer_sections (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  links JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO footer_sections (title, links, sort_order) VALUES
  ('О КОМПАНИИ', '[{"label":"Новости","url":"#"},{"label":"Статьи","url":"#"},{"label":"Партнеры","url":"#"},{"label":"Сертификаты","url":"#"},{"label":"Отзывы","url":"#"},{"label":"Реквизиты","url":"#"}]', 1),
  ('КАК ЗАКАЗАТЬ', '[{"label":"Оплата","url":"#"},{"label":"Самовывоз","url":"#"},{"label":"Документы","url":"#"},{"label":"Доставка по Москве и МО","url":"#"},{"label":"Доставка по регионам","url":"#"},{"label":"Таможенный союз","url":"#"}]', 2),
  ('КЛИЕНТАМ', '[{"label":"Прайс-лист","url":"#"},{"label":"Дисплеи","url":"#"},{"label":"Видео","url":"#"},{"label":"Купоны на скидку и промо","url":"#"},{"label":"Вопросы и ответы","url":"#"},{"label":"Сертификаты","url":"#"}]', 3);

-- Price thresholds (cart auto-switch tiers, admin-editable)
CREATE TABLE price_thresholds (
  id BIGSERIAL PRIMARY KEY,
  tier TEXT NOT NULL UNIQUE,
  threshold NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO price_thresholds (tier, threshold) VALUES
  ('opt', 50000),
  ('large_wholesale', 100000);
