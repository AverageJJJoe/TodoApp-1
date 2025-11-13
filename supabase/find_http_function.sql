-- Find the exact HTTP function name and signature in pg_net
-- Run this to see what HTTP functions are actually available

-- 1. List ALL functions in net schema with full details
SELECT 
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type,
    p.prokind as function_kind,
    p.pronargs as num_args
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'net'
ORDER BY p.proname;

-- 2. Specifically look for http_post, http_get, http_request functions
SELECT 
    proname,
    pronamespace::regnamespace as schema,
    pg_get_function_arguments(oid) as full_signature,
    pg_get_function_result(oid) as return_type
FROM pg_proc
WHERE proname IN ('http_post', 'http_get', 'http_request', 'http', 'post', 'get')
  AND pronamespace::regnamespace::text = 'net'
ORDER BY proname;

-- 3. Check all functions that contain 'http' anywhere (case insensitive)
SELECT 
    proname,
    pronamespace::regnamespace as schema,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE LOWER(proname) LIKE '%http%'
ORDER BY pronamespace::regnamespace::text, proname;

