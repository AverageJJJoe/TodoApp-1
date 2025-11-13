-- Migration: Enable pg_net extension for http_post functionality
-- Description: Enables pg_net extension which provides net.http_post() function for calling Edge Functions
-- 
-- IMPORTANT: This extension may need to be enabled via Supabase Dashboard instead of SQL
-- If this migration fails, try enabling it manually:
-- 1. Go to Supabase Dashboard > Database > Extensions
-- 2. Search for "pg_net" or "net"
-- 3. Enable the extension
--
-- Alternatively, Supabase may have net.http_post() available without explicit extension
-- If cron jobs are working with net.http_post(), this extension might already be enabled

-- Try to enable pg_net extension (Supabase's version of net extension)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- If pg_net doesn't work, try net extension (may not be available in Supabase)
-- CREATE EXTENSION IF NOT EXISTS net;

-- Verify extension is enabled
-- Run this query to check: SELECT * FROM pg_extension WHERE extname IN ('pg_net', 'net');

