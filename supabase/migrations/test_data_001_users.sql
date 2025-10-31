-- Test Data: Insert test user
-- Story: 1.3 - Database Schema - Users Table
-- Description: SQL for manually inserting a test user via Supabase SQL Editor
-- 
-- IMPORTANT: Before running this, you need to:
-- 1. Create a test user in Supabase Auth (Authentication → Users → Add user)
-- 2. Copy the UUID from the created auth user
-- 3. Replace the placeholder UUID below with the actual auth.users UUID
-- 4. Run this SQL in Supabase SQL Editor

-- Example: Insert test user
-- Replace 'YOUR_AUTH_USER_UUID_HERE' with actual UUID from auth.users table
INSERT INTO users (
  email,
  auth_id,
  delivery_time,
  timezone,
  workflow_mode,
  email_enabled,
  cohort,
  grandfather_status
) VALUES (
  'test@todotomorrow.com',
  '3a25218c-64a6-4fba-8993-0784546d4663'::UUID,  -- Replace with actual auth.users UUID
  '06:00:00',
  'UTC',
  'fresh_start',
  TRUE,
  'free_launch',
  FALSE
);

-- Verify the test user was inserted
SELECT * FROM users WHERE email = 'test@todotomorrow.com';

