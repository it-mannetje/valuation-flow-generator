-- Create a table to store sector configurations
CREATE TABLE public.sector_configs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  multiple NUMERIC NOT NULL,
  description TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.sector_configs ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing sector configs (public read access)
CREATE POLICY "Anyone can view sector configs" 
ON public.sector_configs 
FOR SELECT 
USING (true);

-- Create policy for admin users to modify sector configs  
CREATE POLICY "Authenticated users can modify sector configs" 
ON public.sector_configs 
FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert default sector data
INSERT INTO public.sector_configs (id, name, multiple, description, text) VALUES
('technology', 'Technology', 5.2, 'Software, IT services, hardware', 'Technology companies typically command higher multiples due to scalability and growth potential.'),
('healthcare', 'Healthcare', 4.8, 'Medical services, pharmaceuticals, devices', 'Healthcare businesses benefit from stable demand and regulatory barriers to entry.'),
('manufacturing', 'Manufacturing', 3.5, 'Industrial production, machinery', 'Manufacturing companies are valued based on asset intensity and market position.'),
('retail', 'Retail', 3.2, 'Consumer goods, e-commerce', 'Retail valuations depend on brand strength and omnichannel capabilities.'),
('finance', 'Financial Services', 4.1, 'Banking, insurance, fintech', 'Financial services are valued on regulatory compliance and recurring revenue streams.'),
('real-estate', 'Real Estate', 6.8, 'Property development, management', 'Real estate companies benefit from asset appreciation and rental income stability.'),
('consulting', 'Consulting', 4.5, 'Professional services, advisory', 'Consulting firms are valued on expertise, client relationships and recurring engagements.'),
('hospitality', 'Hospitality', 3.8, 'Hotels, restaurants, tourism', 'Hospitality businesses are valued on location, brand recognition and operational efficiency.'),
('energy', 'Energy', 4.2, 'Oil, gas, renewable energy', 'Energy companies are valued based on reserves, production capacity and market positioning.'),
('logistics', 'Logistics', 3.9, 'Transportation, warehousing', 'Logistics companies benefit from e-commerce growth and supply chain optimization.'),
('agriculture', 'Agriculture', 3.1, 'Farming, food production', 'Agricultural businesses are valued on land assets, production efficiency and market access.'),
('education', 'Education', 4.0, 'Schools, training, e-learning', 'Education providers are valued on accreditation, student outcomes and scalability.');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_sector_configs_updated_at
BEFORE UPDATE ON public.sector_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();