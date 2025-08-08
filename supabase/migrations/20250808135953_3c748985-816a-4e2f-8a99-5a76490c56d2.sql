-- Add new fields for top logo, footer logo and their positioning options
ALTER TABLE public.pdf_pages 
ADD COLUMN top_logo_url TEXT,
ADD COLUMN top_logo_position TEXT DEFAULT 'left' CHECK (top_logo_position IN ('left', 'right', 'center')),
ADD COLUMN footer_logo_url TEXT,
ADD COLUMN footer_logo_position TEXT DEFAULT 'left' CHECK (footer_logo_position IN ('left', 'right', 'center'));

-- Update existing logo_image_url column description for clarity (this is now for backwards compatibility)
COMMENT ON COLUMN public.pdf_pages.logo_image_url IS 'Legacy logo field, use top_logo_url and footer_logo_url instead';