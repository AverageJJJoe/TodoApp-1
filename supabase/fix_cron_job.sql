-- CRITICAL FIX: Cron Job Email Delivery Issue
-- Problem: Cron job calling http_post() without schema prefix
-- Solution: Delete old job and recreate with net.http_post() and proper parameters
-- 
-- IMPORTANT: Before running this script, ensure:
-- 1. Edge Function secret is set in Supabase: Settings > Edge Functions > Secrets
--    Secret name: EDGE_FUNCTION_SECRET
--    Value: ef8d9c7b-4a21-4f56-9e3a-2b8c1d6e5f7a (or your actual secret)
-- 2. The Edge Function has been deployed with the latest code (includes logging and auth)
-- 
-- Run this script in Supabase SQL Editor to fix the existing cron job

-- Step 1: Unschedule the existing broken cron job
SELECT cron.unschedule('send-daily-emails-hourly');

-- Step 2: Create new cron job with correct function call
SELECT cron.schedule(
  'send-daily-emails-hourly',
  '0 * * * *', -- every hour at minute 0
  $$
  SELECT net.http_post(
    url := 'https://zrnjxrtgrommlhexbpde.supabase.co/functions/v1/send-daily-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ef8d9c7b-4a21-4f56-9e3a-2b8c1d6e5f7a"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);

-- Step 3: Verify the cron job was created correctly
SELECT * FROM cron.job WHERE jobname = 'send-daily-emails-hourly';

