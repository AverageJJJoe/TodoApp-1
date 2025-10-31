-- Migration: Add INSERT policy to users table
-- Description: Allows authenticated users to create their own user record
-- Story: 2.3 - Save Task to Supabase (requires user record creation)

-- Create INSERT policy: Users can only insert their own record
-- This allows users to create their user record when they first sign up
DROP POLICY IF EXISTS "users_insert_own" ON users;
CREATE POLICY "users_insert_own" 
  ON users 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_id);

