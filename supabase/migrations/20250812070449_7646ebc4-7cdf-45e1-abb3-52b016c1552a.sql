-- Add missing columns to valuation_requests table to store all form data
ALTER TABLE public.valuation_requests 
ADD COLUMN IF NOT EXISTS expected_result_2025 numeric,
ADD COLUMN IF NOT EXISTS was_lossmaking boolean;