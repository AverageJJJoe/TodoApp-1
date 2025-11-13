-- Migration: Add welcome_email_sent flag to users table
-- Story: 8.4 - Loops API Welcome Email Integration
-- Description: Adds flag to track if welcome email has been sent to prevent duplicates

-- Add welcome_email_sent column to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;

-- Add comment explaining purpose
COMMENT ON COLUMN users.welcome_email_sent IS 'Flag to track if welcome email has been sent. Prevents duplicate welcome emails on re-login. Set to TRUE after successful Loops API call.';

-- Add index for query performance (if needed for filtering)
CREATE INDEX IF NOT EXISTS idx_users_welcome_email_sent 
  ON users(welcome_email_sent) 
  WHERE welcome_email_sent = FALSE;

-- Verify column was added
-- Run this query to check: 
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'users' 
-- AND column_name = 'welcome_email_sent';

