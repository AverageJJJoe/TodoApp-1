-- Check what functions pg_net extension actually provides
-- Run this to see all available functions in the net schema

-- 1. List ALL functions in net schema
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type,
    p.prokind as function_kind -- 'f' = function, 'p' = procedure
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'net'
ORDER BY p.proname, p.oid;

-- 2. Check if there's an http_request function instead
SELECT 
    proname,
    pronamespace::regnamespace as schema,
    pg_get_function_arguments(oid) as arguments,
    pg_get_function_result(oid) as return_type
FROM pg_proc
WHERE proname LIKE '%http%' 
  AND pronamespace::regnamespace::text IN ('net', 'public', 'extensions')
ORDER BY proname;

-- 3. Check pg_net extension details
SELECT 
    e.extname,
    e.extversion,
    n.nspname as schema_name
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'pg_net';

