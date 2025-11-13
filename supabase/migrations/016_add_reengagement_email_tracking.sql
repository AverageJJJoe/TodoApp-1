-- Migration: Add re-engagement email tracking columns to users table
-- Story: 8.5 - Loops Re-Engagement Email Sequences
-- Description: Adds columns to track when Day 3 and Day 5 re-engagement emails were sent

-- Add tracking columns for re-engagement emails
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS last_day3_email_sent_at TIMESTAMP WITH TIME ZONE NULL,
  ADD COLUMN IF NOT EXISTS last_day5_email_sent_at TIMESTAMP WITH TIME ZONE NULL;

-- Add comments explaining purpose of each column
COMMENT ON COLUMN users.last_day3_email_sent_at IS 'Timestamp when Day 3 "no tasks" re-engagement email was sent. NULL means email not sent yet.';
COMMENT ON COLUMN users.last_day5_email_sent_at IS 'Timestamp when Day 5 inactivity re-engagement email was sent. NULL means email not sent yet.';

-- Add indexes for query performance
-- Index on created_at for Day 3 queries (users who signed up 3 days ago)
CREATE INDEX IF NOT EXISTS idx_users_created_at_day3 
  ON users(created_at) 
  WHERE deleted_at IS NULL AND last_day3_email_sent_at IS NULL;

-- Index on last_day3_email_sent_at for Day 3 queries
CREATE INDEX IF NOT EXISTS idx_users_last_day3_email_sent_at 
  ON users(last_day3_email_sent_at) 
  WHERE deleted_at IS NULL;

-- Index on last_day5_email_sent_at for Day 5 queries
CREATE INDEX IF NOT EXISTS idx_users_last_day5_email_sent_at 
  ON users(last_day5_email_sent_at) 
  WHERE deleted_at IS NULL;

-- Verify columns were added
-- Run this query to check: 
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- AND column_name IN ('last_day3_email_sent_at', 'last_day5_email_sent_at');

