-- Migration: Create tasks table
-- Story: 2.1 - Tasks Table & Basic UI
-- Description: Creates tasks table with all required fields, indexes, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  -- Primary Key & Foreign Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Task Content
  text VARCHAR(500) NOT NULL,

  -- Task Status
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'completed', 'archived')),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL,

  -- Completion & Archive Tracking
  completed_at TIMESTAMP DEFAULT NULL,
  archived_at TIMESTAMP DEFAULT NULL,

  -- Sync/Email Tracking
  synced_at TIMESTAMP DEFAULT NULL,
  emailed_at TIMESTAMP DEFAULT NULL
);

-- Create indexes for performance
-- Index for loading tasks by user, ordered by creation date
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_created 
  ON tasks(user_id, created_at DESC);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_status 
  ON tasks(user_id, status);

-- Partial index for archive queries (completed tasks)
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at 
  ON tasks(user_id, completed_at DESC) 
  WHERE status = 'completed';

-- Enable Row-Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create SELECT policy: Users can only see their own tasks
DROP POLICY IF EXISTS "tasks_select_own" ON tasks;
CREATE POLICY "tasks_select_own" 
  ON tasks 
  FOR SELECT 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = tasks.user_id AND users.auth_id = auth.uid()));

-- Create INSERT policy: Users can only insert tasks with their own user_id
DROP POLICY IF EXISTS "tasks_insert_own" ON tasks;
CREATE POLICY "tasks_insert_own" 
  ON tasks 
  FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = user_id AND users.auth_id = auth.uid()));

-- Create UPDATE policy: Users can only update their own tasks
DROP POLICY IF EXISTS "tasks_update_own" ON tasks;
CREATE POLICY "tasks_update_own" 
  ON tasks 
  FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = tasks.user_id AND users.auth_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = tasks.user_id AND users.auth_id = auth.uid()));

-- Create DELETE policy: Users can only delete their own tasks (soft delete via deleted_at)
DROP POLICY IF EXISTS "tasks_delete_own" ON tasks;
CREATE POLICY "tasks_delete_own" 
  ON tasks 
  FOR DELETE 
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = tasks.user_id AND users.auth_id = auth.uid()));

