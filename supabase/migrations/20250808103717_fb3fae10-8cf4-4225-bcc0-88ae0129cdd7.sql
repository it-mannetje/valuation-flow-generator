-- Create table for PDF content management
CREATE TABLE public.pdf_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_number INTEGER NOT NULL,
  page_name TEXT NOT NULL,
  background_image_url TEXT,
  logo_image_url TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pdf_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access (allow all operations for authenticated users)
CREATE POLICY "Authenticated users can view PDF pages" 
ON public.pdf_pages 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create PDF pages" 
ON public.pdf_pages 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update PDF pages" 
ON public.pdf_pages 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete PDF pages" 
ON public.pdf_pages 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pdf_pages_updated_at
BEFORE UPDATE ON public.pdf_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default PDF page content
INSERT INTO public.pdf_pages (page_number, page_name, content) VALUES 
(1, 'Cover Page', '{"title": "Rapport waardebepaling", "subtitle": "STRICTLY CONFIDENTIAL", "background_color": "#ffffff"}'),
(2, 'Foreword', '{"title": "Voorwoord", "content": [{"type": "paragraph", "text": "Ondernemers bezitten een, relatief gesproken, vaak zeer belangrijke bezit onder hun bedrijf..."}]}'),
(3, 'Calculation', '{"title": "3. Indicatieve calculatie", "sections": [{"title": "Ingevoerde gegevens"}, {"title": "Belangrijkste uitgangspunten"}]}'),
(4, 'Sector Information', '{"title": "4. Overnames in de {sector} Sector", "dynamic_title": true, "content": [{"type": "paragraph", "text": "De overnamesmarkt in de Nederlandse {sector}-sector is in 2025 voorspoedig en volop in beweging..."}]}'),
(5, 'Business Valuation', '{"title": "5. Bedrijfswaardering", "content": [{"type": "paragraph", "text": "Essentieel voor elke groeifase en strategische keuze."}]}'),
(6, 'Next Steps', '{"title": "The next step", "contact_info": true, "disclaimer": true}');