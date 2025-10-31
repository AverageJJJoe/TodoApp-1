# Appendix B: Database Schema

**Note:** This schema matches the unified schema in `docs/architecture.md`. The database field `text` in the tasks table is displayed as "title" in the UI for better user experience.

## Users Table

```sql
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

CREATE INDEX idx_users_trial_expires ON users(trial_expires_at) 
  WHERE is_paid = FALSE AND trial_expires_at IS NOT NULL;
CREATE INDEX idx_users_cohort_acquired ON users(cohort, created_at DESC);
CREATE INDEX idx_users_delivery_time ON users(delivery_time, timezone, email_enabled)
  WHERE deleted_at IS NULL AND email_enabled = TRUE;
```

## Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Task content (database field is 'text', UI displays as 'title')
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

CREATE INDEX idx_tasks_user_id_created ON tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_id_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_completed_at ON tasks(user_id, completed_at DESC) 
  WHERE status = 'completed';
```

## Payments Table

```sql
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

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_user_created ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_external_transaction_id ON payments(external_transaction_id);
```

## Email Logs Table

```sql
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

CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_user_sent ON email_logs(user_id, sent_at DESC);
```

---
