# TodoTomorrow Rename - External Services Update Checklist

**Date:** 2025-01-31  
**Rename:** TodoMorning → TodoTomorrow  
**Domain:** todotomorrow.com

## ✅ Code & Configuration (Already Updated)

All code and configuration files have been updated:
- ✅ `app.json` - App name, slug, scheme, bundle IDs
- ✅ `package.json` - Package name
- ✅ `package-lock.json` - Package references
- ✅ `src/screens/AuthScreen.tsx` - Deep link URL
- ✅ All documentation files

---

## 🔧 External Services - Manual Updates Required

### 1. Supabase Dashboard ⚠️ **CRITICAL**

**Location:** Supabase Dashboard → Authentication → URL Configuration

**Required Updates:**
- [ ] Update redirect URL from `todomorning://auth/callback` to `todotomorrow://auth/callback`
- [ ] When implementing Universal Links (Story 1.6), add `https://todotomorrow.com/auth/callback`

**Steps:**
1. Log in to your Supabase Dashboard
2. Navigate to: **Authentication** → **URL Configuration**
3. Find the redirect URL entry: `todomorning://auth/callback`
4. Update to: `todotomorrow://auth/callback`
5. Save changes

**Impact:** Magic link emails will not work correctly until this is updated.

---

### 2. Domain & Email Configuration

**Domain:** todotomorrow.com (already purchased ✅)

**Email Services (When Implementing):**
- [ ] Set up email sending from `hello@todotomorrow.com` or `team@todotomorrow.com`
- [ ] Verify domain with SendGrid (when implementing Story 3.3)
- [ ] Configure SPF/DKIM records for email authentication

**Note:** These are future tasks when implementing email delivery system.

---

### 3. App Store Listings (When Publishing)

**iOS App Store:**
- [ ] Update app name from "TodoMorning" to "TodoTomorrow"
- [ ] Update bundle identifier from `com.todomorning.app` to `com.todotomorrow.app`
  - ⚠️ **Note:** Changing bundle ID creates a new app listing. Existing users would need to reinstall.

**Google Play Store:**
- [ ] Update app name from "TodoMorning" to "TodoTomorrow"
- [ ] Update package name from `com.todomorning.app` to `com.todotomorrow.app`
  - ⚠️ **Note:** Changing package name creates a new app listing. Existing users would need to reinstall.

**Important:** Since you haven't published yet, this won't affect existing users, but remember to use the new bundle IDs when creating your first build.

---

### 4. Universal Links / App Links (Story 1.6 - Future)

When implementing Story 1.6, configure:
- [ ] `apple-app-site-association` file for iOS (bundle ID: `com.todotomorrow.app`)
- [ ] `assetlinks.json` file for Android (package: `com.todotomorrow.app`)
- [ ] Host files at `https://todotomorrow.com/.well-known/`

---

### 5. Development Environment

**Expo:**
- [ ] Clear Expo cache: `npx expo start -c` (recommended after rename)
- [ ] Reinstall dependencies if needed: `npm install`

**Testing:**
- [ ] Test magic link flow after Supabase redirect URL update
- [ ] Verify deep link handler works with new scheme: `todotomorrow://auth/callback`

---

## 📝 Notes

1. **Bundle ID Change Impact:** 
   - Since bundle IDs changed from `com.todomorning.app` to `com.todotomorrow.app`, any existing development builds will need to be rebuilt.
   - This is fine for development, but be aware when creating first production builds.

2. **Backward Compatibility:**
   - Old deep links (`todomorning://`) will stop working immediately after code deployment
   - Update Supabase redirect URL BEFORE deploying code changes if possible
   - Or deploy code and Supabase update simultaneously

3. **Email Domain:**
   - The domain `todotomorrow.com` is purchased and ready
   - Email configuration happens in Story 3.3 (SendGrid Integration)

---

## ✅ Verification Steps

After updating Supabase redirect URL:

1. **Test Magic Link:**
   - Request magic link from app
   - Check email for redirect URL - should contain `todotomorrow://auth/callback`
   - Click link and verify app opens

2. **Verify Deep Link:**
   - Test deep link handler accepts `todotomorrow://auth/callback?token=test`
   - Check Expo console logs for correct scheme recognition

---

## 🚨 Immediate Action Required

**Must Do Now:**
1. ✅ Update Supabase Dashboard redirect URL (before next magic link test)

**Can Wait:**
- App Store listings (not published yet)
- Email configuration (Story 3.3)
- Universal Links setup (Story 1.6)

