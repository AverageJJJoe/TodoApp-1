# Git History Cleanup Guide
**Date:** 2025-01-27  
**Status:** Ready to Execute

---

## 🎯 GOAL
Remove exposed secrets from git history to prevent GitGuardian from flagging them.

**Exposed Secrets:**
1. Sentry Auth Token: `sntrys_eyJpYXQiOjE3NjI4Njk2NTYuNjk1NjI3...`
2. Sentry DSN: `https://***REMOVED***@o4510346706026496.ingest.us.sentry.io/4510346715594752`
3. PostHog API Key: `***REMOVED***`

**Affected Commit:** `012fb62` - "Integrate Sentry and PostHog for enhanced error tracking and analytics"

---

## ⚠️ CRITICAL WARNINGS

1. **Force Push Required:** This will rewrite git history
2. **Team Impact:** All team members must re-clone repository after cleanup
3. **Backup First:** Ensure you have a backup or all changes are pushed
4. **One-Time Operation:** Can't be undone easily

---

## 📋 PRE-FLIGHT CHECKLIST

- [ ] All current changes committed and pushed
- [ ] Team notified (if working with others)
- [ ] Backup created (optional but recommended)
- [ ] PostHog API key rotated (if doing both tasks)
- [ ] Ready to force push

---

## 🔧 METHOD 1: git-filter-repo (Recommended for Windows)

### Prerequisites
```powershell
# Check Python installed
python --version

# Install git-filter-repo
pip install git-filter-repo
```

### Execution Steps

1. **Create secrets.txt file** ✅ (Already created)

2. **Run git-filter-repo:**
```powershell
cd "C:\Users\joega\My Apps\todoapp"

# Clean history
git filter-repo --replace-text secrets.txt --force

# Verify cleanup
git log --all --oneline | Select-String "012fb62"
```

3. **Force push:**
```powershell
git push --force origin main
```

---

## 🔧 METHOD 2: BFG Repo-Cleaner (Alternative)

### Prerequisites
- Java installed
- BFG jar file downloaded

### Execution Steps

1. **Download BFG (if needed):**
   - Download from: https://rtyley.github.io/bfg-repo-cleaner/
   - Save as `bfg.jar` in project root

2. **Run BFG:**
```powershell
cd "C:\Users\joega\My Apps\todoapp"

# Run BFG
java -jar bfg.jar --replace-text secrets.txt

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

3. **Force push:**
```powershell
git push --force origin main
```

---

## ✅ VERIFICATION

After cleanup, verify:

1. **Check git log:**
```powershell
git log --all --oneline | Select-String "012fb62"
# Should still show commit, but secrets should be replaced

git log -p | Select-String "sntrys_"
# Should show "***REMOVED***" instead of actual token
```

2. **Check GitGuardian:**
   - Wait 24-48 hours for GitGuardian to rescan
   - Verify no new incidents for these secrets

3. **Test repository:**
   - Clone fresh copy: `git clone [repo-url]`
   - Verify app builds correctly
   - Verify no secrets in history

---

## 📝 POST-CLEANUP ACTIONS

1. **Notify team:**
   - Inform team members to re-clone repository
   - Share new repository URL if changed

2. **Update documentation:**
   - Mark git history cleanup as complete
   - Update SECRET_EXPOSURE_FIX_1.0.8.md

3. **Monitor GitGuardian:**
   - Check dashboard after 24-48 hours
   - Verify incidents resolved

---

**Ready to execute?** Follow the steps above for your chosen method.

