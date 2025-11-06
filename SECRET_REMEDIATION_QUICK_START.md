# Secret Remediation - Quick Start Guide

## 🚨 IMMEDIATE ACTIONS (Do These First)

### Step 1: Rotate Your Secrets (30 minutes)

1. **Rotate Supabase ANON_KEY:**
   - Go to: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API
   - Click "Reset" next to anon/public key
   - Copy the NEW key (you'll need it for Step 2)

2. **Rotate Resend API Key (if exposed):**
   - Go to: [Resend Dashboard](https://resend.com/api-keys)
   - Revoke the old key, create a new one
   - Update in Supabase: Dashboard → Edge Functions → Secrets → Update `RESEND_API_KEY`

### Step 2: Set Up Environment Variables (15 minutes)

1. **Create `.env.example` file** (if not exists - template provided in plan):
   ```bash
   # Expo Environment Variables
   # Copy this file to .env and fill in your actual values
   EXPO_PUBLIC_SUPABASE_URL=https://zrnjxrtgrommlhexbpde.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Create `.env` file** (copy from `.env.example` and fill in values):
   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://zrnjxrtgrommlhexbpde.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<paste-your-new-anon-key-here>
   ```

3. **Verify `.env` is in `.gitignore`** (should already be there)
4. **Note:** Expo SDK 54 supports `.env` files natively - no `dotenv` package needed

### Step 3: Test the New Configuration (10 minutes)

1. **Start Expo with new config:**
   ```bash
   npm start
   # or
   expo start
   ```

2. **Verify app connects to Supabase:**
   - Check console for connection errors
   - Test login/signup functionality

### Step 4: Commit Changes (5 minutes)

```bash
# Add the new files
git add app.config.js
git add supabase/fix_cron_job.sql
git add supabase/test_edge_function.sql
git add supabase/migrations/004_cron_job_send_daily_emails.sql
git add docs/SECRET_REMEDIATION_PLAN.md

# Commit
git commit -m "security: Remove hardcoded secrets, use environment variables"

# DO NOT commit .env file!
```

---

## 📋 What Was Changed

### Files Updated:
1. ✅ **`app.json`** → **`app.config.js`** (now uses environment variables)
2. ✅ **`app.json`** - Secret removed (no longer contains `supabaseAnonKey`)
3. ✅ **`supabase/fix_cron_job.sql`** (secrets replaced with placeholders)
4. ✅ **`supabase/test_edge_function.sql`** (secrets replaced with placeholders)
5. ✅ **`supabase/migrations/004_cron_job_send_daily_emails.sql`** (secrets replaced with placeholders)
6. ✅ **`docs/SECRET_REMEDIATION_PLAN.md`** - Updated per PO review

### Files Created:
1. ✅ **`app.config.js`** (new Expo config using env vars)
2. ✅ **`docs/SECRET_REMEDIATION_PLAN.md`** (full remediation plan)

---

## ⚠️ IMPORTANT NOTES

1. **`.env` file:** 
   - Create it locally (not committed to git)
   - Contains your actual secrets
   - Use `.env.example` as a template (create it if needed)

2. **`app.json` vs `app.config.js`:**
   - Expo will use `app.config.js` if it exists (takes precedence)
   - You can delete `app.json` or keep it as backup
   - `app.config.js` allows dynamic values from environment variables

3. **SQL Files:**
   - All SQL files now use placeholders: `<SUPABASE_ANON_KEY>` and `<PROJECT_REF>`
   - Replace these before running SQL scripts
   - Never commit SQL files with actual secrets

---

## 🔄 Next Steps (This Week)

After completing the immediate actions above:

1. **Clean Git History** (see `docs/SECRET_REMEDIATION_PLAN.md` Phase 3)
   - Use BFG Repo-Cleaner or git-filter-repo
   - This removes secrets from git history
   - ⚠️ Requires force push - coordinate with team

2. **Set Up Pre-commit Hooks** (see `docs/SECRET_REMEDIATION_PLAN.md` Phase 4)
   - Install git-secrets or detect-secrets
   - Prevents future secret commits

3. **Verify with GitGuardian**
   - Check dashboard after git history cleanup
   - Should show 0 incidents

---

## 🆘 Troubleshooting

### App won't start / Can't find environment variables
- Make sure `.env` file exists in project root
- Check that variables start with `EXPO_PUBLIC_` prefix
- Restart Expo dev server after creating `.env`

### SQL scripts fail
- Make sure you replaced `<SUPABASE_ANON_KEY>` and `<PROJECT_REF>` placeholders
- Get ANON_KEY from Supabase Dashboard → Settings → API

### Build fails
- Check `app.config.js` syntax
- Verify environment variables are set
- Check Expo documentation for your Expo SDK version

---

## 📚 Full Documentation

See **`docs/SECRET_REMEDIATION_PLAN.md`** for:
- Complete remediation plan
- Git history cleanup instructions
- Prevention strategies
- Detailed timeline

---

**Status:** ✅ Phase 1 & 2 Complete - Secrets removed from current codebase  
**Next:** Phase 3 - Git history cleanup (this week)

