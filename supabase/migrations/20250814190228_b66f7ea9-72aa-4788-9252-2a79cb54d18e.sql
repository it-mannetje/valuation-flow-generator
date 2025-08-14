-- Add missing column for average yearly investment
ALTER TABLE valuation_requests 
ADD COLUMN IF NOT EXISTS average_yearly_investment numeric;

-- Update existing records to use display values correctly
UPDATE valuation_requests 
SET revenue_range_display = CASE 
  WHEN revenue <= 1000000 THEN '0-1 mln'
  WHEN revenue <= 3000000 THEN '1-3 mln' 
  WHEN revenue <= 10000000 THEN '4-10 mln'
  WHEN revenue <= 25000000 THEN '11-25 mln'
  ELSE '> 25 mln'
END
WHERE revenue_range_display IS NULL OR revenue_range_display = '';