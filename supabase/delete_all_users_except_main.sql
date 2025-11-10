-- SQL Script: Delete All Users Except joegaleckas@gmail.com
-- WARNING: This will permanently delete all users except joegaleckas@gmail.com
-- Run this in Supabase SQL Editor

-- Step 1: View users that will be deleted (for verification)
SELECT 
  id,
  email,
  auth_id,
  created_at,
  deleted_at
FROM users
WHERE email != 'joegaleckas@gmail.com'
  AND deleted_at IS NULL
ORDER BY created_at;

-- Step 2: Soft delete all users except joegaleckas@gmail.com
-- This sets deleted_at timestamp but keeps the records
UPDATE users
SET deleted_at = NOW()
WHERE email != 'joegaleckas@gmail.com'
  AND deleted_at IS NULL;

-- Step 3: Hard delete auth.users records (triggers CASCADE on related tables)
-- This will permanently delete:
-- - auth.users records
-- - Related tasks (CASCADE)
-- - Related email_logs (CASCADE)
-- - Related contacts (SET NULL on user_id)
-- - users records (CASCADE from auth.users)

DELETE FROM auth.users
WHERE id IN (
  SELECT auth_id
  FROM users
  WHERE email != 'joegaleckas@gmail.com'
    AND deleted_at IS NOT NULL
);

-- Step 4: Verify deletion (should only show joegaleckas@gmail.com)
SELECT 
  id,
  email,
  auth_id,
  created_at,
  deleted_at
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at;

-- Step 5: Count remaining users (should be 1)
SELECT COUNT(*) as remaining_users
FROM users
WHERE deleted_at IS NULL;

