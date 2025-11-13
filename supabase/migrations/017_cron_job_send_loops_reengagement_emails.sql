-- Migration: Configure pg_cron job for re-engagement email delivery
-- Story: 8.5 - Loops Re-Engagement Email Sequences
-- Description: Creates daily cron job that calls send-loops-reengagement-emails Edge Function at 9 AM UTC

-- Note: This file contains placeholders that need to be replaced:
-- - <edge-function-secret>: Replace with Edge Function secret from Supabase dashboard (Settings > Edge Functions > Secrets)
-- Project reference: zrnjxrtgrommlhexbpde (from existing migrations)

-- Verify pg_cron extension is enabled (should already be enabled in database setup)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create cron job: runs daily at 9 AM UTC
-- Schedule pattern: '0 9 * * *' = minute 0 of hour 9, every day
-- Note: http_post function requires net schema prefix: net.http_post()
-- CRITICAL: Must use schema-qualified function name and proper named parameters
SELECT cron.schedule(
  'send-loops-reengagement-emails-daily',
  '0 9 * * *', -- daily at 9 AM UTC
  $$
  SELECT net.http_post(
    url := 'https://zrnjxrtgrommlhexbpde.supabase.co/functions/v1/send-loops-reengagement-emails',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ef8d9c7b-4a21-4f56-9e3a-2b8c1d6e5f7a"}'::jsonb,
    body := '{}'::jsonb
  )
  $$
);

-- Verify cron job was created
-- Run this query to check: SELECT * FROM cron.job WHERE jobname = 'send-loops-reengagement-emails-daily';

-- To unschedule the job later (if needed):
-- SELECT cron.unschedule('send-loops-reengagement-emails-daily');

