-- Comprehensive test to find the correct pg_net function
-- Run this to discover what's actually available

-- 1. Check if net schema exists
SELECT nspname FROM pg_namespace WHERE nspname = 'net';

-- 2. List ALL functions in net schema (if it exists)
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_arguments(p.oid) as arguments,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'net'
ORDER BY p.proname;

-- 3. Check if pg_net extension is installed and what schema it uses
SELECT 
    e.extname,
    e.extversion,
    n.nspname as extension_schema
FROM pg_extension e
JOIN pg_namespace n ON e.extnamespace = n.oid
WHERE e.extname = 'pg_net';

-- 4. Try to find http-related functions in any schema
SELECT 
    pronamespace::regnamespace as schema,
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname LIKE '%http%' 
ORDER BY pronamespace::regnamespace::text, proname;

-- 5. Check if there's a worker_restart function (indicates pg_net is working)
SELECT proname, pronamespace::regnamespace 
FROM pg_proc 
WHERE proname LIKE '%worker%' AND pronamespace::regnamespace::text IN ('net', 'public', 'extensions');

