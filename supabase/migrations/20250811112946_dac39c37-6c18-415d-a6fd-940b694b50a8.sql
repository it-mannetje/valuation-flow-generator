-- Add middle_image_url column to pdf_pages table for page 2 layout
ALTER TABLE public.pdf_pages ADD COLUMN middle_image_url TEXT;