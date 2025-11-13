-- Temporarily disable Loops welcome email trigger
-- Use this to allow user creation while we fix the net.http_post issue
-- Run this NOW to unblock user creation

-- Drop the trigger (user creation will work without it)
DROP TRIGGER IF EXISTS on_user_signup_trigger_loops ON users;

-- Optionally drop the function too (it's failing anyway)
-- DROP FUNCTION IF EXISTS trigger_loops_welcome();

-- Verify trigger is gone
SELECT * FROM pg_trigger WHERE tgname = 'on_user_signup_trigger_loops';

-- After fixing net.http_post, re-run migration 010 to recreate the trigger

