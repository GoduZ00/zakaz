-- Add full text content to news
ALTER TABLE news ADD COLUMN IF NOT EXISTS content TEXT;

-- Update existing news with sample text based on title
UPDATE news SET content = title WHERE content IS NULL AND title IS NOT NULL;
