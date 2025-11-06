-- Migration: Create contacts table
-- Story: 7.5 - Pre-Launch - Contact Form in Settings
-- Description: Creates contacts table with all required fields and RLS policies for contact form submissions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Key (nullable for anonymous contacts)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Contact details
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row-Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy: Users can insert contacts with their own user_id or NULL (anonymous contacts)
DROP POLICY IF EXISTS "contacts_insert_own" ON contacts;
CREATE POLICY "contacts_insert_own" 
  ON contacts 
  FOR INSERT 
  WITH CHECK (
    user_id IS NULL OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = contacts.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- Note: SELECT policy not needed - service role (used by admin) bypasses RLS
-- Note: Users can insert contacts with NULL user_id (anonymous contacts)

