# CRITICAL SECRET EXPOSURE FIX - Version 1.0.8
**Date:** 2025-01-27  
**Status:** 🔴 CRITICAL - IMMEDIATE ACTION REQUIRED  
**Priority:** P0 - Blocking Production Release

---

## 🚨 SECRET EXPOSURE DETECTED

**GitGuardian Alert:** Generic High Entropy Secret detected in commit `012fb62`

**Exposed Secrets:**
1. **Sentry Auth Token** in `android/sentry.properties` - **CRITICAL** ⚠️
2. **Sentry DSN** in `docs/stories/8.1.sentry-setup-crash-reporting.story.md` - **MEDIUM** ⚠️

---

## 🔍 What Was Exposed

### Secret 1: Sentry Auth Token (CRITICAL)
**File:** `android/sentry.properties`  
**Line:** 2  
**Value:** `***REMOVED***`

**Risk Level:** 🔴 **CRITICAL**
- This token allows uploading source maps and managing Sentry project
- Can be used to access Sentry project settings
- Should NEVER be committed to git

### Secret 2: Sentry DSN (MEDIUM)
**File:** `docs/stories/8.1.sentry-setup-crash-reporting.story.md`  
**Line:** 339  
**Value:** `https://***REMOVED***@o4510346706026496.ingest.us.sentry.io/4510346715594752`

**Risk Level:** 🟡 **MEDIUM**
- DSN is technically public (used in client-side code)
- However, best practice is to not commit it
- Should use environment variables instead

---

## ✅ IMMEDIATE FIXES APPLIED

### Fix 1: Removed Sentry Auth Token from `android/sentry.properties`
**Changed:** Hardcoded token → Environment variable reference  
**New Format:** `auth.token=${SENTRY_AUTH_TOKEN}`  
**Status:** ✅ Fixed

### Fix 2: Removed Sentry DSN from Documentation
**Changed:** Hardcoded DSN → Instructions to get from Sentry Dashboard  
**New Format:** "DSN should be obtained from Sentry Dashboard → Project Settings → Client Keys (DSN)"  
**Status:** ✅ Fixed

### Fix 3: Added `android/sentry.properties` to `.gitignore`
**Action:** Added `android/sentry.properties` to `.gitignore` to prevent future commits  
**Status:** ✅ Fixed

---

## 🔄 REQUIRED REMEDIATION STEPS

### Step 1: Rotate Sentry Auth Token (CRITICAL - Do First)
**Priority:** P0 - Critical  
**Time:** 15 minutes

1. **Go to Sentry Dashboard:**
   - Navigate to: https://sentry.io/settings/todotomorrow/auth-tokens/
   - Or: Settings → Auth Tokens

2. **Revoke Exposed Token:**
   - Find token starting with `sntrys_eyJpYXQiOjE3NjI4Njk2NTYuNjk1NjI3...`
   - Click "Revoke" or "Delete"
   - Confirm deletion

3. **Create New Token:**
   - Click "Create New Token"
   - Name: "EAS Build - Source Maps"
   - Scopes: Select "project:releases" (minimum required)
   - Click "Create Token"
   - **Copy the new token immediately** (you won't see it again)

4. **Set EAS Secret:**
   ```bash
   eas secret:create --name SENTRY_AUTH_TOKEN --value [NEW_TOKEN_HERE] --scope project --type string
   ```

5. **Verify Secret:**
   ```bash
   eas secret:list
   ```
   Should show `SENTRY_AUTH_TOKEN` in the list

**Verification:**
- [x] Old token revoked in Sentry Dashboard ✅
- [x] New token created ✅
- [x] EAS secret set and verified ✅ (Created: Nov 11 15:07:37)
- [x] Build successful ✅ (App rebuilt and launched)
- [x] Sentry release 1.0.8 appears in dashboard ✅
- [x] App loads and works correctly ✅
- [x] Source maps uploaded successfully ✅ (Release visible in Sentry)

---

### Step 2: Rotate Sentry DSN (Optional but Recommended)
**Priority:** P1 - High  
**Time:** 10 minutes

**Note:** DSN is technically public, but rotating it is good practice after exposure.

1. **Go to Sentry Dashboard:**
   - Navigate to: https://sentry.io/settings/todotomorrow/projects/react-native/keys/
   - Or: Project Settings → Client Keys (DSN)

2. **Regenerate DSN:**
   - Click "Regenerate" or "Reset" next to the DSN
   - Confirm regeneration
   - **Copy the new DSN**

3. **Update EAS Secret:**
   ```bash
   eas secret:create --name EXPO_PUBLIC_SENTRY_DSN --value [NEW_DSN_HERE] --scope project --type string
   ```
   (Or update existing secret if it already exists)

4. **Verify Secret:**
   ```bash
   eas secret:list
   ```

**Verification:**
- [ ] DSN regenerated in Sentry Dashboard
- [ ] EAS secret updated
- [ ] App still connects to Sentry (test in next build)

---

### Step 3: Clean Git History (Required)
**Priority:** P0 - Critical  
**Time:** 30 minutes  
**Risk:** Requires force push - coordinate with team

**Why:** Even though we removed secrets from current files, they still exist in git history. GitGuardian will continue to flag them until history is cleaned.

**Option A: Use BFG Repo-Cleaner (Recommended)**
```bash
# Download BFG (if not already downloaded)
# Already have bfg.jar in project root

# Create a replacements file
echo "***REMOVED***==>***REMOVED***" > secrets.txt
echo "***REMOVED***==>***REMOVED***" >> secrets.txt

# Run BFG
java -jar bfg.jar --replace-text secrets.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history!)
git push --force
```

**Option B: Use git-filter-repo**
```bash
pip install git-filter-repo

# Remove secrets from history
git filter-repo --replace-text secrets.txt --force
```

**⚠️ WARNING:**
- Force push rewrites git history
- All team members must re-clone repository after force push
- Coordinate with team before executing

**Verification:**
- [ ] Git history cleaned
- [ ] GitGuardian no longer flags these secrets
- [ ] Team notified and repository re-cloned

---

### Step 4: Prevent Future Exposure
**Priority:** P1 - High  
**Time:** 30 minutes

1. **Verify `.gitignore` includes:**
   ```
   android/sentry.properties
   *.env
   *.env.local
   .env
   ```

2. **Set up Pre-commit Hook (Recommended):**
   ```bash
   # Install git-secrets (if not already installed)
   npm install --save-dev git-secrets
   
   # Initialize git-secrets
   npx git-secrets --install
   
   # Add patterns to detect secrets
   npx git-secrets --register-aws
   npx git-secrets --add --allowed 'sntrys_.*'  # Allow pattern but not actual tokens
   ```

3. **Add to CI/CD Pipeline:**
   - Add GitGuardian scan to CI/CD pipeline
   - Block commits that contain secrets
   - Run `git-secrets --scan` before allowing merge

**Verification:**
- [ ] `.gitignore` updated
- [ ] Pre-commit hook installed (optional)
- [ ] CI/CD pipeline includes secret scanning

---

## 📋 CHECKLIST

### Immediate Actions (Do Now)
- [x] Remove hardcoded Sentry auth token from `android/sentry.properties`
- [x] Remove hardcoded Sentry DSN from documentation
- [x] Add `android/sentry.properties` to `.gitignore`
- [x] **Rotate Sentry Auth Token** ✅ (Completed: Nov 11 15:07:37)
- [x] **Set EAS secret for SENTRY_AUTH_TOKEN** ✅ (Secret ID: 60c9394f-3add-4e85-b331-fdf76925a761)
- [x] **Fix build configuration** ✅ (Auto-generate sentry.properties from env var)
- [x] **Test build** ✅ (App rebuilt and launched successfully)
- [x] **Verify Sentry source maps uploaded** ✅ (Release 1.0.8 visible in Sentry dashboard)
- [ ] **Rotate Sentry DSN** (Optional - Recommended)
- [ ] **Update EAS secret for EXPO_PUBLIC_SENTRY_DSN** (If rotating DSN)

### This Week
- [ ] Clean git history (BFG or git-filter-repo)
- [ ] Verify GitGuardian no longer flags secrets
- [ ] Set up pre-commit hooks
- [ ] Update CI/CD pipeline with secret scanning

---

## 🎯 CURRENT STATUS

**Version:** 1.0.8 (versionCode 11)  
**Secrets Removed:** ✅ Yes  
**Secrets Rotated:** ✅ Yes (Sentry Auth Token rotated and set as EAS secret)  
**Build Status:** ✅ Successful (App rebuilt and launched)  
**Git History Cleaned:** ⏳ Pending (should be done before next release)  
**Ready for Production:** ✅ Yes (after git history cleanup)

**Next Steps:**
1. ✅ ~~Test build~~ - COMPLETE (App rebuilt and launched)
2. ✅ ~~Verify Sentry source maps uploaded~~ - COMPLETE (Release 1.0.8 visible in Sentry dashboard)
3. **Clean git history** (see Step 3 in remediation plan) - **DO BEFORE NEXT RELEASE** ⚠️
4. Optional: Rotate PostHog API key (see `POSTHOG_SECRET_FIX_1.0.8.md`)
5. Set up prevention measures (pre-commit hooks, CI/CD scanning)

**Note:** Test Crash buttons are intentionally hidden in production builds (wrapped in `__DEV__` check). This is correct behavior - test buttons should only appear in development mode.

---

## 📚 RELATED DOCUMENTATION

- `docs/SECRET_REMEDIATION_PLAN.md` - Full remediation plan (previous incidents)
- `docs/SECRET_REMEDIATION_QUICK_START.md` - Quick start guide
- `docs/SET_EAS_SECRETS.md` - EAS secrets setup guide

---

## 💡 LESSONS LEARNED

1. **Never commit `sentry.properties`** - Always use environment variables
2. **Never commit actual DSNs** - Use placeholders in documentation
3. **Use `.gitignore`** - Add all config files that contain secrets
4. **Set up pre-commit hooks** - Prevent secrets from being committed
5. **Rotate immediately** - Don't wait, rotate exposed secrets right away

---

**Last Updated:** 2025-01-27  
**Fixed By:** Sarah (PO Agent)  
**Next Action:** Rotate Sentry Auth Token immediately

