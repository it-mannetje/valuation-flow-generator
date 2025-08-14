-- Add revenue year 1 and year 2 columns to replace single revenue column
ALTER TABLE valuation_requests 
ADD COLUMN revenue_year_1 numeric,
ADD COLUMN revenue_year_2 numeric;

-- Add investment columns to store all investment data
ALTER TABLE valuation_requests 
ADD COLUMN investment_real_estate_stored numeric,
ADD COLUMN investment_inventory_stored numeric,
ADD COLUMN investment_machinery_stored numeric,
ADD COLUMN investment_other_stored numeric;