# Email Delivery System

## Architecture Overview

The email delivery system is the core innovation—automated batched email at user-configurable times. This section details the complete implementation.

## Email Flow Diagram

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

## Timezone Conversion Logic

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

## Supabase Edge Function Implementation

```typescript
// supabase/functions/send-daily-emails/index.ts
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')!
const SENDGRID_FROM_EMAIL = 'team@todomorning.app'

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
          Open TodoMorning to manage your tasks • ${workflowMode === 'fresh_start' ? 'Fresh Start mode' : 'Carry Over mode'}
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
      from: { email: SENDGRID_FROM_EMAIL, name: 'TodoMorning' },
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

## Cron Job Setup

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

## Email Deliverability Strategy (Target: 95%+)

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
