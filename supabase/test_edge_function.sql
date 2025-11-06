-- Test script to verify Edge Function works correctly
-- Run this in Supabase SQL Editor to test the function manually

-- Test 1: Call the function directly (simulating cron job)
SELECT net.http_post(
  url := 'https://zrnjxrtgrommlhexbpde.supabase.co/functions/v1/send-daily-emails',
  headers := '{"Content-Type": "application/json", "Authorization": "Bearer ef8d9c7b-4a21-4f56-9e3a-2b8c1d6e5f7a"}'::jsonb,
  body := '{}'::jsonb
) AS response;

-- After running, check Edge Functions logs in Supabase dashboard:
-- Dashboard > Edge Functions > send-daily-emails > Logs
-- You should see detailed logs showing:
-- - 📥 Incoming request details
-- - ✅ Authentication validation
-- - 🚀 Starting email processing
-- - 🔍 Fetching eligible users
-- - ✅ Email processing complete

