-- Test different variations of HTTP function calls
-- Run these one at a time to see which one works

-- Test 1: Try net.http_post with jsonb body (like cron jobs)
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{"test": "data"}'::jsonb
) AS request_id;

-- Test 2: Try net.http_post with text body
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{"test": "data"}'::text
) AS request_id;

-- Test 3: Try without headers
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  body := '{"test": "data"}'::jsonb
) AS request_id;

-- Test 4: Try net.http_request instead
SELECT net.http_request(
  method := 'POST',
  url := 'https://httpbin.org/post',
  headers := '{"Content-Type": "application/json"}'::jsonb,
  body := '{"test": "data"}'::jsonb
) AS request_id;

-- If any of these work, check the response:
-- SELECT * FROM net._http_response WHERE id = <request_id_from_above>;

