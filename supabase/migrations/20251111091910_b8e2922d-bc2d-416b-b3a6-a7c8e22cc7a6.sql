-- Add header_text column to sector_configs table
ALTER TABLE public.sector_configs 
ADD COLUMN header_text TEXT;