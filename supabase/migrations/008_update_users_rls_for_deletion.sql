-- Migration: Update users RLS policy to exclude soft-deleted users
-- Story: 8.1 - Account Deletion in Settings
-- Description: Updates users SELECT policy to filter out soft-deleted users (deleted_at IS NULL)

-- Update SELECT policy to exclude soft-deleted users
DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = auth_id AND deleted_at IS NULL);

-- Note: UPDATE policy already prevents users from updating deleted_at field directly
-- since users can only update their own record and deleted_at should be set via Edge Function
-- The Edge Function uses service role key which bypasses RLS

