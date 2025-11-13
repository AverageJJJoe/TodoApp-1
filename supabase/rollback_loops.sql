-- ============================================
-- ROLLBACK: Loops Integration (Story 8.4)
-- Execute Date: 2025-11-12
-- Purpose: Remove Loops integration to unblock launch
-- ============================================

-- Step 1: Drop the welcome email trigger and function
DROP TRIGGER IF EXISTS on_user_signup_trigger_loops ON users;
DROP FUNCTION IF EXISTS trigger_loops_welcome();

-- Step 2: Drop the cron job
SELECT cron.unschedule('send-loops-scheduled-emails-daily');

-- Step 3: Remove tracking columns from users table
ALTER TABLE users 
  DROP COLUMN IF EXISTS last_active_at,
  DROP COLUMN IF EXISTS last_day3_email_sent_at,
  DROP COLUMN IF EXISTS last_day5_email_sent_at;

-- Step 4: Drop the indexes (if they exist)
DROP INDEX IF EXISTS idx_users_last_active_at;
DROP INDEX IF EXISTS idx_users_day3_email_sent;
DROP INDEX IF EXISTS idx_users_day5_email_sent;

-- Step 5: Clean up email_logs table (remove Loops entries)
-- First, check what exists (uncomment to check):
-- SELECT COUNT(*) as loops_email_count 
-- FROM email_logs 
-- WHERE provider = 'loops';

-- Delete Loops entries from email_logs
DELETE FROM email_logs WHERE provider = 'loops';

-- Step 6: Remove Loops-specific check constraints (if they exist)
-- Note: We're keeping provider/email_type columns as they might be useful for future
-- But removing Loops-specific constraints
ALTER TABLE email_logs 
  DROP CONSTRAINT IF EXISTS chk_provider,
  DROP CONSTRAINT IF EXISTS chk_email_type;

-- ============================================
-- VERIFICATION QUERIES
-- Run these after rollback to verify cleanup
-- ============================================

-- Check trigger is gone (should return 0 rows)
SELECT 
  'Trigger exists' as check_item,
  COUNT(*) as count
FROM pg_trigger 
WHERE tgname = 'on_user_signup_trigger_loops'
UNION ALL
SELECT 
  'Function exists',
  COUNT(*)
FROM pg_proc 
WHERE proname = 'trigger_loops_welcome'
UNION ALL
SELECT 
  'Cron job exists',
  COUNT(*)
FROM cron.job 
WHERE jobname = 'send-loops-scheduled-emails-daily'
UNION ALL
SELECT 
  'Loops emails in email_logs',
  COUNT(*)
FROM email_logs 
WHERE provider = 'loops';

-- Expected Result: All counts should be 0

-- Verify users table columns are removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('last_active_at', 'last_day3_email_sent_at', 'last_day5_email_sent_at');

-- Expected Result: Should return 0 rows

