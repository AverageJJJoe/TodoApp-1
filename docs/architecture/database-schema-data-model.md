# Database Schema & Data Model

## Overview

The database supports both workflow modes (Fresh Start / Carry Over) through status tracking and timestamp logic. A single schema elegantly handles both modes with appropriate queries.

## SQL Schema Definition

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Delivery preferences
  delivery_time TIME NOT NULL DEFAULT '06:00:00',
  timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
  workflow_mode VARCHAR(20) NOT NULL DEFAULT 'fresh_start' 
    CHECK (workflow_mode IN ('fresh_start', 'carry_over')),
  email_enabled BOOLEAN DEFAULT TRUE,
  
  -- Email tracking
  last_email_sent_at TIMESTAMP DEFAULT NULL,
  last_email_failed_at TIMESTAMP DEFAULT NULL,
  consecutive_failures INTEGER DEFAULT 0,
  
  -- Monetization: Cohort & Trial
  cohort VARCHAR(50) NOT NULL DEFAULT 'free_launch'
    CHECK (cohort IN ('free_launch', 'early_freemium_2.99', 'early_freemium_4.99', 'paid_cohort_v1', 'paid_cohort_v2')),
  grandfather_status BOOLEAN DEFAULT FALSE,
  trial_started_at TIMESTAMP DEFAULT NULL,
  trial_expires_at TIMESTAMP DEFAULT NULL,
  trial_tasks_count INTEGER DEFAULT 0,
  
  -- Payment tracking
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP DEFAULT NULL,
  paid_price_cents INTEGER DEFAULT NULL,
  unlock_method VARCHAR(50) DEFAULT NULL
    CHECK (unlock_method IS NULL OR unlock_method IN ('trial_expiry', 'task_limit', 'manual_upgrade')),
  
  -- Paywall analytics
  paywall_shown_count INTEGER DEFAULT 0,
  last_paywall_shown_at TIMESTAMP DEFAULT NULL,
  paywall_dismissed_at TIMESTAMP DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Task content (using 'text' for better semantics, but stories may reference as 'title' in UI)
  text VARCHAR(500) NOT NULL,
  
  -- Task metadata
  due_date DATE DEFAULT NULL,
  priority VARCHAR(10) DEFAULT NULL 
    CHECK (priority IS NULL OR priority IN ('high', 'medium', 'low')),
  
  -- Task status (enum for cleaner queries, with timestamp for ordering)
  status VARCHAR(20) NOT NULL DEFAULT 'open' 
    CHECK (status IN ('open', 'completed', 'archived')),
  completed_at TIMESTAMP DEFAULT NULL,
  archived_at TIMESTAMP DEFAULT NULL,
  
  -- Sync/email tracking (for offline-first architecture)
  synced_at TIMESTAMP DEFAULT NULL,
  emailed_at TIMESTAMP DEFAULT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP DEFAULT NULL
);

-- Payments table (for receipt validation & audit trail)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment details
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('stripe', 'apple', 'google')),
  external_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  receipt_data TEXT NOT NULL,
  
  -- Validation
  validated_at TIMESTAMP DEFAULT NULL,
  validation_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (validation_status IN ('pending', 'valid', 'invalid', 'refunded')),
  
  -- Financial
  amount_cents INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  
  -- Monetization analytics
  cohort_at_purchase VARCHAR(50) NOT NULL,
  test_variant_paid BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NULL
);

-- Email log (for debugging & deliverability tracking)
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Email details
  recipient_email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  
  -- Sending info
  sendgrid_message_id VARCHAR(255) UNIQUE DEFAULT NULL,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'sent'
    CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
  
  -- Task count for this email
  task_count INTEGER NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id_created ON tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_id_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_completed_at ON tasks(user_id, completed_at DESC) 
  WHERE status = 'completed';
CREATE INDEX idx_users_delivery_time ON users(delivery_time, timezone, email_enabled)
  WHERE deleted_at IS NULL AND email_enabled = TRUE;
CREATE INDEX idx_users_trial_expires ON users(trial_expires_at) 
  WHERE is_paid = FALSE AND trial_expires_at IS NOT NULL;
CREATE INDEX idx_users_cohort_acquired ON users(cohort, created_at DESC);
CREATE INDEX idx_email_logs_user_sent ON email_logs(user_id, sent_at DESC);
CREATE INDEX idx_payments_user_created ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_external_transaction_id ON payments(external_transaction_id);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
```

## Row-Level Security (RLS) Policies

```sql
-- Users: Users can only see their own record
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- Tasks: Users can only see/modify their own tasks
CREATE POLICY "tasks_select_own" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tasks.user_id 
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "tasks_insert_own" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_id 
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "tasks_update_own" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tasks.user_id 
      AND users.auth_id = auth.uid()
    )
  );

CREATE POLICY "tasks_delete_own" ON tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = tasks.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- Payments: Users can only see their own payments
CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = payments.user_id 
      AND users.auth_id = auth.uid()
    )
  );

-- Email logs: Users can only see their own logs (for debugging)
CREATE POLICY "email_logs_select_own" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = email_logs.user_id 
      AND users.auth_id = auth.uid()
    )
  );
```

## Data Model Decisions

**Task Status Values:** `open` | `completed` | `archived`

- **open:** Task exists, not yet completed
- **completed:** Task marked done by user
- **archived:** Task moved to archive (for future features)

**Why No "emailed" Status:** Derive from `emailed_at` timestamp instead. This is cleaner because:
- Doesn't require schema migration if email logic changes
- Allows tracking multiple emails per task (future feature)
- Simplifies Fresh Start mode: just query `created_at > last_email_sent_at`

**Trial System:**
- Trial starts on first task creation (increment `trial_started_at`)
- Trial limit: 30 days OR 100 tasks (whichever expires first)
- When paid: set `is_paid = true`, keep `trial_tasks_count` for analytics

**Email Tracking:**
- `emailed_at`: Timestamp when task was included in sent email
- `last_email_sent_at` (on users table): Most recent email sent time for user
- Enables accurate "Carry Over" queries: `WHERE created_at > last_email_sent_at`

---
