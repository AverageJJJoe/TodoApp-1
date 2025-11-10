-- Migration: Create email_logs table
-- Story: 7.3 - Pre-Launch - Create Email Logs Table
-- Description: Creates email_logs table with all required fields, indexes, and RLS policies for tracking email delivery

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  -- Primary Key & Foreign Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email details
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  
  -- Sending info
  resend_message_id VARCHAR(255) UNIQUE DEFAULT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  
  -- Task count for this email
  task_count INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for performance: User email logs ordered by sent_at DESC
CREATE INDEX IF NOT EXISTS idx_email_logs_user_sent 
  ON email_logs(user_id, sent_at DESC);

-- Enable Row-Level Security (RLS)
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create SELECT policy: Users can only see their own email logs
DROP POLICY IF EXISTS "email_logs_select_own" ON email_logs;
CREATE POLICY "email_logs_select_own" 
  ON email_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = email_logs.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- Note: INSERT operations are performed by Edge Function using service role key,
-- which bypasses RLS. This is appropriate for automated email logging.
-- Only SELECT policy is needed for users to query their own logs in future features.






