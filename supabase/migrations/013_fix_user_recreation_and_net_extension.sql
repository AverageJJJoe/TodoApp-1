-- Migration: Fix user recreation issue
-- Description: 
-- 1. Creates partial unique index on email to allow soft-deleted users to be recreated
-- 2. Adds function to clean up orphaned soft-deleted users
-- 3. Adds trigger to handle email conflicts when recreating users
--
-- Note: The net extension for http_post is handled separately in migration 010
-- Supabase may require enabling pg_net extension instead - check Supabase dashboard

-- Drop the existing unique constraint on email and replace with partial unique index
-- This allows multiple soft-deleted users with the same email, but only one active user per email
-- Note: PostgreSQL creates constraint names automatically, try common names
DO $$
BEGIN
  -- Try to drop the constraint if it exists (may be named users_email_key or users_email_unique)
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_key' AND conrelid = 'users'::regclass) THEN
    ALTER TABLE users DROP CONSTRAINT users_email_key;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_email_unique' AND conrelid = 'users'::regclass) THEN
    ALTER TABLE users DROP CONSTRAINT users_email_unique;
  END IF;
END $$;

-- Create partial unique index: only enforce uniqueness for non-deleted users
-- This replaces the full unique constraint and allows soft-deleted users to have duplicate emails
DROP INDEX IF EXISTS idx_users_email_unique_active;
CREATE UNIQUE INDEX idx_users_email_unique_active 
  ON users(email) 
  WHERE deleted_at IS NULL;

-- Function to clean up orphaned soft-deleted users (users with deleted_at but auth user still exists)
-- This handles edge cases where deletion process was interrupted
CREATE OR REPLACE FUNCTION cleanup_orphaned_soft_deleted_users()
RETURNS void AS $$
BEGIN
  -- Hard delete user records that are soft-deleted but their auth user no longer exists
  DELETE FROM users
  WHERE deleted_at IS NOT NULL
    AND auth_id NOT IN (SELECT id FROM auth.users);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle user creation with email conflict resolution
-- If a soft-deleted user exists with the same email, hard delete it first
CREATE OR REPLACE FUNCTION handle_user_email_conflict()
RETURNS TRIGGER AS $$
DECLARE
  existing_user_id UUID;
BEGIN
  -- Check if there's a soft-deleted user with the same email
  SELECT id INTO existing_user_id
  FROM users
  WHERE email = NEW.email
    AND deleted_at IS NOT NULL
  LIMIT 1;

  -- If found, hard delete it (cascades to tasks)
  IF existing_user_id IS NOT NULL THEN
    DELETE FROM users WHERE id = existing_user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to handle email conflicts before insert
DROP TRIGGER IF EXISTS trigger_handle_user_email_conflict ON users;
CREATE TRIGGER trigger_handle_user_email_conflict
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_email_conflict();

-- Clean up any existing orphaned soft-deleted users
SELECT cleanup_orphaned_soft_deleted_users();

