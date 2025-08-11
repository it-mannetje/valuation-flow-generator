-- Add image1_url and image2_url columns to pdf_pages table
ALTER TABLE public.pdf_pages 
ADD COLUMN image1_url TEXT,
ADD COLUMN image2_url TEXT;