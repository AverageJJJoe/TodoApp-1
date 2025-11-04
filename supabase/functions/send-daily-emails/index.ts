// Supabase Edge Function: send-daily-emails
// Automated cron job that sends daily task emails to users
// Runs hourly via pg_cron at minute 0 of each hour

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface EmailUser {
  id: string;
  email: string;
  delivery_time: string; // TIME format (HH:mm:ss)
  timezone: string; // IANA timezone string (e.g., "America/New_York")
  workflow_mode: 'fresh_start' | 'carry_over';
  last_email_sent_at: string | null;
  is_paid: boolean;
  trial_started_at: string | null;
  trial_tasks_count: number;
}

interface Task {
  id: string;
  text: string;
  created_at: string;
}

interface ProcessResult {
  usersProcessed: number;
  emailsSent: number;
  errors: Array<{ userId: string; email: string; error: string }>;
}

// HTML escaping function to prevent XSS
function escapeHTML(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Get current hour in user's timezone
function getCurrentHourInTimezone(timezone: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });
  return parseInt(formatter.format(now), 10);
}

// Parse delivery_time (HH:mm:ss) to get hour
function getDeliveryHour(deliveryTime: string): number {
  const [hours] = deliveryTime.split(':').map(Number);
  return hours;
}

// Check if user's current local hour matches their delivery time hour
function shouldSendEmailNow(user: EmailUser): boolean {
  const currentHour = getCurrentHourInTimezone(user.timezone);
  const deliveryHour = getDeliveryHour(user.delivery_time);
  return currentHour === deliveryHour;
}

// Check if trial is valid
function isTrialValid(user: EmailUser): boolean {
  if (user.is_paid) return true;
  if (!user.trial_started_at) return false;
  
  const trialStart = new Date(user.trial_started_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return trialStart > thirtyDaysAgo && user.trial_tasks_count < 100;
}

// Check if enough time has passed since last email (20 hours)
function canSendEmailAgain(lastEmailSentAt: string | null): boolean {
  if (!lastEmailSentAt) return true;
  
  const lastSent = new Date(lastEmailSentAt);
  const twentyHoursAgo = new Date();
  twentyHoursAgo.setHours(twentyHoursAgo.getHours() - 20);
  
  return lastSent < twentyHoursAgo;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests (for manual testing)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed. Use POST.' }, null, 2),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Check for test mode via query parameter or header (bypass timezone check for testing)
  const url = new URL(req.url);
  const testModeParam = url.searchParams.get('test');
  const testModeHeader = req.headers.get('x-test-mode');
  const testMode = testModeParam === 'true' || testModeHeader === 'true';

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const resendFromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'hello@todotomorrow.com';

    // Validate required environment variables
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify(
          { error: 'Server configuration error: Missing Supabase credentials' },
          null,
          2
        ),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (!resendApiKey) {
      console.error('Missing Resend API key');
      return new Response(
        JSON.stringify(
          { error: 'Server configuration error: Missing RESEND_API_KEY' },
          null,
          2
        ),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Task 2: Query eligible users (Option B: Fetch all, filter in JavaScript for MVP)
    console.log(`🔍 Fetching eligible users... (testMode: ${testMode})`);
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select('id, email, delivery_time, timezone, workflow_mode, last_email_sent_at, is_paid, trial_started_at, trial_tasks_count')
      .is('deleted_at', null);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    console.log(`📊 Database query returned ${allUsers?.length || 0} users (before filtering)`);
    if (allUsers && allUsers.length > 0) {
      console.log(`📋 Sample user:`, {
        email: allUsers[0].email,
        delivery_time: allUsers[0].delivery_time,
        timezone: allUsers[0].timezone,
        workflow_mode: allUsers[0].workflow_mode
      });
    }

    // Filter users in JavaScript (MVP simplicity - Option B)
    // NOTE: Payment/trial check removed - app is "Free Until Traction" strategy
    // All users are eligible for emails regardless of payment status
    const eligibleUsers = (allUsers || []).filter((user: EmailUser) => {
      // Check deleted_at (already filtered in query, but double-check)
      // Check timezone matching (current hour in user's timezone matches delivery hour)
      // Skip timezone check in test mode
      if (!testMode && !shouldSendEmailNow(user)) {
        return false;
      }
      // Check if enough time has passed since last email (20 hours)
      // Skip cooldown check in test mode
      if (!testMode && !canSendEmailAgain(user.last_email_sent_at)) {
        return false;
      }
      return true;
    }) as EmailUser[];

    if (testMode) {
      console.log(`🧪 TEST MODE ACTIVE: Bypassing timezone/cooldown checks.`);
      console.log(`📈 Found ${eligibleUsers.length} eligible users out of ${allUsers?.length || 0} total users.`);
      if (eligibleUsers.length === 0 && (allUsers?.length || 0) > 0) {
        console.error(`⚠️ WARNING: Test mode is active but 0 users eligible. This shouldn't happen - all users should pass in test mode!`);
      }
    } else {
      console.log(`⏰ Normal mode: Found ${eligibleUsers.length} eligible users (timezone/delivery_time matched, 20h cooldown passed)`);
      if (allUsers && allUsers.length > 0) {
        const filteredOut = allUsers.length - eligibleUsers.length;
        if (filteredOut > 0) {
          console.log(`🔍 Filtered out ${filteredOut} users (likely timezone/delivery_time mismatch or cooldown period)`);
        }
      }
    }

    // Read template file once (before processing users for efficiency)
    let template: string;
    try {
      template = await Deno.readTextFile('./template.html');
    } catch (templateError) {
      console.error('Error reading template file:', templateError);
      return new Response(
        JSON.stringify(
          {
            error: 'Internal server error',
            details: 'Failed to read email template',
          },
          null,
          2
        ),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    const result: ProcessResult = {
      usersProcessed: 0,
      emailsSent: 0,
      errors: [],
    };

    // Process each user
    for (const user of eligibleUsers) {
      result.usersProcessed++;

      try {
        // Task 3: Query tasks based on workflow_mode
        // Only include open tasks that are not deleted, not completed, and not archived
        // Apply filters at database level for efficiency, then verify in JavaScript as safety net
        let tasksQuery = supabase
          .from('tasks')
          .select('id, text, created_at, status, completed_at, archived_at, deleted_at')
          .eq('user_id', user.id)
          .eq('status', 'open') // CRITICAL: Only open tasks (excludes 'completed' and 'archived')
          .is('deleted_at', null) // Exclude soft-deleted tasks
          .is('archived_at', null) // Explicitly exclude archived tasks
          .is('completed_at', null); // Explicitly exclude completed tasks

        // Apply workflow_mode filter
        // Fresh Start: Get ALL open tasks (not just new ones) - all tasks will be included before archiving
        // Carry Over: Already filtered to status = 'open' only (includes all open tasks)
        // Note: Fresh Start no longer filters by created_at > last_email_sent_at to ensure all tasks are included before archiving

        const { data: tasks, error: tasksError } = await tasksQuery.order('created_at', { ascending: true });

        if (tasksError) {
          console.error(`Error fetching tasks for user ${user.id}:`, tasksError);
          throw new Error(`Failed to fetch tasks: ${tasksError.message}`);
        }

        // Double-check filter in JavaScript as safety net (catches any edge cases or data inconsistencies)
        const userTasks = ((tasks || []) as any[]).filter((task: any) => {
          const isOpen = task.status === 'open';
          const notCompleted = !task.completed_at;
          const notArchived = !task.archived_at;
          const notDeleted = !task.deleted_at;
          
          const isValid = isOpen && notCompleted && notArchived && notDeleted;
          
          if (!isValid) {
            console.error(`⚠️ CRITICAL: Task "${task.text}" passed database filters but failed JS filter! status: ${task.status}, completed_at: ${task.completed_at}, archived_at: ${task.archived_at}, deleted_at: ${task.deleted_at}`);
          }
          
          return isValid;
        }) as Task[];

        // Log if any tasks were filtered out (should not happen if database filters work correctly)
        if (tasks && tasks.length > userTasks.length) {
          console.error(`🚨 User ${user.id}: Database query returned ${tasks.length} tasks, but JS filter removed ${tasks.length - userTasks.length} invalid tasks! This indicates a database query issue.`);
          console.error(`Invalid tasks:`, tasks.filter((t: any) => {
            return t.status !== 'open' || t.completed_at || t.archived_at || t.deleted_at;
          }).map((t: any) => ({
            text: t.text,
            status: t.status,
            completed_at: t.completed_at,
            archived_at: t.archived_at,
            deleted_at: t.deleted_at
          })));
        }

        // Task 4: Generate email HTML from template

        // Generate task list HTML
        let taskListHTML: string;
        if (userTasks.length === 0) {
          // Empty state: Send email even if no tasks (AC: 4)
          taskListHTML = '<li style="padding: 8px 0; border-bottom: 1px solid #eee;">No new tasks for today. Enjoy your morning coffee! ☕</li>';
        } else {
          taskListHTML = userTasks
            .map((task) => {
              const taskText = escapeHTML(task.text);
              
              // Carry Over mode: Add "(from yesterday)" indicator for old tasks
              let indicator = '';
              if (user.workflow_mode === 'carry_over' && user.last_email_sent_at) {
                const isOldTask = new Date(task.created_at) < new Date(user.last_email_sent_at);
                if (isOldTask) {
                  indicator = '<span style="color: #999; font-size: 12px;"> (from yesterday)</span>';
                }
              }
              
              return `<li style="padding: 8px 0; border-bottom: 1px solid #eee;">${taskText}${indicator}</li>`;
            })
            .join('');
        }

        // Replace {{tasks}} placeholder in template
        const emailHTML = template.replace('{{tasks}}', taskListHTML);

        // Generate subject line
        const taskCount = userTasks.length;
        const subject = `Your ${taskCount} Todo${taskCount !== 1 ? 's' : ''} for Today`;

        // Task 5: Send email via Resend API
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: resendFromEmail,
            to: [user.email],
            subject: subject,
            html: emailHTML,
          }),
        });

        const resendData = await resendResponse.json();

        if (!resendResponse.ok) {
          console.error(`Resend API error for user ${user.id}:`, resendData);
          throw new Error(`Resend API error: ${JSON.stringify(resendData.error || resendData.message || 'Unknown error')}`);
        }

        const messageId = resendData.id || null;
        console.log(`Email sent to ${user.email}, message ID: ${messageId}`);

        // Fresh Start mode: Archive all open tasks after email sent successfully
        if (user.workflow_mode === 'fresh_start') {
          const { error: archiveError } = await supabase
            .from('tasks')
            .update({
              archived_at: new Date().toISOString(),
              status: 'archived',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .eq('status', 'open'); // Only archive open tasks (don't touch completed tasks)

          if (archiveError) {
            console.error(`Error archiving tasks for user ${user.id}:`, archiveError);
            // Don't throw - log but continue (email already sent successfully)
          } else {
            console.log(`Archived all open tasks for Fresh Start user ${user.id}`);
          }
        }

        // Task 6: Update database after successful send
        const now = new Date().toISOString();

        // Update user: last_email_sent_at and reset consecutive_failures
        const { error: updateUserError } = await supabase
          .from('users')
          .update({
            last_email_sent_at: now,
            consecutive_failures: 0,
          })
          .eq('id', user.id);

        if (updateUserError) {
          console.error(`Error updating user ${user.id}:`, updateUserError);
          // Don't throw - log but continue (don't fail entire batch)
        }

        // Insert email log
        const { error: insertLogError } = await supabase
          .from('email_logs')
          .insert({
            user_id: user.id,
            recipient_email: user.email,
            subject: subject,
            resend_message_id: messageId,
            task_count: taskCount,
            status: messageId ? 'sent' : 'failed',
          });

        if (insertLogError) {
          console.error(`Error inserting email log for user ${user.id}:`, insertLogError);
          // Don't throw - log but continue (don't fail entire batch)
        }

        result.emailsSent++;
      } catch (error) {
        // Task 7: Error handling - track failures but continue processing
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error processing user ${user.id} (${user.email}):`, errorMessage);

        result.errors.push({
          userId: user.id,
          email: user.email,
          error: errorMessage,
        });

        // Update user failure tracking
        try {
          const { data: currentUserData, error: fetchError } = await supabase
            .from('users')
            .select('consecutive_failures')
            .eq('id', user.id)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 is "not found" - use default of 0
            console.error(`Error fetching user failure count for ${user.id}:`, fetchError);
          }

          const failureCount = (currentUserData?.consecutive_failures || 0) + 1;

          await supabase
            .from('users')
            .update({
              last_email_failed_at: new Date().toISOString(),
              consecutive_failures: failureCount,
            })
            .eq('id', user.id);
        } catch (failureUpdateError) {
          console.error(`Error updating failure count for user ${user.id}:`, failureUpdateError);
        }

        // Continue processing remaining users
      }
    }

    // Return summary
    return new Response(
      JSON.stringify(
        {
          success: true,
          usersProcessed: result.usersProcessed,
          emailsSent: result.emailsSent,
          errors: result.errors,
        },
        null,
        2
      ),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify(
        {
          error: 'Internal server error',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        null,
        2
      ),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

