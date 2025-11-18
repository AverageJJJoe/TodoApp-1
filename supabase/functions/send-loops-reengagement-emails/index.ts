// Supabase Edge Function: send-loops-reengagement-emails
// Automated cron job that sends re-engagement emails to inactive users
// Runs daily via pg_cron at 9 AM UTC

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

interface ReengagementUser {
  id: string;
  email: string;
  auth_id: string;
  created_at: string;
  last_day3_email_sent_at: string | null;
  last_day5_email_sent_at: string | null;
}

interface ProcessResult {
  usersProcessed: number;
  day3EmailsSent: number;
  day5EmailsSent: number;
  errors: Array<{ userId: string; email: string; error: string }>;
}

Deno.serve(async (req: Request) => {
  console.log(`📥 [${new Date().toISOString()}] Re-engagement email processing started`);

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

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const loopsApiKey = Deno.env.get('LOOPS_API_KEY');

    // Validate required environment variables
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing Supabase credentials' }, null, 2),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    if (!loopsApiKey) {
      console.warn('⚠️ Loops API key not configured. Re-engagement emails disabled.');
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Loops API key not configured. Skipping re-engagement emails.',
          usersProcessed: 0,
          day3EmailsSent: 0,
          day5EmailsSent: 0,
          errors: [],
        }, null, 2),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const result: ProcessResult = {
      usersProcessed: 0,
      day3EmailsSent: 0,
      day5EmailsSent: 0,
      errors: [],
    };

    // Day 3: Users who signed up 3 days ago with no tasks created
    // Use time range instead of exact date match (24-hour window: 2.5-3.5 days ago)
    // This accounts for cron job timing variance and catches users regardless of signup time
    console.log('🔍 Querying Day 3 eligible users...');
    // Use reliable date calculation to avoid month rollover issues
    const now = new Date();
    const threeDaysAgoStart = new Date(now.getTime() - (3 * 24 + 12) * 60 * 60 * 1000); // 3.5 days ago
    const twoDaysAgoEnd = new Date(now.getTime() - (2 * 24 + 12) * 60 * 60 * 1000);     // 2.5 days ago

    const { data: day3Users, error: day3Error } = await supabase
      .from('users')
      .select('id, email, auth_id, created_at, last_day3_email_sent_at')
      .is('deleted_at', null)
      .gte('created_at', threeDaysAgoStart.toISOString())  // >= 3 days 12 hours ago
      .lte('created_at', twoDaysAgoEnd.toISOString())      // <= 2 days 12 hours ago
      .is('last_day3_email_sent_at', null);

    if (day3Error) {
      console.error('❌ Error fetching Day 3 users:', day3Error);
      result.errors.push({
        userId: 'query',
        email: 'N/A',
        error: `Day 3 query error: ${day3Error.message}`,
      });
    } else {
      console.log(`📊 Found ${day3Users?.length || 0} users eligible for Day 3 email`);

      // Check each user for tasks
      for (const user of day3Users || []) {
        result.usersProcessed++;

        try {
          // Check if user has any tasks
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('id')
            .eq('user_id', user.id)
            .limit(1);

          if (tasksError) {
            throw new Error(`Failed to check tasks: ${tasksError.message}`);
          }

          // Only send if user has no tasks
          if (tasks && tasks.length === 0) {
            // Send Day 3 email via Loops API
            const loopsResponse = await fetch('https://app.loops.so/api/v1/transactional', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${loopsApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transactionalId: 'cmhvyaekx3ttwwq0i7b9ewfq7',
                email: user.email,
              }),
            });

            if (!loopsResponse.ok) {
              const errorText = await loopsResponse.text().catch(() => 'Unknown error');
              throw new Error(`Loops API error: ${loopsResponse.status} - ${errorText}`);
            }

            // Update user record to track email sent
            const now = new Date().toISOString();
            const { error: updateError } = await supabase
              .from('users')
              .update({ last_day3_email_sent_at: now })
              .eq('id', user.id);

            if (updateError) {
              console.error(`Error updating Day 3 email timestamp for user ${user.id}:`, updateError);
              // Don't throw - email was sent successfully
            }

            console.log(`✅ Day 3 email sent to ${user.email}`);
            result.day3EmailsSent++;
          } else {
            console.log(`⏭️ Skipping user ${user.email} - has tasks created`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error processing Day 3 user ${user.id} (${user.email}):`, errorMessage);
          result.errors.push({
            userId: user.id,
            email: user.email,
            error: `Day 3: ${errorMessage}`,
          });
        }
      }
    }

    // Day 5: Users who haven't created a task in 5 days
    console.log('🔍 Querying Day 5 eligible users...');
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Query all users who haven't received Day 5 email
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, auth_id, created_at, last_day5_email_sent_at')
      .is('deleted_at', null)
      .is('last_day5_email_sent_at', null);

    if (allUsersError) {
      console.error('❌ Error fetching users for Day 5 check:', allUsersError);
      result.errors.push({
        userId: 'query',
        email: 'N/A',
        error: `Day 5 query error: ${allUsersError.message}`,
      });
    } else {
      console.log(`📊 Checking ${allUsers?.length || 0} users for Day 5 eligibility`);

      // Check each user's last task creation date
      for (const user of allUsers || []) {
        try {
          // Get user's most recent task creation date
          const { data: lastTask, error: taskQueryError } = await supabase
            .from('tasks')
            .select('created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (taskQueryError) {
            throw new Error(`Failed to query tasks: ${taskQueryError.message}`);
          }

          // Determine if user is eligible for Day 5 email
          let isEligible = false;

          if (!lastTask || lastTask.length === 0) {
            // User has no tasks - check if they signed up 5+ days ago
            const userCreatedAt = new Date(user.created_at);
            if (userCreatedAt < fiveDaysAgo) {
              isEligible = true;
            }
          } else {
            // User has tasks - check if last task was created 5+ days ago
            const lastTaskCreatedAt = new Date(lastTask[0].created_at);
            if (lastTaskCreatedAt < fiveDaysAgo) {
              isEligible = true;
            }
          }

          if (isEligible) {
            result.usersProcessed++;

            // Send Day 5 email via Loops API
            const loopsResponse = await fetch('https://app.loops.so/api/v1/transactional', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${loopsApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transactionalId: 'cmhw3sebk0bqf760ipe4mvthm',
                email: user.email,
              }),
            });

            if (!loopsResponse.ok) {
              const errorText = await loopsResponse.text().catch(() => 'Unknown error');
              throw new Error(`Loops API error: ${loopsResponse.status} - ${errorText}`);
            }

            // Update user record to track email sent
            const now = new Date().toISOString();
            const { error: updateError } = await supabase
              .from('users')
              .update({ last_day5_email_sent_at: now })
              .eq('id', user.id);

            if (updateError) {
              console.error(`Error updating Day 5 email timestamp for user ${user.id}:`, updateError);
              // Don't throw - email was sent successfully
            }

            console.log(`✅ Day 5 email sent to ${user.email}`);
            result.day5EmailsSent++;
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.error(`Error processing Day 5 user ${user.id} (${user.email}):`, errorMessage);
          result.errors.push({
            userId: user.id,
            email: user.email,
            error: `Day 5: ${errorMessage}`,
          });
        }
      }
    }

    // Return summary
    const summary = {
      success: true,
      usersProcessed: result.usersProcessed,
      day3EmailsSent: result.day3EmailsSent,
      day5EmailsSent: result.day5EmailsSent,
      errors: result.errors,
    };

    console.log(`✅ Re-engagement email processing complete:`, summary);
    console.log(`📊 Summary: Processed ${result.usersProcessed} users, sent ${result.day3EmailsSent} Day 3 emails, ${result.day5EmailsSent} Day 5 emails, ${result.errors.length} errors`);

    return new Response(
      JSON.stringify(summary, null, 2),
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
    console.error('❌ Unexpected error in Edge Function:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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

