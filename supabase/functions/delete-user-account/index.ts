// Supabase Edge Function: delete-user-account
// Deletes user account: soft deletes user record and hard deletes auth user
// Requires authenticated user via Authorization header

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

Deno.serve(async (req: Request) => {
  // Log incoming request for debugging (without sensitive data)
  console.log(`[${new Date().toISOString()}] Account deletion request:`, {
    method: req.method,
    url: req.url,
    hasAuthHeader: !!req.headers.get('Authorization'),
  });

  // Handle CORS preflight requests
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
    console.error(`Invalid method: ${req.method}. Expected POST.`);
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }),
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
    // Get authenticated user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Server configuration error' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Extract and verify JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Invalid token:', authError?.message || 'User not found');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    console.log(`Processing account deletion for user: ${user.id}`);

    // Find user record in users table (including soft-deleted users)
    // Using service role key bypasses RLS, so we can find soft-deleted users
    const { data: userRecord, error: userError } = await supabase
      .from('users')
      .select('id, auth_id, deleted_at')
      .eq('auth_id', user.id)
      .maybeSingle();

    if (userError) {
      console.error('Error querying user record:', userError.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to query user record' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    if (!userRecord) {
      console.error('User record not found');
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // If user is already soft-deleted, just hard delete the auth user and user record
    if (userRecord.deleted_at) {
      console.log(`User record already soft-deleted, hard deleting user record and auth user: ${userRecord.id}`);
      
      // Hard delete user record (cascades to tasks)
      const { error: hardDeleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userRecord.id);

      if (hardDeleteError) {
        console.error('Failed to hard delete user record:', hardDeleteError.message);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to delete user record' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      // Hard delete auth user
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);
      if (authDeleteError) {
        console.error('Failed to delete auth user:', authDeleteError.message);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to delete auth user' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        );
      }

      console.log(`✅ Successfully deleted already-soft-deleted account for user: ${user.id}`);
      return new Response(
        JSON.stringify({ success: true, message: 'Account deleted successfully' }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Soft delete user record
    console.log(`Soft deleting user record: ${userRecord.id}`);
    const { error: softDeleteError } = await supabase
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', userRecord.id);

    if (softDeleteError) {
      console.error('Failed to soft delete user record:', softDeleteError.message);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to delete user record' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    // Hard delete auth user (triggers CASCADE on related tables)
    console.log(`Hard deleting auth user: ${user.id}`);
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(user.id);

    if (authDeleteError) {
      console.error('Failed to delete auth user, rolling back soft delete:', authDeleteError.message);
      // Rollback soft delete if auth deletion fails
      await supabase
        .from('users')
        .update({ deleted_at: null })
        .eq('id', userRecord.id);

      return new Response(
        JSON.stringify({ success: false, error: 'Failed to delete auth user' }),
        { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
      );
    }

    console.log(`✅ Successfully deleted account for user: ${user.id}`);
    return new Response(
      JSON.stringify({ success: true, message: 'Account deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('Unexpected error during account deletion:', error);
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
    );
  }
});

