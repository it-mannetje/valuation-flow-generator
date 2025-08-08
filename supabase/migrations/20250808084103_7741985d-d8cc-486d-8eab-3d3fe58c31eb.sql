-- Create table for storing valuation requests
CREATE TABLE public.valuation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Contact Information
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_company TEXT,
  
  -- Financial Data
  revenue DECIMAL,
  profit DECIMAL,
  investment_real_estate DECIMAL,
  investment_inventory DECIMAL,
  investment_machinery DECIMAL,
  investment_other DECIMAL,
  
  -- Company Details
  sector TEXT,
  employees INTEGER,
  employees_display TEXT,
  prospects TEXT,
  
  -- Dependencies
  largest_client_dependency INTEGER,
  largest_client_dependency_display TEXT,
  largest_supplier_dependency TEXT,
  recurring_revenue INTEGER,
  recurring_revenue_display TEXT,
  
  -- Valuation Results
  valuation_amount DECIMAL,
  valuation_range_min DECIMAL,
  valuation_range_max DECIMAL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.valuation_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public form)
CREATE POLICY "Anyone can create valuation requests" 
ON public.valuation_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow reading own requests (in case we add auth later)
CREATE POLICY "Users can view all requests" 
ON public.valuation_requests 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_valuation_requests_updated_at
BEFORE UPDATE ON public.valuation_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on created_at
CREATE INDEX idx_valuation_requests_created_at ON public.valuation_requests(created_at DESC);