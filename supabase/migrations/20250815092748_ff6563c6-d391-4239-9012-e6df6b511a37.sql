-- Create footer templates table
CREATE TABLE public.footer_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  logo_url text,
  layout_config jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create footer instances for pages table
CREATE TABLE public.page_footers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid NOT NULL,
  footer_template_id uuid REFERENCES public.footer_templates(id) ON DELETE CASCADE,
  is_enabled boolean DEFAULT true,
  page_number integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(page_id, page_number)
);

-- Enable RLS
ALTER TABLE public.footer_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_footers ENABLE ROW LEVEL SECURITY;

-- Create policies for footer templates
CREATE POLICY "Authenticated users can view footer templates" 
ON public.footer_templates 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify footer templates" 
ON public.footer_templates 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for page footers
CREATE POLICY "Authenticated users can view page footers" 
ON public.page_footers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can modify page footers" 
ON public.page_footers 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create update trigger for footer templates
CREATE TRIGGER update_footer_templates_updated_at
BEFORE UPDATE ON public.footer_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create update trigger for page footers
CREATE TRIGGER update_page_footers_updated_at
BEFORE UPDATE ON public.page_footers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default footer template
INSERT INTO public.footer_templates (name, description, is_default, layout_config) VALUES (
  'Default Footer',
  'Standard footer with logo left and page number right',
  true,
  '{
    "height": "56.69",
    "backgroundColor": "#FFFFFF",
    "logoPosition": "left",
    "logoMaxWidth": 80,
    "logoMaxHeight": 30,
    "pageNumberPosition": "right",
    "pageNumberStyle": {
      "backgroundColor": "#F3F4F6",
      "borderRadius": 15,
      "width": "85.04",
      "height": "28.35",
      "color": "#374151",
      "fontSize": 12,
      "fontWeight": "bold"
    },
    "dottedLineStyle": {
      "color": "#2563EB",
      "width": 2,
      "height": 20,
      "marginRight": 10
    }
  }'
);