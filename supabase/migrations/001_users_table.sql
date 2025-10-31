-- Migration: Create users table
-- Story: 1.3 - Database Schema - Users Table
-- Description: Creates users table with all required fields, indexes, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  -- Primary Key & Identity
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Delivery Preferences
  delivery_time TIME NOT NULL DEFAULT '06:00:00',
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  workflow_mode VARCHAR(20) NOT NULL DEFAULT 'fresh_start' CHECK (workflow_mode IN ('fresh_start', 'carry_over')),
  email_enabled BOOLEAN DEFAULT TRUE,

  -- Email Tracking
  last_email_sent_at TIMESTAMP DEFAULT NULL,
  last_email_failed_at TIMESTAMP DEFAULT NULL,
  consecutive_failures INTEGER DEFAULT 0,

  -- Monetization Fields (Cohort & Trial)
  cohort VARCHAR(50) NOT NULL DEFAULT 'free_launch' CHECK (cohort IN ('free_launch', 'early_freemium_2.99', 'early_freemium_4.99', 'paid_cohort_v1', 'paid_cohort_v2')),
  grandfather_status BOOLEAN DEFAULT FALSE,
  trial_started_at TIMESTAMP DEFAULT NULL,
  trial_expires_at TIMESTAMP DEFAULT NULL,
  trial_tasks_count INTEGER DEFAULT 0,

  -- Payment Tracking
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP DEFAULT NULL,
  paid_price_cents INTEGER DEFAULT NULL,
  unlock_method VARCHAR(50) DEFAULT NULL CHECK (unlock_method IS NULL OR unlock_method IN ('trial_expiry', 'task_limit', 'manual_upgrade')),

  -- Paywall Analytics
  paywall_shown_count INTEGER DEFAULT 0,
  last_paywall_shown_at TIMESTAMP DEFAULT NULL,
  paywall_dismissed_at TIMESTAMP DEFAULT NULL,

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Create indexes for performance
-- Index for trial expiration queries
CREATE INDEX IF NOT EXISTS idx_users_trial_expires 
  ON users(trial_expires_at) 
  WHERE is_paid = FALSE AND trial_expires_at IS NOT NULL;

-- Index for cohort analytics
CREATE INDEX IF NOT EXISTS idx_users_cohort_acquired 
  ON users(cohort, created_at DESC);

-- Index for delivery time queries
CREATE INDEX IF NOT EXISTS idx_users_delivery_time 
  ON users(delivery_time, timezone, email_enabled) 
  WHERE deleted_at IS NULL AND email_enabled = TRUE;

-- Enable Row-Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create SELECT policy: Users can only see their own record
DROP POLICY IF EXISTS "users_select_own" ON users;
CREATE POLICY "users_select_own" 
  ON users 
  FOR SELECT 
  USING (auth.uid() = auth_id);

-- Create UPDATE policy: Users can only update their own record
DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_update_own" 
  ON users 
  FOR UPDATE 
  USING (auth.uid() = auth_id) 
  WITH CHECK (auth.uid() = auth_id);

-- Note: INSERT policy will be handled in Story 1.4 when users sign up
-- Supabase Auth automatically creates records in auth.users table
-- User record creation in users table will be triggered by auth trigger or Edge Function

