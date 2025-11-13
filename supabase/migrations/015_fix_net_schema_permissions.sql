-- Migration: Fix net schema permissions for pg_net extension
-- Description: Grants necessary permissions on net schema for http_post to work in triggers
--
-- IMPORTANT: pg_net extension must be enabled first (via Dashboard or migration 014)
-- This migration ensures the postgres role has access to net schema functions

-- Grant usage on net schema
GRANT USAGE ON SCHEMA net TO postgres;

-- Grant execute permission on net.http_post function
GRANT EXECUTE ON FUNCTION net.http_post TO postgres;

-- Grant permissions on net schema tables (for logging/debugging)
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA net TO postgres;

-- Verify net.http_post function exists and is accessible
-- Run this query to check: 
-- SELECT proname, pronamespace::regnamespace, proargtypes::regtype[] 
-- FROM pg_proc 
-- WHERE proname = 'http_post' AND pronamespace::regnamespace::text = 'net';

