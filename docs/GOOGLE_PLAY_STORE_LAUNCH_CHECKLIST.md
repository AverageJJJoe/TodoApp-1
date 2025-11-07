# Google Play Store Launch Checklist

**Date Created:** 2025-01-27  
**App Name:** TodoTomorrow  
**Package Name:** `com.todotomorrow.app`  
**Status:** Pre-Launch Preparation

---

## ⚠️ CRITICAL: Version Code Check Required Before Every Build

**💰 COST WARNING:** EAS Build credits cost money. Building with wrong version code wastes credits!

**Before ANY build command, ALWAYS:**
1. Check Play Console for last uploaded version code (all tracks)
2. Increment `android.versionCode` in `app.config.js` (must be higher)
3. Update `version` in both `app.config.js` and `app.json`

**📚 Full Checklist:** See `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`  
**🤖 AI Reminder:** See `docs/AI_VERSION_CODE_REMINDER.md`

---

## Executive Summary

This document outlines all requirements and steps needed to successfully launch TodoTomorrow on the Google Play Store. Use this checklist to ensure nothing is missed before submission.

**Estimated Timeline:** 3-5 days for preparation + 2-3 days for Google review = **5-8 days total**

---

## 1. Google Play Console Account Setup

### 1.1 Developer Account
- [x] **Create Google Play Developer Account** ✅ **COMPLETE**
  - Cost: $25 one-time fee
  - URL: https://play.google.com/console/signup
  - Required: Google account, payment method
  
- [x] **Complete Developer Profile** ✅ **COMPLETE**
  - Developer name: "TodoTomorrow" (or your company name)
  - Contact email: (your support email)
  - Phone number: (optional but recommended)
  - Website: https://todotomorrow.com
  
- [x] **Accept Developer Distribution Agreement** ✅ **COMPLETE**
  - Read and accept Google Play policies
  - Complete identity verification if required

### 1.2 App Creation
- [x] **Create New App** ✅ **COMPLETE**
  - App name: "TodoTomorrow"
  - Default language: English (United States)
  - App or game: App
  - Free or paid: Free (with in-app purchases)
  - Declare app content: Complete content rating questionnaire

---

## 2. App Listing Requirements

### 2.1 Store Listing Details

**App Name:**
- [ ] **Short Title:** "TodoTomorrow" (max 30 characters)
- [ ] **Full Description:** (max 4000 characters)
  ```
  TodoTomorrow helps you capture tasks on the go and get them delivered to your inbox every morning.
  
  ✨ Key Features:
  • Quick task capture - Add tasks anytime, anywhere
  • Morning email delivery - Get your tasks delivered to your inbox
  • Two workflow modes:
    - Fresh Start: Tasks cleared after email (clean slate daily)
    - Carry Over: Tasks stay until completed (traditional todo)
  • Customizable delivery time - Set your preferred morning time
  • Dark mode support - Use comfortably in any lighting
  • Archive view - Review past tasks anytime
  
  🎯 Perfect For:
  • Busy professionals who want morning clarity
  • Anyone who captures tasks throughout the day
  • People who prefer email-based task management
  
  📧 How It Works:
  1. Add tasks throughout your day
  2. Receive a beautifully formatted email every morning
  3. Review and complete tasks from your inbox
  
  Start free and see how TodoTomorrow transforms your daily workflow!
  ```

**Graphics:**
- [x] **App Icon:** ✅ **COMPLETE** - 512×512px PNG (`assets/icon.png`)
- [x] **Feature Graphic:** ✅ **COMPLETE** - 1024×500px PNG (uploaded to store listing)
- [x] **Phone Screenshots:** ✅ **COMPLETE** - Uploaded to store listing
  - Minimum: 2 screenshots ✅
  - Recommended: 1080×1920px (portrait) ✅
  - Screenshots uploaded:
    1. Auth screen (magic link) ✅
    2. Main screen with tasks ✅
    3. Empty state ✅
    4. Settings screen ✅
    5. Archive view (if applicable) ✅
- [ ] **Tablet Screenshots:** Optional but recommended
  - Minimum: 320px height
  - Recommended: 1920×1200px (landscape) or 1200×1920px (portrait)

**Categorization:**
- [x] **App Category:** ✅ **COMPLETE** - Productivity
- [x] **Tags:** ✅ **COMPLETE** - (optional) todo, task management, productivity, email, morning routine
- [x] **Content Rating:** ✅ **COMPLETE** - Questionnaire completed (likely "Everyone")

### 2.2 Privacy & Compliance

**Privacy Policy:**
- [x] **Privacy Policy URL:** ✅ **COMPLETE**
  - URL: https://www.todotomorrow.com/privacy
  - Must be publicly accessible ✅
  - Must cover data collection, usage, sharing ✅
  - **Status:** ✅ **CREATED AND LIVE**

**Data Safety:**
- [x] **Complete Data Safety Section** ✅ **COMPLETE** - Completed in Play Console
  - Declare what data is collected ✅
  - Declare how data is used ✅
  - Declare data sharing practices ✅
  - Required for apps that collect user data ✅

**Permissions:**
- [ ] **Review App Permissions**
  - Current permissions: None (magic link auth doesn't require permissions)
  - Verify no unnecessary permissions declared

---

## 3. App Configuration & Build

### 3.1 App Configuration (app.json)

**Current Configuration:** ✅ **VERIFIED**
- ✅ Package name: `com.todotomorrow.app`
- ✅ App name: "TodoTomorrow"
- ✅ Version: `1.0.1` (in both `app.config.js` and `app.json`)
- ✅ Version Code: `2` (in `app.config.js` → `android.versionCode`)
- ✅ Icon: `./assets/icon.png`
- ✅ Splash screen: `./assets/splash.png`
- ✅ Adaptive icon configured

**⚠️ CRITICAL:** See `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md` for mandatory version code check before every build!

**Action Items:**
- [ ] **⚠️ CRITICAL: Check Version Code Before Building**
  - **MANDATORY:** Check Play Console → Production → Releases to see last uploaded version code
  - **MANDATORY:** Increment `android.versionCode` in `app.config.js` to be HIGHER than last uploaded version
  - **MANDATORY:** Update `version` (version name) in `app.config.js` and `app.json` if needed
  - **Rule:** Each new build MUST have a higher version code than the previous upload
  - **Cost Warning:** Building with wrong version code wastes EAS build credits!
- [ ] **Verify app signing:** EAS Build handles signing automatically
- [ ] **Test production build:** Build and test before submission

### 3.2 EAS Build Configuration

**Current Configuration:** ✅ **VERIFIED**
- ✅ `eas.json` configured for production builds
- ✅ Android build type: `app-bundle` (required for Play Store)
- ✅ EAS project ID: `d9259efb-a198-4da8-9580-23e51504ac3b`

**Build Commands:**
```bash
# ⚠️ CRITICAL: Check version code BEFORE building!
# See: docs/VERSION_CODE_CHECK_BEFORE_BUILD.md

# Create production build
eas build --platform android --profile production

# Submit to Play Store (after build completes)
eas submit --platform android
```

**⚠️ MANDATORY PRE-BUILD CHECKLIST:**
- [ ] Check Play Console for last uploaded version code
- [ ] Increment `android.versionCode` in `app.config.js` (must be higher)
- [ ] Update `version` in both `app.config.js` and `app.json`
- [ ] See full checklist: `docs/VERSION_CODE_CHECK_BEFORE_BUILD.md`

**Pre-Build Checklist:**
- [x] **Environment Variables:** ✅ Verified all secrets are in EAS secrets
  - `EXPO_PUBLIC_SUPABASE_URL` ✅
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` ✅
  - Any other required env vars ✅
- [x] **Production Build Created:** ✅ **COMPLETE**
  - AAB file generated successfully
  - Ready for testing and submission
- [ ] **Test Production Build:** ⚠️ **NEXT STEP**
  - Install on physical Android device
  - Test all features thoroughly
- [ ] **Verify All Features Work:**
  - [ ] Authentication (magic link)
  - [ ] Task creation
  - [ ] Task completion
  - [ ] Email delivery
  - [ ] Settings screen
  - [ ] Dark mode
  - [ ] Archive view

### 3.3 App Signing

**EAS Build Signing:** ✅ **AUTOMATIC**
- EAS Build automatically handles app signing
- Google Play App Signing is recommended (allows Google to manage signing keys)

**Action Items:**
- [ ] **Enable Google Play App Signing** (recommended)
  - Upload key is managed by EAS
  - Google manages app signing key
  - Allows key recovery if upload key is lost

---

## 4. Legal & Policy Documents

### 4.1 Privacy Policy ✅ **COMPLETE**

**Status:** ✅ **CREATED AND LIVE**

**Privacy Policy URL:** https://www.todotomorrow.com/privacy

**Requirements:** ✅ **ALL MET**
- ✅ Must be publicly accessible URL
- ✅ Covers data collection, usage, sharing
- ✅ Includes user rights and contact information

**Action Items:**
- [x] **Create Privacy Policy document** ✅ **COMPLETE**
  - Hosted at: https://www.todotomorrow.com/privacy
- [ ] **Add Privacy Policy link to app** (Optional enhancement)
  - Settings screen → ABOUT section → Privacy Policy row
  - Currently shown in design but not implemented (Story 6.2)
  - **Note:** Not required for Play Store submission, but nice UX enhancement

### 4.2 Terms of Service (Optional but Recommended)

**Status:** ⚠️ **NOT CREATED** - Recommended but not required

**Action Items:**
- [ ] **Create Terms of Service document** (optional)
  - Host at: `https://todotomorrow.com/terms`
  - Cover: Usage terms, user responsibilities, service availability
- [ ] **Add Terms link to app** (if created)
  - Settings screen → ABOUT section → Terms of Use row

### 4.3 Content Rating

**Google Play Content Rating:**
- [ ] **Complete Content Rating Questionnaire**
  - Age-appropriate content
  - Violence, sexual content, etc.
  - Expected rating: "Everyone" (no objectionable content)

---

## 5. Store Listing Assets

### 5.1 Required Graphics

**App Icon:** ✅ **CREATED**
- File: `assets/icon.png`
- Size: 512×512px
- Format: PNG with transparency
- Status: Ready

**Feature Graphic:** ✅ **COMPLETE**
- Size: 1024×500px
- Format: PNG or JPG
- Purpose: Banner shown at top of Play Store listing
- **Status:** ✅ Uploaded to store listing

**Screenshots:** ✅ **COMPLETE**
- Minimum: 2 screenshots ✅
- Maximum: 8 screenshots
- Format: PNG or JPG
- Size: Minimum 320px height ✅
- Recommended: 1080×1920px (portrait) ✅
- **Status:** ✅ Uploaded to store listing

**Screenshot Checklist:**
- [x] Auth screen (magic link entry) ✅
- [x] Main screen with tasks (active tab) ✅
- [x] Empty state (no tasks) ✅
- [x] Settings screen ✅
- [x] Archive view (if applicable) ✅
- [x] Dark mode screenshot (optional but nice) ✅
- [x] Onboarding screen (optional) ✅

### 5.2 Promotional Assets (Optional)

**Promotional Video:** Optional
- Max length: 30 seconds
- Format: YouTube link or uploaded video
- Purpose: Show app in action

**Promotional Graphic:** Optional
- Size: 180×120px
- Format: PNG or JPG
- Purpose: Small banner in Play Store

---

## 6. Pricing & Monetization

### 6.1 App Pricing

**Current Plan:** ✅ **FREE APP**
- App is free to download
- In-app purchases: Not yet implemented (deferred)
- Future: One-time purchase for premium features

**Action Items:**
- [ ] **Set App as Free** in Play Console
- [ ] **Declare In-App Purchases** (if planning to add)
  - Currently: None
  - Future: One-time purchase products

### 6.2 Monetization Strategy

**From PRD:**
- Launch: Free (to maximize adoption)
- Future: Freemium with tiered pricing
- Payment: Google Play Billing (30% commission)

**Action Items:**
- [ ] **Plan In-App Purchase Products** (for future)
  - Product IDs
  - Pricing tiers
  - Feature differentiation

---

## 7. Testing & Quality Assurance

### 7.1 Internal Testing

**Pre-Submission Testing:**
- [x] **Build Production AAB** ✅ **COMPLETE**
  ```bash
  eas build --platform android --profile production
  ```
  - AAB file ready for testing and submission
- [ ] **Install on Physical Device** ⚠️ **NEXT STEP**
  - Convert AAB to APK for testing (if needed) OR
  - Upload to Internal Testing track in Play Console
  - Test on multiple Android versions (8.0+)
  - Test on different screen sizes
- [ ] **Test All Features:**
  - [ ] Authentication flow (magic link) ⚠️ **FIXED** - Supabase redirect URLs configured
  - [ ] Task creation
  - [ ] Task completion
  - [ ] Task deletion
  - [ ] Task editing
  - [ ] Email delivery (test email)
  - [ ] Settings screen
  - [ ] Dark mode toggle
  - [ ] Archive view
  - [ ] Workflow mode switching
- [ ] **Test Edge Cases:**
  - [ ] No internet connection
  - [ ] Slow internet connection
  - [ ] App backgrounding/foregrounding
  - [ ] Deep link handling
  - [ ] Email link handling

### 7.2 Closed Testing Track

**Google Play Internal Testing:**
- [ ] **Create Internal Testing Track**
  - Add testers (email addresses)
  - Upload AAB to internal track
  - Testers can download from Play Store
- [ ] **Gather Feedback**
  - Test for 1-2 days
  - Fix any critical issues
  - Then move to production

---

## 8. Submission Process

### 8.1 Pre-Submission Checklist

**Before Submitting:**
- [x] All store listing fields completed ✅
- [x] Privacy policy URL added and accessible ✅ (https://www.todotomorrow.com/privacy)
- [x] Content rating completed ✅
- [x] Screenshots uploaded (minimum 2) ✅
- [x] Feature graphic uploaded ✅
- [x] App icon uploaded ✅
- [x] Production AAB built ✅ **COMPLETE**
- [ ] Production build tested and verified ⚠️ **NEXT STEP**
- [x] All app permissions declared ✅
- [x] Data safety section completed ✅

### 8.2 Submission Steps

1. [ ] **Test Production Build** ⚠️ **DO THIS FIRST**
   - Install AAB on physical device (via Internal Testing track OR convert to APK)
   - Test all features thoroughly
   - Verify no crashes or critical bugs
   - **Note:** You can upload to Internal Testing track first, test, then promote to Production

2. [x] **Production AAB Built** ✅ **COMPLETE**
   - AAB file ready for upload

3. [x] **Complete Store Listing** ✅ **COMPLETE**
   - All required fields filled ✅
   - Graphics uploaded ✅
   - Description added ✅

4. [x] **Set Content Rating** ✅ **COMPLETE**
   - Questionnaire completed ✅
   - Rating certificate obtained ✅

5. [x] **Set Pricing & Distribution** ✅ **COMPLETE**
   - Set as free ✅
   - Countries selected ✅
   - Availability set ✅

6. [ ] **Upload AAB File** ⚠️ **READY TO DO**
   - Option A: Use EAS Submit (recommended):
     ```bash
     eas submit --platform android
     ```
   - Option B: Manually upload in Play Console:
     - Go to Play Console → Your App → Production → Create new release
     - Upload AAB file
     - Add release notes (e.g., "Initial release of TodoTomorrow")
   - File: `.aab` format (not `.apk`) ✅

7. [ ] **Review & Submit** ⚠️ **FINAL STEP**
   - Review all information one final time
   - Verify privacy policy link works
   - Check release notes
   - Submit for review

### 8.3 Post-Submission

**Review Timeline:**
- Typical: 2-3 days
- Can be faster (hours) or slower (up to 7 days)
- Google will email when review is complete

**Possible Outcomes:**
- ✅ **Approved:** App goes live
- ⚠️ **Rejected:** Fix issues and resubmit
- 📝 **Request Changes:** Address feedback

---

## 9. Post-Launch Considerations

### 9.1 Monitoring & Analytics

**Set Up Monitoring:**
- [ ] **Google Play Console Analytics**
  - Monitor installs
  - Track crashes
  - Review user ratings
- [ ] **Firebase Crashlytics** (optional)
  - Add Firebase SDK for crash reporting
- [ ] **App Performance Monitoring**
  - Monitor API response times
  - Track email delivery success rates

### 9.2 User Support

**Support Channels:**
- [ ] **Support Email:** support@todotomorrow.com (configured in Story 7.5)
- [ ] **In-App Contact Form:** ✅ Implemented (Story 7.5)
- [ ] **Play Store Support:** Respond to user reviews

### 9.3 Updates & Maintenance

**Update Strategy:**
- [ ] **Plan First Update** (bug fixes, improvements)
- [ ] **Set Update Schedule** (monthly or as needed)
- [ ] **Monitor User Feedback** (reviews, support emails)

---

## 10. Critical Path Items

### ⚠️ **MUST COMPLETE BEFORE SUBMISSION:**

1. **Test Production Build** ⚠️ **REQUIRED - NEXT STEP**
   - Install AAB on physical Android device
   - Test all features thoroughly
   - Verify no crashes or critical bugs
   - **Tip:** Upload to Internal Testing track first, test, then promote to Production

2. **Upload & Submit** ⚠️ **READY TO DO**
   - Upload AAB to Play Console (Production track)
   - Add release notes
   - Submit for Google review

### ✅ **ALREADY COMPLETE:**

- ✅ Google Play Developer Account setup
- ✅ App listing created
- ✅ Privacy Policy (https://www.todotomorrow.com/privacy)
- ✅ Store listing graphics (feature graphic + screenshots)
- ✅ Store listing description
- ✅ Content rating completed
- ✅ Data safety section completed
- ✅ App configuration (app.json)
- ✅ Package name (`com.todotomorrow.app`)
- ✅ App icon (512×512px)
- ✅ Splash screen
- ✅ EAS Build configuration
- ✅ **Production AAB built** ✅ **NEW**
- ✅ Contact form (in-app support)
- ✅ Compliance requirements met

---

## 11. Timeline Estimate

**Preparation Phase (3-5 days):**
- Day 1: Create privacy policy, gather graphics
- Day 2: Create store listing, upload assets
- Day 3: Build production AAB, test thoroughly
- Day 4: Complete content rating, data safety
- Day 5: Final review, submit

**Review Phase (2-3 days):**
- Google review: 2-3 days typical
- Possible revisions: +1-2 days if changes needed

**Total:** 5-8 days from start to live

---

## 12. Resources & References

**Google Play Console:**
- https://play.google.com/console

**Documentation:**
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- App Bundle Guide: https://developer.android.com/guide/app-bundle
- Privacy Policy Requirements: https://support.google.com/googleplay/android-developer/answer/10787469

**Tools:**
- Privacy Policy Generator: https://www.termsfeed.com/privacy-policy-generator/
- Screenshot Tools: Android Studio, device screenshots
- Feature Graphic: Canva, Figma, or design tool

---

## 13. Next Steps

**Immediate Actions:**
1. ✅ **Build Production AAB** ✅ **COMPLETE**
   ```bash
   # ⚠️ CRITICAL: Check version code BEFORE building!
   # See: docs/VERSION_CODE_CHECK_BEFORE_BUILD.md
   eas build --platform android --profile production
   ```
   - AAB file ready! ✅

2. ⚠️ **Test Production Build** (NEXT STEP - HIGH PRIORITY)
   - **Option A:** Upload to Internal Testing track in Play Console
     - Go to Play Console → Testing → Internal testing
     - Upload AAB file
     - Add testers (your email)
     - Install from Play Store (internal testing link)
   - **Option B:** Convert AAB to APK for direct installation
     - Use `bundletool` or online converter
     - Install APK directly on device
   - Test all features thoroughly:
     - Authentication (magic link)
     - Task CRUD operations
     - Email delivery
     - Settings & dark mode
     - Archive view
   - Verify no crashes or critical bugs

3. ⚠️ **Upload AAB to Play Console** (After testing passes)
   - **Recommended:** Use EAS Submit:
     ```bash
     eas submit --platform android
     ```
   - **Alternative:** Manually upload in Play Console:
     - Go to Production → Create new release
     - Upload AAB file
     - Add release notes: "Initial release of TodoTomorrow - Capture tasks on the go and get them delivered to your inbox every morning."

4. ⚠️ **Final Review & Submit** (Final step)
   - Review all store listing information
   - Verify privacy policy link works: https://www.todotomorrow.com/privacy
   - Check release notes
   - Submit for Google review

**Status Summary:**
- ✅ **Store Listing:** Complete (description, screenshots, graphics)
- ✅ **Compliance:** Complete (privacy policy, content rating, data safety)
- ✅ **Account Setup:** Complete (developer account, app created)
- ✅ **Production Build:** Complete (AAB file ready)
- ⚠️ **Testing & Submission:** Next steps (test build, then upload & submit)

---

## Notes

- **App Name:** TodoTomorrow (consistent across all platforms)
- **Package Name:** `com.todotomorrow.app` (already configured)
- **Version:** 1.0.0 (initial release)
- **Monetization:** Free app (in-app purchases deferred to post-launch)
- **Target Audience:** Productivity app users, busy professionals

**Questions or Issues?**
- Review this checklist regularly
- Update status as items are completed
- Document any blockers or questions

