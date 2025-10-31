# TodoTomorrow - Complete Technical Architecture

**Version:** 1.0  
**Date:** October 2025  
**Status:** Ready for Development  
**Timeline:** 4-week MVP (Weeks 1-4)

---

## Table of Contents

1. [System Architecture Overview](#system-architecture-overview)
2. [Technology Stack Rationale](#technology-stack-rationale)
3. [Database Schema & Data Model](#database-schema--data-model)
4. [Email Delivery System](#email-delivery-system)
5. [Offline-First Sync Architecture](#offline-first-sync-architecture)
6. [Payment & Trial System](#payment--trial-system)
7. [Frontend Component Architecture](#frontend-component-architecture)
8. [Security & Privacy](#security--privacy)
9. [Deployment Strategy](#deployment-strategy)
10. [Performance & Scalability](#performance--scalability)
11. [Testing Strategy](#testing-strategy)
12. [Risk Analysis & Mitigation](#risk-analysis--mitigation)
13. [Open Questions Resolved](#open-questions-resolved)

---

## System Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER DEVICES                               │
│  ┌──────────────┬──────────────┬──────────────┐                    │
│  │   iOS App    │  Android App │     PWA      │ (React Native/Expo)│
│  │  (Expo EAS)  │  (Expo EAS)  │  (Vercel)    │                    │
│  └──────────────┴──────────────┴──────────────┘                    │
│         │                  │                        │               │
│         └──────────────────┼────────────────────────┘               │
│                            │ HTTPS                                   │
└────────────────────────────┼─────────────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Supabase      │
                    │   (PostgreSQL)  │
                    │   + Auth        │
                    │   + Real-time   │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐      ┌──────▼──────┐    ┌──────▼──────┐
    │ Tasks   │      │ Users/Trials│    │ Payments    │
    │ Table   │      │ Table       │    │ Table       │
    └─────────┘      └─────────────┘    └─────────────┘
         │
    ┌────▼────────────────────────────────────┐
    │   Supabase Edge Functions (Serverless)  │
    │  ┌─────────────────────────────────────┐│
    │  │ Email Cron Job (pg_cron)            ││
    │  │ - Runs hourly                       ││
    │  │ - Fetches users requiring emails    ││
    │  │ - Generates content                 ││
    │  │ - Calls SendGrid API                ││
    │  └─────────────────────────────────────┘│
    │  ┌─────────────────────────────────────┐│
    │  │ Payment Webhook Handler             ││
    │  │ - Stripe webhook listener           ││
    │  │ - Receipt validation                ││
    │  └─────────────────────────────────────┘│
    └────┬────────────────────────────────────┘
         │
    ┌────▼────────────┐      ┌─────────────────┐
    │   SendGrid API  │      │ Stripe / IAP    │
    │  (Email)        │      │ (Payments)      │
    └─────────────────┘      └─────────────────┘
```

### System Components

**Frontend Layer (React Native + Expo):**
- **Mobile Apps:** iOS, Android, PWA (single codebase)
- **State Management:** Zustand (global app state)
- **Local Storage:** AsyncStorage (offline persistence)
- **UI Framework:** NativeWind (Tailwind CSS)

**Backend Layer (Supabase):**
- **Database:** PostgreSQL with RLS policies
- **Authentication:** Magic link (passwordless)
- **Real-time:** WebSocket for task sync
- **Serverless:** Edge Functions for cron jobs

**External Services:**
- **Email:** SendGrid API (100/day free tier)
- **Payments:** Stripe (PWA), Apple IAP (iOS), Google Play Billing (Android)
- **Analytics:** Plausible (privacy-first)

---

## Technology Stack Rationale

| Layer | Technology | Why | Alternative Rejected |
|-------|-----------|-----|---------------------|
| **Mobile Framework** | React Native + Expo | Write once, deploy everywhere (iOS/Android/PWA); managed workflow; OTA updates; no native modules needed | Native Swift/Kotlin (higher dev cost); Flutter (team expertise) |
| **State Management** | Zustand | Lightweight, simple API, performant, perfect for offline-first | Redux (overkill for MVP); Jotai (less mature) |
| **Local Storage** | AsyncStorage | Works cross-platform, simple key-value, sufficient for MVP | SQLite (overkill); WatermelonDB (learning curve) |
| **UI Styling** | NativeWind | Tailwind CSS on React Native, consistent with web dev patterns | StyleSheet API (verbose); Styled Components (less mobile-friendly) |
| **Backend/DB** | Supabase | PostgreSQL, built-in auth, real-time subscriptions, Edge Functions, free tier | Firebase (less control); AWS (higher complexity) |
| **Email Service** | SendGrid | 100 emails/day free, reliable, excellent deliverability | AWS SES (more complex); Mailgun (higher cost) |
| **Payments** | Stripe + IAP | Stripe for PWA simplicity, IAP for native app standards | Gumroad (limited); Paddle (less flexible) |

---

## Database Schema & Data Model

### Overview

The database supports both workflow modes (Fresh Start / Carry Over) through status tracking and timestamp logic. A single schema elegantly handles both modes with appropriate queries.

### SQL Schema Definition

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

### Row-Level Security (RLS) Policies

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

### Data Model Decisions

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

## Email Delivery System

### Architecture Overview

The email delivery system is the core innovation—automated batched email at user-configurable times. This section details the complete implementation.

### Email Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Supabase Edge Function (Runs Hourly via pg_cron)               │
├─────────────────────────────────────────────────────────────────┤
│ 1. Get current UTC hour                                         │
│ 2. Query users WHERE:                                           │
│    - delivery_time converts to current UTC hour in their tz    │
│    - is_paid = true OR trial is valid                          │
│    - last_email_sent_at < 24h ago                              │
│ 3. For each user:                                              │
│    ├─ Get tasks based on workflow_mode:                        │
│    │  ├─ fresh_start: created_at > last_email_sent_at         │
│    │  └─ carry_over: status IN ('open', 'completed')          │
│    ├─ Skip if no tasks                                         │
│    ├─ Render email template                                    │
│    ├─ Send via SendGrid                                        │
│    ├─ Log send in email_logs table                             │
│    └─ Update user.last_email_sent_at = NOW()                  │
│ 4. Handle failures & retry logic                               │
└─────────────────────────────────────────────────────────────────┘
```

### Timezone Conversion Logic

**Problem:** User sets "6:00 AM EST" locally. Cron job runs in UTC. Need to match.

**Solution:** Store timezone as IANA string (e.g., "America/New_York"), convert in SQL:

```sql
-- Query to find users whose email should be sent THIS HOUR
WITH current_hour AS (
  SELECT 
    EXTRACT(HOUR FROM NOW() AT TIME ZONE 'UTC')::INT AS utc_hour,
    NOW() AT TIME ZONE 'UTC' AS utc_now
)
SELECT 
  u.id,
  u.email,
  u.delivery_time,
  u.timezone,
  u.workflow_mode,
  u.last_email_sent_at,
  (NOW() AT TIME ZONE u.timezone)::TIME AS user_local_time
FROM users u, current_hour
WHERE 
  u.deleted_at IS NULL
  AND (u.is_paid OR (
    u.trial_started_at IS NOT NULL 
    AND u.trial_started_at > NOW() - INTERVAL '30 days'
    AND u.trial_tasks_count < 100
  ))
  AND EXTRACT(HOUR FROM (NOW() AT TIME ZONE u.timezone))::INT = 
      EXTRACT(HOUR FROM u.delivery_time)::INT
  AND (
    u.last_email_sent_at IS NULL 
    OR u.last_email_sent_at < NOW() - INTERVAL '20 hours'
  )
ORDER BY u.id;
```

**Why 20 hours instead of 24h:** Accounts for cron variance, prevents double-sends.

### Supabase Edge Function Implementation

```typescript
// supabase/functions/send-daily-emails/index.ts
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!
const SENDGRID_FROM_EMAIL = 'team@todotomorrow.app'

interface EmailUser {
  id: string
  email: string
  delivery_time: string
  timezone: string
  workflow_mode: 'fresh_start' | 'carry_over'
  last_email_sent_at: string | null
}

interface Task {
  id: string
  text: string
  priority: string | null
  due_date: string | null
  created_at: string
}

async function fetchUsersForEmailRound(): Promise<EmailUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, delivery_time, timezone, workflow_mode, last_email_sent_at')
    .is('deleted_at', null)
    .or('is_paid.eq.true,and(trial_started_at.gt.now()-30d,trial_tasks_count.lt.100)')
    .order('id')

  if (error) throw error
  return data || []
}

async function fetchTasksForUser(
  userId: string,
  workflowMode: 'fresh_start' | 'carry_over',
  lastEmailSentAt: string | null
): Promise<Task[]> {
  let query = supabase
    .from('tasks')
    .select('id, text, priority, due_date, created_at')
    .eq('user_id', userId)
    .eq('status', 'open')

  if (workflowMode === 'fresh_start' && lastEmailSentAt) {
    // Fresh Start: only tasks created since last email
    query = query.gt('created_at', lastEmailSentAt)
  }
  // Carry Over: all open tasks (query already filters status = 'open')

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

function generateEmailHTML(
  tasks: Task[],
  workflowMode: 'fresh_start' | 'carry_over',
  userName: string
): string {
  if (tasks.length === 0) {
    return `
      <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333;">
          <h2>Good morning, ${escapeHTML(userName)}! ☀️</h2>
          <p>No new tasks for today. Enjoy your morning coffee! ☕</p>
        </body>
      </html>
    `
  }

  const taskHTML = tasks
    .map(
      (task, i) => `
    <tr style="border-bottom: 1px solid #eee;">
      <td style="padding: 12px; vertical-align: top;">
        <span style="display: inline-block; width: 24px; height: 24px; 
                     line-height: 24px; text-align: center; 
                     background: #f0f0f0; border-radius: 4px; 
                     font-size: 12px; font-weight: bold;">
          ${i + 1}
        </span>
      </td>
      <td style="padding: 12px;">
        <p style="margin: 0; font-weight: ${task.priority === 'high' ? 'bold' : 'normal'};">
          ${escapeHTML(task.text)}
        </p>
        ${task.due_date ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">Due: ${escapeHTML(task.due_date)}</p>` : ''}
      </td>
    </tr>
    `
    )
    .join('')

  return `
    <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <h2 style="margin-top: 0;">Good morning! ☀️</h2>
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
          Here's your ${tasks.length} todo${tasks.length !== 1 ? 's' : ''} for today. 
          ${workflowMode === 'fresh_start' ? 'After review, you can clear these from the app.' : 'Mark items as done as you complete them.'}
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tbody>
            ${taskHTML}
          </tbody>
        </table>
        <p style="color: #999; font-size: 12px; text-align: center;">
          Open TodoTomorrow to manage your tasks • ${workflowMode === 'fresh_start' ? 'Fresh Start mode' : 'Carry Over mode'}
        </p>
      </body>
    </html>
  `
}

function escapeHTML(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<string | null> {
  try {
    const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: SENDGRID_FROM_EMAIL, name: 'TodoTomorrow' },
      subject,
      content: [{ type: 'text/html', value: html }],
      mail_settings: {
        sandbox_mode: { enable: false }
      }
    }, {
      headers: {
        Authorization: `Bearer ${SENDGRID_API_KEY}`
      }
    })

    // SendGrid returns message ID in header
    return response.headers['x-message-id'] || null
  } catch (error) {
    console.error('SendGrid error:', error)
    return null
  }
}

async function updateLastEmailSent(userId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ 
      last_email_sent_at: new Date().toISOString(),
      consecutive_failures: 0
    })
    .eq('id', userId)

  if (error) throw error
}

async function recordEmailSent(
  userId: string,
  recipientEmail: string,
  taskCount: number,
  messageId: string | null
): Promise<void> {
  const { error } = await supabase
    .from('email_logs')
    .insert({
      user_id: userId,
      recipient_email: recipientEmail,
      subject: `Your ${taskCount} Todo${taskCount !== 1 ? 's' : ''} for Today`,
      sendgrid_message_id: messageId,
      task_count: taskCount,
      status: messageId ? 'sent' : 'failed'
    })

  if (error) console.error('Failed to log email:', error)
}

async function handleEmailFailure(userId: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ 
      last_email_failed_at: new Date().toISOString(),
      consecutive_failures: 'consecutive_failures + 1'
    })
    .eq('id', userId)

  if (error) console.error('Failed to update failure count:', error)
}

// Main handler
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Only POST allowed', { status: 405 })
  }

  try {
    const users = await fetchUsersForEmailRound()
    console.log(`Processing ${users.length} users for email round`)

    let successCount = 0
    let failureCount = 0

    for (const user of users) {
      try {
        const tasks = await fetchTasksForUser(
          user.id,
          user.workflow_mode,
          user.last_email_sent_at
        )

        // Generate email regardless of task count (empty state email)
        const html = generateEmailHTML(tasks, user.workflow_mode, user.email)
        const subject = tasks.length > 0 
          ? `Your ${tasks.length} todos for today` 
          : 'Your morning check-in'

        // Send email
        const messageId = await sendEmail(user.email, subject, html)

        if (messageId) {
          await updateLastEmailSent(user.id)
          await recordEmailSent(user.id, user.email, tasks.length, messageId)
          successCount++
        } else {
          await handleEmailFailure(user.id)
          failureCount++
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error)
        await handleEmailFailure(user.id)
        failureCount++
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Email round complete: ${successCount} sent, ${failureCount} failed`,
        stats: { successCount, failureCount, totalUsers: users.length }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Email round failed:', error)
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Cron Job Setup

Schedule the edge function to run hourly via pg_cron:

```sql
-- Run email function every hour (adjust as needed)
SELECT cron.schedule(
  'send-daily-emails-hourly',
  '0 * * * *', -- every hour
  $$
  SELECT http_post(
    'https://<project>.supabase.co/functions/v1/send-daily-emails',
    '{}',
    'Bearer <edge-function-secret>'
  )
  $$
);

-- View active jobs
SELECT * FROM cron.job;

-- Delete job if needed
SELECT cron.unschedule('send-daily-emails-hourly');
```

### Email Deliverability Strategy (Target: 95%+)

**SendGrid Configuration:**
1. Verify sender domain (DNS DKIM/SPF records)
2. Enable authentication: SPF, DKIM, DMARC
3. Warm up sending gradually (start low volume, increase over days)

**Email Content Best Practices:**
- Plain, professional HTML with inline CSS
- No external images (prevents spam flagging)
- Simple text-only fallback
- Clear unsubscribe mechanism (header)
- No aggressive CTAs (keeps it simple)

**Monitoring & Recovery:**
- Track bounce/spam rates in `email_logs` table
- Alert if `consecutive_failures > 3`
- Implement exponential backoff: retry failed sends after 1h, 4h, 24h
- Manual intervention triggers at 5+ consecutive failures

**SendGrid Free Tier Constraint:** 100 emails/day
- At launch: ~5-10 active users → minimal
- As user base grows: upgrade to paid tier ($20/month ~ 500K/month)
- Monitor `email_logs` for daily volume

---

## Offline-First Sync Architecture

### Overview

TodoTomorrow must work completely offline. Users can add tasks, mark complete, and see full history without internet. Sync happens automatically when connection restores.

### Data Flow Diagram

```
LOCAL (AsyncStorage)          REMOTE (Supabase)
┌─────────────────────────────────────────────┐
│ ┌──────────────────┐                         │
│ │ Local Tasks List │────(optimistic)─────┐  │
│ │ (AsyncStorage)   │                     │  │
│ │                  │                     ▼  │
│ │ [               ]    ┌────────────────────┐ │
│ │ [TASK 1]        │    │  Supabase Tasks   │ │
│ │ [TASK 2]        │    │  (PostgreSQL)     │ │
│ │ [TASK 3 NEW]    │◄───┤                  │ │
│ └──────────────────┘    └────────────────────┘ │
│         │                                      │
│         │ (user offline)                       │
│         │ store locally                        │
│         │                                      │
│    ┌────▼──────────────────┐                  │
│    │ Sync Queue            │                  │
│    │ [                     ]│                  │
│    │ - CREATE task_3       │                  │
│    │ - UPDATE task_1 done  │                  │
│    │ - DELETE task_2       │                  │
│    └────┬──────────────────┘                  │
│         │                                      │
│    (internet restored)                        │
│         │                                      │
│         ▼                                      │
│    ┌─────────────────┐                        │
│    │ Apply sync queue│                        │
│    │ to Supabase     │                        │
│    │ (batch/single)  │                        │
│    └─────────────────┘                        │
└─────────────────────────────────────────────┘
```

### AsyncStorage Data Structure

Store offline data exactly matching Supabase schema. Example:

```typescript
// Store in AsyncStorage:
{
  "tasks": [
    {
      "id": "uuid-1",
      "text": "Buy groceries",
      "priority": "high",
      "due_date": "2025-10-31",
      "status": "open",
      "created_at": "2025-10-30T22:15:00Z",
      "updated_at": "2025-10-30T22:15:00Z",
      "synced": false  // Flag: not yet sent to server
    },
    {
      "id": "uuid-2",
      "text": "Review proposal",
      "priority": "medium",
      "due_date": null,
      "status": "completed",
      "created_at": "2025-10-29T18:00:00Z",
      "updated_at": "2025-10-30T21:30:00Z",
      "completed_at": "2025-10-30T21:30:00Z",
      "synced": true  // Already sent to server
    }
  ],
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "delivery_time": "06:00:00",
    "timezone": "America/New_York",
    "workflow_mode": "fresh_start",
    "trial_started_at": "2025-10-25T00:00:00Z",
    "trial_tasks_count": 5,
    "is_paid": false
  },
  "syncMetadata": {
    "lastSyncAt": "2025-10-30T22:00:00Z",
    "pendingCount": 3,
    "isOnline": false
  }
}
```

### Zustand Store Architecture

```typescript
// store/taskStore.ts
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Task {
  id: string
  text: string
  priority?: 'high' | 'medium' | 'low'
  due_date?: string
  status: 'open' | 'completed'
  created_at: string
  updated_at: string
  completed_at?: string
  synced: boolean
}

interface SyncQueue {
  operation: 'CREATE' | 'UPDATE' | 'DELETE'
  taskId: string
  taskData?: Task
  timestamp: number
}

interface TaskStore {
  // State
  tasks: Task[]
  syncQueue: SyncQueue[]
  isOnline: boolean
  isSyncing: boolean
  
  // Local operations (immediate)
  addTask: (text: string, priority?: string) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  completeTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  
  // Sync operations
  syncWithServer: () => Promise<void>
  setOnlineStatus: (online: boolean) => void
  
  // Initialization
  loadFromStorage: () => Promise<void>
  saveToStorage: () => Promise<void>
}

export const useTaskStore = create<TaskStore>()(
  subscribeWithSelector((set, get) => ({
    tasks: [],
    syncQueue: [],
    isOnline: true,
    isSyncing: false,

    addTask: async (text: string, priority?: string) => {
      const { tasks } = get()
      const newTask: Task = {
        id: generateUUID(),
        text,
        priority: priority as any,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false
      }

      // Optimistic update: add to local state immediately
      set((state) => ({
        tasks: [...state.tasks, newTask],
        syncQueue: [
          ...state.syncQueue,
          {
            operation: 'CREATE',
            taskId: newTask.id,
            taskData: newTask,
            timestamp: Date.now()
          }
        ]
      }))

      // Persist to AsyncStorage
      await get().saveToStorage()

      // Auto-sync if online
      if (get().isOnline) {
        await get().syncWithServer()
      }
    },

    completeTask: async (id: string) => {
      const { tasks } = get()
      const task = tasks.find((t) => t.id === id)

      if (!task) return

      const updated: Task = {
        ...task,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        synced: false
      }

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        syncQueue: [
          ...state.syncQueue,
          {
            operation: 'UPDATE',
            taskId: id,
            taskData: updated,
            timestamp: Date.now()
          }
        ]
      }))

      await get().saveToStorage()

      if (get().isOnline) {
        await get().syncWithServer()
      }
    },

    syncWithServer: async () => {
      const { syncQueue, isOnline, isSyncing } = get()

      if (!isOnline || isSyncing || syncQueue.length === 0) return

      set({ isSyncing: true })

      try {
        // Batch sync operations
        for (const item of syncQueue) {
          try {
            if (item.operation === 'CREATE') {
              await supabase.from('tasks').insert([item.taskData!])
            } else if (item.operation === 'UPDATE') {
              await supabase
                .from('tasks')
                .update(item.taskData!)
                .eq('id', item.taskId)
            } else if (item.operation === 'DELETE') {
              await supabase.from('tasks').delete().eq('id', item.taskId)
            }

            // Mark as synced
            set((state) => ({
              tasks: state.tasks.map((t) =>
                t.id === item.taskId ? { ...t, synced: true } : t
              ),
              syncQueue: state.syncQueue.filter((q) => q.taskId !== item.taskId)
            }))
          } catch (error) {
            console.error(`Failed to sync ${item.operation} for ${item.taskId}:`, error)
            // Keep in queue, retry next time
            break
          }
        }

        await get().saveToStorage()
      } finally {
        set({ isSyncing: false })
      }
    },

    setOnlineStatus: (online: boolean) => {
      set({ isOnline: online })
      if (online) {
        get().syncWithServer()
      }
    },

    saveToStorage: async () => {
      const { tasks, syncQueue } = get()
      try {
        await AsyncStorage.setItem(
          'tasks_store',
          JSON.stringify({ tasks, syncQueue, lastSyncAt: new Date().toISOString() })
        )
      } catch (error) {
        console.error('Failed to save to AsyncStorage:', error)
      }
    },

    loadFromStorage: async () => {
      try {
        const data = await AsyncStorage.getItem('tasks_store')
        if (data) {
          const { tasks, syncQueue } = JSON.parse(data)
          set({ tasks, syncQueue })
        }
      } catch (error) {
        console.error('Failed to load from AsyncStorage:', error)
      }
    }
  }))
)
```

### Conflict Resolution

**Strategy:** Last-Write-Wins (LWW)

For single-user apps, LWW is sufficient:
1. Client updates task locally (set `updated_at` to client timestamp)
2. Server receives sync, compares `updated_at` timestamps
3. If client `updated_at` > server `updated_at`, accept client version
4. Otherwise keep server version

If needed post-MVP, implement vector clocks for causal ordering.

### Online/Offline Detection

```typescript
// hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react'
import NetInfo from '@react-native-community/netinfo'
import { useTaskStore } from '../store/taskStore'

export function useNetworkStatus() {
  const setOnlineStatus = useTaskStore((state) => state.setOnlineStatus)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = state.isConnected && state.isInternetReachable
      setOnlineStatus(isOnline)
    })

    return () => unsubscribe()
  }, [setOnlineStatus])
}
```

### Multi-Device Sync

**On first login on new device:**

```typescript
async function handleFirstLoginNewDevice(userId: string) {
  // User logs in on new device
  // 1. Fetch all tasks from Supabase
  const { data: remoteTasks } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)

  // 2. Clear local AsyncStorage
  await AsyncStorage.removeItem('tasks_store')

  // 3. Load remote tasks as local source-of-truth
  set({ tasks: remoteTasks || [], syncQueue: [] })
  await get().saveToStorage()
}
```

---

## Payment & Trial System

### Trial Logic

**Trigger:** First task creation  
**Duration:** 30 days OR 100 tasks (whichever first)  
**Status:** Stored in `users` table

```typescript
function calculateTrialStatus(user: User): TrialStatus {
  if (user.is_paid) {
    return { active: false, reason: 'paid' }
  }

  if (!user.trial_started_at) {
    return { active: false, reason: 'not_started' }
  }

  const daysElapsed = Math.floor(
    (Date.now() - new Date(user.trial_started_at).getTime()) / (1000 * 60 * 60 * 24)
  )

  const daysRemaining = Math.max(0, 30 - daysElapsed)
  const tasksRemaining = Math.max(0, 100 - user.trial_tasks_count)

  const active = daysRemaining > 0 && tasksRemaining > 0

  return {
    active,
    daysRemaining,
    tasksRemaining,
    expiredReason: active ? null : daysRemaining === 0 ? 'days_expired' : 'tasks_expired'
  }
}
```

### Trial Task Counter

**Strategy:** Increment on server during sync, not on client

Why: Prevents fraud (client could artificially inflate count offline). Server is source-of-truth.

**Implementation:**

```sql
-- Increment trial_tasks_count when syncing new tasks
CREATE OR REPLACE FUNCTION increment_trial_tasks_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'open' AND NEW.synced IS FALSE THEN
    UPDATE users
    SET trial_tasks_count = trial_tasks_count + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_trial_on_task_create
AFTER INSERT ON tasks
FOR EACH ROW
EXECUTE FUNCTION increment_trial_tasks_on_insert();
```

### Payment Platforms

#### Platform 1: Stripe (PWA)

```typescript
// stripe-integration.ts
import Stripe from '@stripe/stripe-js'

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)

async function createPaymentIntent(userId: string): Promise<string> {
  const response = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  })

  const { clientSecret } = await response.json()
  return clientSecret
}

async function processPaymentStripe(userId: string, email: string): Promise<boolean> {
  const stripe = await stripePromise
  const clientSecret = await createPaymentIntent(userId)

  const result = await stripe!.confirmCardPayment(clientSecret, {
    payment_method: {
      card: elements.getElement(CardElement)!,
      billing_details: { email }
    }
  })

  if (result.paymentIntent?.status === 'succeeded') {
    // Server webhook will update user.is_paid = true
    return true
  }

  return false
}
```

**Webhook Handler (Edge Function):**

```typescript
// supabase/functions/stripe-webhook/index.ts
export async function handleStripeWebhook(event: any) {
  const { type, data } = event

  if (type === 'payment_intent.succeeded') {
    const { metadata, id: stripePaymentId } = data.object

    // Find user by Stripe ID in metadata
    const { data: payment, error } = await supabase
      .from('payments')
      .update({
        validation_status: 'valid',
        validated_at: new Date().toISOString()
      })
      .eq('external_transaction_id', stripePaymentId)
      .select()
      .single()

    if (payment) {
      await supabase
        .from('users')
        .update({
          is_paid: true,
          last_payment_at: new Date().toISOString()
        })
        .eq('id', payment.user_id)
    }
  }
}
```

#### Platform 2: Apple IAP (iOS)

```typescript
// apple-iap-integration.ts
import { requestPurchase, purchaseUpdatedListener } from 'react-native-iap'

const APPLE_PRODUCT_ID = 'com.todotomorrow.subscription_month'

export async function processPaymentApple(userId: string): Promise<boolean> {
  try {
    await requestPurchase({ skus: [APPLE_PRODUCT_ID] })

    // Listen for purchase completion
    const subscription = purchaseUpdatedListener((purchase) => {
      if (purchase.purchaseStateAndroid === 'PurchasedAndroid' || purchase.isProductPurchaseIOS) {
        // Send receipt to server for validation
        validateAppleReceipt(userId, purchase.transactionReceipt)
      }
    })

    return true
  } catch (error) {
    console.error('Apple IAP error:', error)
    return false
  }
}

async function validateAppleReceipt(userId: string, receiptData: string): Promise<void> {
  // Call Supabase Edge Function to validate with Apple
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/validate-apple-receipt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, receiptData })
    }
  )

  const result = await response.json()
  if (result.valid) {
    // Server marks user as paid
  }
}
```

#### Platform 3: Google Play Billing (Android)

```typescript
// google-iap-integration.ts
import { 
  requestPurchase, 
  acknowledgePurchaseAndroid,
  validateReceiptAndroid 
} from 'react-native-iap'

const GOOGLE_PRODUCT_ID = 'com.todotomorrow.subscription_month'

export async function processPaymentGoogle(userId: string): Promise<boolean> {
  try {
    const sku = await requestPurchase({ skus: [GOOGLE_PRODUCT_ID] })

    // Acknowledge purchase
    if (sku?.purchaseToken) {
      await acknowledgePurchaseAndroid({
        token: sku.purchaseToken,
        packageName: 'com.todotomorrow'
      })

      // Validate receipt
      await validateGoogleReceipt(userId, sku.transactionReceipt)
      return true
    }

    return false
  } catch (error) {
    console.error('Google IAP error:', error)
    return false
  }
}

async function validateGoogleReceipt(userId: string, receiptData: string): Promise<void> {
  const response = await fetch(
    `${SUPABASE_URL}/functions/v1/validate-google-receipt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, receiptData })
    }
  )

  const result = await response.json()
  if (result.valid) {
    // Server marks user as paid
  }
}
```

### Trial Enforcement (Client-Side)

```typescript
// components/TrialGate.tsx
import { useEffect, useState } from 'react'
import { useTaskStore } from '../store/taskStore'

export function TrialGate() {
  const user = useUserStore((s) => s.user)
  const [trialStatus, setTrialStatus] = useState(null)

  useEffect(() => {
    if (user) {
      const status = calculateTrialStatus(user)
      setTrialStatus(status)
    }
  }, [user])

  if (!trialStatus?.active) {
    return <PaymentRequired reason={trialStatus?.expiredReason} />
  }

  return (
    <div>
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      {/* App content */}
    </div>
  )
}
```

---

## Frontend Component Architecture

### App Navigation Structure

```
App
├── AuthStack (if not logged in)
│   ├── AuthScreen
│   │   ├── EmailInput
│   │   └── MagicLinkVerification
│   └── OnboardingStack
│       ├── WorkflowModeSelection
│       ├── DeliveryTimeConfiguration
│       └── TutorialSlides
│
└── MainStack (if logged in)
    ├── TasksScreen (Home)
    │   ├── TaskInput
    │   ├── TaskList
    │   ├── TaskItem (with completion animation)
    │   ├── EmptyState
    │   └── SyncIndicator
    │
    ├── ArchiveScreen (if carry_over mode)
    │   └── CompletedTasksList
    │
    ├── SettingsStack
    │   ├── SettingsScreen
    │   │   ├── DeliveryTimeEditor
    │   │   ├── WorkflowModeToggle
    │   │   ├── TrialStatus
    │   │   └── PaymentButton
    │   │
    │   └── PaymentScreen
    │       ├── TrialBanner
    │       ├── PricingCards
    │       └── PurchaseButton
    │
    └── ProfileStack
        └── ProfileScreen
            ├── UserEmail
            ├── LogoutButton
            └── Version Info
```

### Core Component Examples

See original front-end-architecture.md for detailed component implementations.

---

## Security & Privacy

### Authentication

**Magic Link Flow:**

```typescript
// auth/magicLink.ts
async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback`
    }
  })

  if (error) throw error
}

async function verifyMagicLink(token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  })

  if (error) throw error
  return data
}
```

### Data Protection

- All API calls use HTTPS/TLS 1.3
- RLS policies enforce user-level access control
- Optional at-rest encryption for sensitive fields
- GDPR data deletion and export functionality

---

## Deployment Strategy

### Timeline

**Week 1:** Database + Foundation deployed  
**Week 2:** Email system + Workflow modes ready  
**Week 3:** Monetization + PWA beta  
**Week 4:** App Store submissions + Public launch

### Environment Configuration

Use secure secret management via Supabase Edge Functions for all API keys and credentials.

---

## Performance & Scalability

| Metric | Target | Achievement |
|--------|--------|-------------|
| Task creation | <100ms | Optimistic updates + AsyncStorage |
| Task completion animation | 600ms | Native Animated API |
| Email delivery | <30s per batch | Parallel SendGrid calls |
| Sync processing | <5s | Batch operations |
| Email deliverability | 95%+ | SendGrid DKIM + content validation |

---

## Testing Strategy

**Unit Tests:** Task store, payment logic, email generation  
**Integration Tests:** End-to-end task flow, offline/online sync  
**Email Tests:** Template generation, timezone conversion, deliverability  
**Manual Testing:** Cross-platform, payment flows, GDPR compliance

---

## Risk Analysis & Mitigation

| Risk | Mitigation |
|------|-----------|
| **SendGrid rate limits** | Monitor volume, queue failures, upgrade plan early |
| **Timezone bugs** | Comprehensive test coverage, user time verification |
| **Offline sync conflicts** | Last-Write-Wins strategy + extensive testing |
| **Payment fraud** | Server-side receipt validation, third-party verification |
| **App store rejection** | Early review with guidelines, test IAP implementation |

---

## Critical Success Factors

✅ Database schema final before development  
✅ Email cron job functional before testing  
✅ Payment integration complete before monetization  
✅ PWA export working by Week 3  
✅ App submissions by end of Week 2  

---

**This architecture is complete and ready for development.** 🚀

---

**Document Version:** 1.0  
**Status:** Ready for Development Sprint  
**Timeline:** 4-week MVP
