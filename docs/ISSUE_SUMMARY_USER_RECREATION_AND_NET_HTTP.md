# Issue Summary: User Recreation & Loops Email Trigger Problems

## Executive Summary

We're experiencing two related issues:
1. **User recreation conflict** - Users can't recreate accounts with the same email after deletion
2. **Loops welcome email trigger failing** - Database trigger can't call Edge Function due to incorrect `net.http_post` function signature

**Status:** User recreation is FIXED. Loops trigger is BLOCKED due to function signature mismatch.

---

## Problem 1: User Recreation Issue ✅ FIXED

### What Happened
- User created test account → deleted it → tried to recreate with same email → FAILED
- Error: Unique constraint violation on email
- Old tasks from deleted user were still visible

### Root Cause
- Users table has `UNIQUE` constraint on `email` column
- When user is soft-deleted (`deleted_at` is set), the record remains with the email
- Recreating with same email violates unique constraint
- RLS policy hides soft-deleted users, causing "User not found" errors

### Solution Implemented ✅
**Migration 013:** `supabase/migrations/013_fix_user_recreation_and_net_extension.sql`
- Replaced full unique constraint with **partial unique index** (only enforces uniqueness for non-deleted users)
- Added trigger to automatically hard-delete soft-deleted users with same email before insert
- Updated delete-user-account Edge Function to handle already-soft-deleted users

**Status:** ✅ Migration 013 ran successfully. User recreation should now work.

---

## Problem 2: Loops Welcome Email Trigger ❌ BLOCKED

### What We're Trying To Do
- Send welcome email via Loops when new user signs up
- Use database trigger (`AFTER INSERT ON users`) to call Edge Function
- Edge Function (`trigger-loops-welcome`) sends email via Loops API

### Current Error
```
ERROR: function net.http_post(url => unknown, headers => jsonb, body => text) does not exist
```

### Root Cause Discovered 🔍

**The actual `net.http_post` function signature is:**
```sql
net.http_post(
  url text, 
  body jsonb DEFAULT '{}'::jsonb, 
  params jsonb DEFAULT '{}'::jsonb
)
```

**What we're trying to call:**
```sql
net.http_post(
  url := '...',
  headers := jsonb_build_object(...),  -- ❌ This parameter doesn't exist!
  body := '...'::text                   -- ❌ Should be jsonb, not text
)
```

**Key Findings:**
1. ✅ `pg_net` extension IS installed and enabled (version 0.19.5)
2. ✅ `net.http_post` function EXISTS
3. ❌ Function does NOT have `headers` parameter
4. ❌ Function expects `body` as `jsonb`, not `text`
5. ❓ Headers might need to be passed via `params` parameter (needs verification)

### What We've Tried
- ✅ Enabled `pg_net` extension
- ✅ Granted permissions on `net` schema
- ✅ Added `SECURITY DEFINER` to trigger function
- ✅ Set `search_path` to include `net` schema
- ✅ Temporarily disabled trigger (user creation works now)
- ❌ Still can't call `net.http_post` with correct signature

### Files Involved
- `supabase/migrations/010_add_loops_welcome_trigger.sql` - Trigger definition (needs fix)
- `supabase/migrations/004_cron_job_send_daily_emails.sql` - Cron job (uses same function, check if working)
- `supabase/migrations/011_add_loops_scheduled_emails_cron.sql` - Another cron job (check if working)

---

## Critical Questions to Answer

### 1. Are Cron Jobs Working?
**Check:** Supabase Dashboard → Database → Cron Jobs
- Is `send-daily-emails-hourly` running successfully?
- Is `send-loops-scheduled-emails-daily` running successfully?

**If YES:** Then `net.http_post` works in cron context, and we need to figure out why it doesn't work in trigger context.

**If NO:** Then `net.http_post` isn't working at all, and we need to fix the cron jobs too.

### 2. How Are Headers Passed?
The function signature shows `params jsonb` - headers might be passed there:
```sql
net.http_post(
  url := '...',
  body := '...'::jsonb,
  params := jsonb_build_object('headers', jsonb_build_object(...))
)
```

**OR** headers might be embedded in the `body` JSON.

**Need to verify:** Check Supabase `pg_net` documentation or test with actual function call.

### 3. What About Migration 004?
Migration 004 uses:
```sql
SELECT net.http_post(
  url := '...',
  headers := '...'::jsonb,  -- This shouldn't work if function doesn't have headers!
  body := '{}'::jsonb
)
```

**If migration 004 ran successfully**, then either:
- The function signature changed between when migration 004 was written and now
- OR there's a different version/overload of the function
- OR the cron job context allows different syntax

---

## Next Steps for Developer

### Step 1: Verify Function Signature
Run this query to see exact function signature:
```sql
SELECT 
    proname,
    pg_get_function_arguments(oid) as arguments,
    pg_get_function_result(oid) as return_type
FROM pg_proc
WHERE proname = 'http_post' 
  AND pronamespace::regnamespace::text = 'net';
```

### Step 2: Test Correct Function Call
Try calling the function with the correct signature:
```sql
-- Test 1: With params for headers
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  body := '{"test": "data"}'::jsonb,
  params := jsonb_build_object(
    'headers', jsonb_build_object('Content-Type', 'application/json')
  )
) AS request_id;

-- Test 2: Check if headers go in body
SELECT net.http_post(
  url := 'https://httpbin.org/post',
  body := jsonb_build_object(
    'Content-Type', 'application/json',
    'data', jsonb_build_object('test', 'data')
  )
) AS request_id;
```

### Step 3: Check Cron Jobs
- Verify if migrations 004 and 011 are actually working
- Check cron job logs for errors
- If they're failing, fix them first

### Step 4: Fix Migration 010
Once we know the correct function signature:
1. Update `trigger_loops_welcome()` function to use correct parameters
2. Test trigger creation
3. Test actual user creation to verify trigger fires

### Step 5: Alternative Approach (If pg_net Doesn't Support Headers)
If `net.http_post` truly doesn't support headers:
- Use Edge Function's built-in authentication (service role key)
- Pass auth via URL parameter or body
- OR use a different approach (webhook, queue, etc.)

---

## Files That Need Attention

### ✅ Fixed (Don't Touch)
- `supabase/migrations/013_fix_user_recreation_and_net_extension.sql` - User recreation fix

### ❌ Needs Fix
- `supabase/migrations/010_add_loops_welcome_trigger.sql` - Wrong function signature
- `supabase/migrations/004_cron_job_send_daily_emails.sql` - Verify if working, might have same issue
- `supabase/migrations/011_add_loops_scheduled_emails_cron.sql` - Verify if working, might have same issue

### 📋 Diagnostic Files (For Reference)
- `supabase/find_http_function.sql` - Shows actual function signatures
- `supabase/test_http_variations.sql` - Test different function calls
- `supabase/temporarily_disable_loops_trigger.sql` - Already run, trigger disabled

---

## Is This Because of Loops Integration?

**Short answer: Partially, but the root issue is broader.**

### Loops-Specific Part:
- We're trying to send welcome emails via Loops API
- This requires calling an Edge Function from a database trigger
- Edge Function needs authentication headers

### Broader Issue:
- The `net.http_post` function signature doesn't match what we expected
- This affects ALL uses of `net.http_post` (not just Loops)
- Cron jobs might have the same issue (need to verify)

### Could We Avoid This?
**Yes, alternatives:**
1. **Don't use database trigger** - Call Edge Function from app code after user creation
2. **Use different email service** - One that doesn't require Edge Function call
3. **Use webhook approach** - Supabase Auth webhook instead of database trigger
4. **Fix function signature** - Use correct `net.http_post` parameters

---

## Recommended Approach

### Option A: Fix Function Signature (Recommended)
1. Verify correct `net.http_post` signature
2. Update all migrations (004, 010, 011) to use correct signature
3. Test cron jobs and trigger
4. Re-enable trigger

### Option B: Use App-Level Trigger (Simpler)
1. Remove database trigger
2. Call Edge Function from app code after user creation
3. Simpler, more control, easier to debug

### Option C: Use Supabase Auth Webhook (Most Reliable)
1. Configure webhook in Supabase Dashboard
2. Webhook calls Edge Function on user signup
3. No database trigger needed
4. More reliable, Supabase-managed

---

## Summary for Developer Friend

**What we're trying to do:**
Send welcome email via Loops when user signs up, using database trigger to call Edge Function.

**What's broken:**
Database trigger can't call `net.http_post` because function signature doesn't match what we're using. Function exists but doesn't have `headers` parameter.

**What's fixed:**
User recreation issue is resolved. User creation works (trigger is disabled).

**What needs to be done:**
1. Verify correct `net.http_post` function signature
2. Fix migration 010 (and possibly 004, 011) to use correct signature
3. Test and re-enable trigger
4. OR switch to app-level trigger or webhook approach

**Key files:**
- `supabase/migrations/010_add_loops_welcome_trigger.sql` - Needs function signature fix
- `supabase/find_http_function.sql` - Shows actual function signatures (already run)

**Critical question:**
Are cron jobs (migrations 004, 011) actually working? If yes, how are they calling `net.http_post`?

