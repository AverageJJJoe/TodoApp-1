-- Migration: Configure pg_cron job for automated email delivery
-- Story: 3.5 - Automated Cron Job
-- Description: Creates hourly cron job that calls send-daily-emails Edge Function

-- Note: This file contains placeholders that need to be replaced:
-- - <project>: Replace with your Supabase project reference (found in Supabase dashboard URL)
-- - <edge-function-secret>: Replace with Edge Function secret from Supabase dashboard (Settings > Edge Functions > Secrets)

-- Verify pg_cron extension is enabled (should already be enabled in database setup)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job: runs every hour at minute 0 (1:00, 2:00, 3:00, etc.)
-- Schedule pattern: '0 * * * *' = minute 0 of every hour, every day
-- Note: http_post function requires net schema prefix: net.http_post()
-- CRITICAL: Must use schema-qualified function name and proper named parameters
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

-- Verify cron job was created
-- Run this query to check: SELECT * FROM cron.job WHERE jobname = 'send-daily-emails-hourly';

-- To unschedule the job later (if needed):
-- SELECT cron.unschedule('send-daily-emails-hourly');

