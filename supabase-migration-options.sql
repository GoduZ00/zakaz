ALTER TABLE category_filter_groups ADD COLUMN IF NOT EXISTS options JSONB DEFAULT NULL;

-- Seed options for existing 'torgovye-avtomaty' filter groups
UPDATE category_filter_groups SET options = '["50","100","100+100"]' WHERE characteristic_label = 'Номинал' AND (options IS NULL OR options = '[]'::jsonb);
UPDATE category_filter_groups SET options = '["22мм","25мм","32мм","порционный"]' WHERE characteristic_label = 'Распределитель' AND (options IS NULL OR options = '[]'::jsonb);
UPDATE category_filter_groups SET options = '["ЖР","Конфеты","Мяч","Игрушки"]' WHERE characteristic_label = 'Товар' AND (options IS NULL OR options = '[]'::jsonb);
