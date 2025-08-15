-- Add audit log table for tracking changes
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit logs (admin access only)
CREATE POLICY "Admins can view all audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (true);

-- Add layout versioning columns to pdf_pages
ALTER TABLE public.pdf_pages 
ADD COLUMN layout_version INTEGER DEFAULT 1,
ADD COLUMN previous_layout JSONB,
ADD COLUMN layout_history JSONB DEFAULT '[]'::jsonb;

-- Add general settings table
CREATE TABLE public.general_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on general_settings
ALTER TABLE public.general_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for general_settings
CREATE POLICY "Anyone can view general settings" 
ON public.general_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage general settings" 
ON public.general_settings 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO public.general_settings (setting_key, setting_value, description) VALUES
('default_multiple_range', '{"min": 0.3, "max": 0.3}', 'Default range for multiplier calculations'),
('currency', '"EUR"', 'Default currency for valuations'),
('disclaimer_text', '"Deze waardering is een indicatie gebaseerd op EBITDA-multiples en sectorgemiddelden. De werkelijke waarde van uw bedrijf kan afwijken door factoren zoals marktpositie, groeiperspectieven, activa, schulden en marktontwikkelingen."', 'Default disclaimer text for reports');

-- Add footer template type column
ALTER TABLE public.footer_templates 
ADD COLUMN template_type TEXT DEFAULT 'components' CHECK (template_type IN ('components', 'full_image')),
ADD COLUMN full_image_url TEXT;

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (table_name, operation, new_values, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (table_name, operation, old_values, new_values, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (table_name, operation, old_values, user_id)
    VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to relevant tables
CREATE TRIGGER audit_pdf_pages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.pdf_pages
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_footer_templates_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.footer_templates
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_general_settings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.general_settings
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

-- Add trigger for updating updated_at on general_settings
CREATE TRIGGER update_general_settings_updated_at
  BEFORE UPDATE ON public.general_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();