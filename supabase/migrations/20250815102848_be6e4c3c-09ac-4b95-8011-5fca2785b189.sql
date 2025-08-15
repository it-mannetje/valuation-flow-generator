-- Remove logo columns from pdf_pages table
ALTER TABLE pdf_pages 
DROP COLUMN IF EXISTS footer_logo_position,
DROP COLUMN IF EXISTS footer_logo_url,
DROP COLUMN IF EXISTS top_logo_position,
DROP COLUMN IF EXISTS top_logo_url,
DROP COLUMN IF EXISTS logo_image_url;