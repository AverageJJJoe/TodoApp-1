-- Diagnostic queries for pg_net extension
-- Run these queries to check if pg_net is properly set up

-- 1. Check if pg_net extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_net';

-- 2. Check what functions are available in the net schema
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'net'
ORDER BY p.proname;

-- 3. Check if net.http_post exists specifically
SELECT 
    proname,
    pronamespace::regnamespace as schema,
    pg_get_function_arguments(oid) as arguments,
    pg_get_function_result(oid) as return_type
FROM pg_proc
WHERE proname = 'http_post' 
  AND pronamespace::regnamespace::text = 'net';

-- 4. Check search_path
SHOW search_path;

-- 5. Test if we can call the function directly (if it exists)
-- SELECT net.http_post(
--   url := 'https://httpbin.org/post',
--   headers := '{"Content-Type": "application/json"}'::jsonb,
--   body := '{"test": "data"}'::text
-- ) AS request_id;

