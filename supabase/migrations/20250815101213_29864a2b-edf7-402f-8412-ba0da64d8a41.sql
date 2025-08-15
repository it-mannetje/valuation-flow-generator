-- Fix page_id column to accept text instead of UUID
ALTER TABLE page_footers ALTER COLUMN page_id TYPE text;