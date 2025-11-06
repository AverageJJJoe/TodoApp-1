# Secret Exposure Remediation Plan
**Date:** November 6, 2025  
**Status:** 🔴 CRITICAL - Action Required  
**Priority:** P0 - Blocking Google Play Console Publication

## Executive Summary

GitGuardian has detected **10 secret incidents** in the repository, with **3 high-severity** exposures:
1. **Bearer Token** (Supabase ANON_KEY) in `supabase/fix_cron_job.sql`
2. **JSON Web Token** (Supabase ANON_KEY) in `app.json`
3. **Resend API Key** in another repository (noted for reference)

All incidents are marked as **"Publicly exposed"** and **"From historical scan"**, meaning they exist in git history even if removed from current files.

---

## How This Happened

### Root Cause Analysis

1. **Hardcoded Secrets in SQL Files:**
   - `supabase/fix_cron_job.sql` - Contains ANON_KEY for cron job authentication
   - `supabase/test_edge_function.sql` - Contains ANON_KEY for testing
   - `supabase/migrations/004_cron_job_send_daily_emails.sql` - Contains ANON_KEY in migration

2. **Hardcoded Secrets in App Config:**
   - `app.json` - Contains `supabaseAnonKey` in `expo.extra` field
   - This is required for Expo builds, but should use environment variables

3. **Git History Exposure:**
   - Files were committed to git with secrets
   - GitGuardian scanned historical commits and found all occurrences
   - Even if removed now, secrets remain in git history

### Why It Happened

- **Development Speed vs. Security:** Secrets were hardcoded for quick testing/debugging
- **Expo Configuration Pattern:** Using `app.json` instead of `app.config.js` (which supports env vars)
- **SQL Migration Pattern:** Direct values instead of placeholders or environment substitution
- **Lack of Pre-commit Hooks:** No git-secrets or similar tooling to prevent commits

---

## Impact Assessment

### Current Risk Level: 🔴 HIGH

1. **Exposed Secrets:**
   - Supabase ANON_KEY: **Publicly exposed** (though designed for client-side use, still best practice to rotate)
   - Resend API Key: **High severity** (if exposed, could allow email abuse)
   - All secrets exist in **git history** (3+ occurrences per GitGuardian)

2. **Business Impact:**
   - ⚠️ **Google Play Console Publication:** May be blocked or flagged
   - ⚠️ **Security Audit Risk:** Could fail security reviews
   - ⚠️ **Compliance Issues:** May violate data protection requirements
   - ⚠️ **Reputation Risk:** Public exposure of secrets

3. **Technical Impact:**
   - Secrets in git history require history rewriting (BFG/git-filter-repo)
   - Need to rotate exposed keys
   - Need to update all references to use environment variables

---

## Remediation Plan

### Phase 1: Immediate Actions (Do First - Today)

#### 1.1 Rotate Exposed Secrets
**Priority:** P0 - Critical  
**Estimated Time:** 30 minutes

**Actions:**
1. **Rotate Supabase ANON_KEY:**
   - Go to Supabase Dashboard → Project Settings → API
   - Generate new anon/public key
   - Update all references (see Phase 2)

2. **Rotate Resend API Key (if exposed):**
   - Go to Resend Dashboard → API Keys
   - Revoke old key, create new key
   - Update Supabase Edge Function secrets

3. **Verify No Other Secrets Exposed:**
   - Check GitGuardian dashboard for all 10 incidents
   - Document all exposed secrets

**Verification:**
- [ ] Old ANON_KEY no longer works (test with curl/Postman or Supabase client)
- [ ] New ANON_KEY works (test Supabase connection in app)
- [ ] Old Resend API key revoked (test email send fails)
- [ ] New Resend API key works (test email send succeeds)
- [ ] All GitGuardian incidents documented

**Deliverable:** New keys generated, old keys revoked, verification complete

---

#### 1.2 Remove Hardcoded Secrets from Current Files
**Priority:** P0 - Critical  
**Estimated Time:** 1 hour

**Files to Fix:**

1. **`app.json` → Convert to `app.config.js`:**
   - ✅ Create `app.config.js` that reads from environment variables (DONE)
   - ✅ Remove `supabaseAnonKey` from `app.json` (DONE - secret removed)
   - Note: `app.json` kept for reference, but Expo uses `app.config.js` when both exist
   - Use `process.env.EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

2. **`supabase/fix_cron_job.sql`:**
   - Replace hardcoded Bearer token with placeholder: `"Bearer <SUPABASE_ANON_KEY>"`
   - Add instructions to replace before running

3. **`supabase/test_edge_function.sql`:**
   - Replace hardcoded Bearer token with placeholder: `"Bearer <SUPABASE_ANON_KEY>"`
   - Add instructions to replace before running

4. **`supabase/migrations/004_cron_job_send_daily_emails.sql`:**
   - Replace hardcoded Bearer token with placeholder: `"Bearer <SUPABASE_ANON_KEY>"`
   - Add instructions to replace before running

**Deliverable:** All files updated, no hardcoded secrets in current codebase

---

### Phase 2: Environment Variable Setup (Do Next - Today)

#### 2.1 Create `app.config.js` for Expo
**Priority:** P0 - Critical  
**Estimated Time:** 30 minutes

**Implementation:**
```javascript
// app.config.js
export default {
  expo: {
    name: "TodoTomorrow",
    slug: "todotomorrow",
    // ... other config from app.json
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      launchDate: "2025-09-15T00:00:00Z",
      eas: {
        projectId: "d9259efb-a198-4da8-9580-23e51504ac3b"
      }
    }
  }
}
```

**Actions:**
1. ✅ Create `app.config.js` with environment variable references (DONE)
2. **Create `.env.example` file** (manual creation required - see template below):
   ```bash
   # Create .env.example file in project root with this content:
   # Expo Environment Variables
   # Copy this file to .env and fill in your actual values
   # NEVER commit .env to git - it's already in .gitignore
   
   # Supabase Configuration
   # Get these from: Supabase Dashboard > Project Settings > API
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # Note: EXPO_PUBLIC_ prefix is required for Expo to expose these variables to the app
   # See: https://docs.expo.dev/guides/environment-variables/
   ```
3. ✅ Update `.gitignore` to ensure `.env` is ignored (already done)
4. **Verify Expo SDK version** supports `.env` natively:
   - Expo SDK 49+ supports `.env` files natively
   - Current version: SDK 54 ✅ (supports natively)
   - No `dotenv` package needed
5. Update build documentation

**Deliverable:** `app.config.js` created ✅, `.env.example` template provided, Expo version verified, documentation updated

---

#### 2.2 Update SQL Files to Use Placeholders
**Priority:** P0 - Critical  
**Estimated Time:** 30 minutes

**Pattern to Use:**
```sql
-- IMPORTANT: Replace <SUPABASE_ANON_KEY> with actual ANON_KEY before running
-- Get ANON_KEY from: Supabase Dashboard > Project Settings > API > anon/public key
headers := '{"Content-Type": "application/json", "Authorization": "Bearer <SUPABASE_ANON_KEY>"}'::jsonb,
```

**Files to Update:**
- `supabase/fix_cron_job.sql`
- `supabase/test_edge_function.sql`
- `supabase/migrations/004_cron_job_send_daily_emails.sql`

**Deliverable:** All SQL files use placeholders, clear instructions added

---

#### 2.3 Configure EAS Build Secrets (For Production)
**Priority:** P0 - Critical  
**Estimated Time:** 30 minutes

**Actions:**
1. **Set environment variables in EAS:**
   ```bash
   # Set Supabase URL
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value https://zrnjxrtgrommlhexbpde.supabase.co
   
   # Set Supabase ANON_KEY (use NEW rotated key)
   eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value <your-new-anon-key>
   ```

2. **Verify `eas.json` configuration:**
   - Check that `eas.json` exists and is properly configured
   - Environment variables are automatically available during EAS builds

3. **Test EAS Build:**
   ```bash
   # Test Android build
   eas build --platform android --profile production
   
   # Verify build succeeds and app connects to Supabase
   ```

**Deliverable:** EAS secrets configured, production build tested

---

### Phase 3: Git History Cleanup (Do After Phase 1 & 2 - This Week)

#### 3.0 Prerequisites (Do Before Starting)
**Priority:** P0 - Critical  
**Estimated Time:** 15 minutes

**Before Starting Phase 3:**
- [ ] **Verify Java installed** (for BFG): `java -version`
  - If not installed, download from: https://www.java.com/download/
- [ ] **OR verify Python installed** (for git-filter-repo): `python --version` or `python3 --version`
  - If not installed, download from: https://www.python.org/downloads/
- [ ] **Verify git access/permissions** for force push to remote repository
- [ ] **Coordinate with team** - No one should push during cleanup window
- [ ] **Create full repository backup:**
  ```bash
  # Create backup branch
  git branch backup-before-history-cleanup
  
  # OR create full clone backup
  git clone --mirror <repo-url> backup-repo.git
  ```

**Deliverable:** Prerequisites verified, backup created, team notified

---

#### 3.1 Clean Git History
**Priority:** P0 - Critical  
**Estimated Time:** 2-3 hours  
**Risk:** ⚠️ Requires force push, coordinate with team

**Options:**

**Option A: BFG Repo-Cleaner (Recommended)**
```bash
# Install BFG (if not installed)
# Download from: https://rtyley.github.io/bfg-repo-cleaner/

# Create a file with secrets to remove
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo" > secrets.txt

# Clone a fresh copy (BFG works on clones)
git clone --mirror https://github.com/AverageJJJoe/TodoApp-1.git

# Run BFG
java -jar bfg.jar --replace-text secrets.txt TodoApp-1.git

# Clean up and push
cd TodoApp-1.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

**Option B: git-filter-repo (Alternative)**
```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove secrets from history
git filter-repo --replace-text secrets.txt --force
```

**Option C: Nuclear Option - New Repository**
- Create new repository
- Copy current code (without secrets)
- Update remote origin
- ⚠️ Loses all git history (only if history cleanup fails)

**Actions:**
1. **Backup current repository** (create full backup)
2. **Coordinate with team** (no one should push during cleanup)
3. **Choose cleanup method** (BFG recommended)
4. **Test on local clone first**
5. **Execute cleanup**
6. **Force push to remote**
7. **Verify GitGuardian no longer detects secrets**

**Deliverable:** Git history cleaned, secrets removed from all commits

---

### Phase 4: Prevention & Best Practices (Ongoing)

#### 4.1 Pre-commit Hooks
**Priority:** P1 - High  
**Estimated Time:** 1 hour

**Setup git-secrets:**
```bash
# Install git-secrets
# Windows: Use WSL or Git Bash
git secrets --install
git secrets --register-aws  # Registers AWS patterns
git secrets --add 'eyJ[A-Za-z0-9_-]{20,}'  # JWT pattern
git secrets --add 'Bearer [A-Za-z0-9_-]{20,}'  # Bearer token pattern
```

**Or use pre-commit framework:**
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

**Deliverable:** Pre-commit hooks installed, tested

---

#### 4.2 Documentation Updates
**Priority:** P1 - High  
**Estimated Time:** 1 hour

**Create/Update:**
1. **`docs/architecture/security-privacy.md`** - Add secret management section
2. **`SECRET_MANAGEMENT.md`** - Developer guide for handling secrets
3. **Update `.env.example`** - Clear instructions for setup
4. **Update migration templates** - Always use placeholders

**Key Points to Document:**
- Never commit secrets to git
- Always use environment variables
- Use placeholders in SQL files
- Rotate keys immediately if exposed
- Use git-secrets or similar tools

**Deliverable:** Documentation updated, developers trained

---

#### 4.3 CI/CD Integration
**Priority:** P2 - Medium  
**Estimated Time:** 2 hours

**Add to CI Pipeline:**
- GitGuardian scan (if not already integrated)
- Secret scanning step (detect-secrets, truffleHog, etc.)
- Fail build if secrets detected

**Deliverable:** CI pipeline scans for secrets

---

## Implementation Checklist

### Immediate (Today)
- [ ] **1.1** Rotate Supabase ANON_KEY
- [ ] **1.1** Rotate Resend API Key (if exposed)
- [ ] **1.1** Verify old keys revoked and new keys work
- [x] **1.2** Convert `app.json` to `app.config.js` ✅ (DONE)
- [x] **1.2a** Remove `supabaseAnonKey` from `app.json` ✅ (DONE)
- [x] **1.2** Update all SQL files with placeholders ✅ (DONE)
- [ ] **2.1** Create `.env.example` file (see note below)
- [ ] **2.1** Verify Expo environment variable support (SDK 54+ supports natively)
- [ ] **2.2** Test app builds with new config
- [ ] **2.3** Configure EAS Build secrets
- [ ] **2.3** Test EAS production build

### This Week
- [ ] **3.0** Verify prerequisites (Java/Python installed)
- [ ] **3.0** Create repository backup
- [ ] **3.0** Coordinate with team (no pushes during cleanup)
- [ ] **3.1** Clean git history (BFG or git-filter-repo)
- [ ] **3.1** Verify GitGuardian no longer detects secrets
- [ ] **4.1** Install pre-commit hooks
- [ ] **4.2** Update security documentation

### Ongoing
- [ ] **4.3** Add secret scanning to CI/CD
- [ ] **4.2** Regular security audits
- [ ] **4.2** Team training on secret management

---

## Testing & Verification

### Verification Steps

1. **Verify No Secrets in Current Code:**
   ```bash
   # Search for exposed secret pattern
   grep -r "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" . --exclude-dir=node_modules
   # Should return no results
   ```

2. **Verify Git History Clean:**
   - Check GitGuardian dashboard (should show 0 incidents after cleanup)
   - Run: `git log --all --full-history --source -S "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"`
   - Should return no results

3. **Verify App Still Works:**
   - **Development:**
     - [ ] App starts: `npm start` or `expo start` succeeds
     - [ ] Supabase connection: Login/signup works
     - [ ] Edge Functions: Email sending works
     - [ ] Cron job: Manual trigger works (if applicable)
   - **Production Build:**
     - [ ] Development build: `expo start` works
     - [ ] EAS build: `eas build --platform android` succeeds
     - [ ] Android build: APK/AAB builds successfully
     - [ ] iOS build: IPA builds successfully (if applicable)
     - [ ] Built app connects to Supabase correctly

4. **Verify Environment Variables:**
   - Check `.env` file exists (not committed)
   - Check `.env.example` has placeholders
   - Verify build process reads from env vars

---

## Risk Mitigation

### Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Git history cleanup breaks repo | High | Full backup before cleanup, test on clone first |
| Force push conflicts with team | Medium | Coordinate timing, communicate clearly |
| App breaks after config changes | Medium | Test thoroughly before deploying |
| Secrets still exposed after cleanup | High | Verify with GitGuardian, consider new repo if needed |
| Google Play rejection | High | Complete remediation before submission |
| EAS Build fails | Medium | Test EAS build before production deployment |
| Environment variables not loaded | High | Verify Expo SDK version, test locally first |

---

## Rollback Plan

### If Remediation Fails

**Scenario 1: Git History Cleanup Breaks Repository**
1. Restore from backup:
   ```bash
   # Restore from backup branch
   git checkout backup-before-history-cleanup
   git push --force origin main
   
   # OR restore from mirror backup
   git clone backup-repo.git restored-repo
   ```
2. Document what failed and why
3. Consider alternative cleanup method or new repository approach

**Scenario 2: App Breaks After Config Changes**
1. Temporarily revert to `app.json`:
   - Restore `supabaseAnonKey` in `app.json` (temporary)
   - Remove or rename `app.config.js`
   - Test app works
2. Debug environment variable loading issue
3. Fix `app.config.js` or add `dotenv` if needed
4. Re-test before removing secret again

**Scenario 3: New Keys Cause Issues**
1. Use old keys temporarily (if still valid)
2. Document the issue
3. Rotate keys again after fixing root cause
4. Update all references

**Scenario 4: EAS Build Fails**
1. Check EAS secrets configuration
2. Verify environment variable names match exactly
3. Test with development build first
4. Review EAS build logs for specific errors

**Documentation:**
- Document what failed, when, and why
- Update remediation plan with lessons learned
- Share findings with team

---

## Communication Plan

### Stakeholder Communication

**Before Starting Remediation:**
- [ ] **Notify team** of secret rotation (may cause brief downtime)
  - Message: "Rotating Supabase keys for security - app may be unavailable for 5-10 minutes"
  - Timing: Send 1 hour before rotation

**During Git History Cleanup:**
- [ ] **Communicate cleanup schedule** (coordinate force push)
  - Message: "Performing git history cleanup - no pushes allowed from [time] to [time]"
  - Timing: Send 24 hours before cleanup
  - Duration: Typically 2-3 hours

**After Remediation:**
- [ ] **Update team** on prevention measures (pre-commit hooks)
  - Message: "Pre-commit hooks installed - all commits will be scanned for secrets"
  - Include: Instructions for developers on how hooks work

**Documentation:**
- [ ] **Document lessons learned** for future reference
  - What went well
  - What could be improved
  - Prevention measures implemented
  - Share in team knowledge base

**Channels:**
- Team Slack/Teams channel
- Email (for critical updates)
- Documentation (for permanent record)

---

## Timeline

- **Day 1 (Today):** Phase 1 & 2 - Rotate keys, remove hardcoded secrets, setup env vars
- **Day 2-3:** Phase 3 - Git history cleanup (coordinate with team)
- **Day 4-5:** Phase 4 - Prevention setup, documentation
- **Day 6:** Verification & testing
- **Day 7:** Google Play Console submission (if all verified)

---

## Success Criteria

✅ **All hardcoded secrets removed from current codebase**  
✅ **Git history cleaned (GitGuardian shows 0 incidents)**  
✅ **Environment variables properly configured**  
✅ **Pre-commit hooks prevent future commits**  
✅ **App builds and runs successfully**  
✅ **Google Play Console submission approved**

---

## References

- [GitGuardian Remediation Guide](https://docs.gitguardian.com/internal-repositories-monitoring/integrations/github/incidents/remediation)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/security)

---

## Notes

- **ANON_KEY Context:** While Supabase ANON_KEY is designed for client-side use and is "public-safe", it's still best practice to:
  - Not hardcode it in version control
  - Rotate it if exposed
  - Use environment variables for configuration

- **Git History:** Even after removing secrets from current files, they remain in git history. This is why Phase 3 (history cleanup) is critical.

- **Google Play Console:** Google may flag apps with exposed secrets in git history, even if removed from current code. Complete remediation before submission.

---

**Document Owner:** Product Manager (John)  
**Last Updated:** November 6, 2025  
**Next Review:** After remediation complete

