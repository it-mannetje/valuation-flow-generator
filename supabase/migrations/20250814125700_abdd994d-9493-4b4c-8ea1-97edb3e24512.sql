-- Remove unused investment fields
ALTER TABLE valuation_requests 
DROP COLUMN IF EXISTS investment_real_estate_stored,
DROP COLUMN IF EXISTS investment_inventory_stored,
DROP COLUMN IF EXISTS investment_machinery_stored,
DROP COLUMN IF EXISTS investment_other_stored,
DROP COLUMN IF EXISTS investment_real_estate,
DROP COLUMN IF EXISTS investment_inventory,
DROP COLUMN IF EXISTS investment_machinery,
DROP COLUMN IF EXISTS investment_other,
DROP COLUMN IF EXISTS revenue_year_1,
DROP COLUMN IF EXISTS revenue_year_2;

-- Add revenue range field to store the display text (e.g., "1-3 miljoen")
ALTER TABLE valuation_requests 
ADD COLUMN revenue_range_display text;

-- Rename existing fields for clarity and add new business result fields
ALTER TABLE valuation_requests 
RENAME COLUMN profit TO result_previous_year;

ALTER TABLE valuation_requests 
ADD COLUMN result_current_year numeric;

-- Add multiplier field
ALTER TABLE valuation_requests 
ADD COLUMN multiplier numeric;