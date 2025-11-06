# Google Play Store Launch Checklist

**Date Created:** 2025-01-27  
**App Name:** TodoTomorrow  
**Package Name:** `com.todotomorrow.app`  
**Status:** Pre-Launch Preparation

---

## Executive Summary

This document outlines all requirements and steps needed to successfully launch TodoTomorrow on the Google Play Store. Use this checklist to ensure nothing is missed before submission.

**Estimated Timeline:** 3-5 days for preparation + 2-3 days for Google review = **5-8 days total**

---

## 1. Google Play Console Account Setup

### 1.1 Developer Account
- [ ] **Create Google Play Developer Account**
  - Cost: $25 one-time fee
  - URL: https://play.google.com/console/signup
  - Required: Google account, payment method
  
- [ ] **Complete Developer Profile**
  - Developer name: "TodoTomorrow" (or your company name)
  - Contact email: (your support email)
  - Phone number: (optional but recommended)
  - Website: https://todotomorrow.com
  
- [ ] **Accept Developer Distribution Agreement**
  - Read and accept Google Play policies
  - Complete identity verification if required

### 1.2 App Creation
- [ ] **Create New App**
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
- [ ] **App Icon:** 512×512px PNG (already created: `assets/icon.png`)
- [ ] **Feature Graphic:** 1024×500px PNG (required for store listing)
- [ ] **Phone Screenshots:** At least 2, max 8
  - Minimum: 320px height
  - Recommended: 1080×1920px (portrait)
  - Required screenshots:
    1. Auth screen (magic link)
    2. Main screen with tasks
    3. Empty state
    4. Settings screen
    5. Archive view (optional)
- [ ] **Tablet Screenshots:** Optional but recommended
  - Minimum: 320px height
  - Recommended: 1920×1200px (landscape) or 1200×1920px (portrait)

**Categorization:**
- [ ] **App Category:** Productivity
- [ ] **Tags:** (optional) todo, task management, productivity, email, morning routine
- [ ] **Content Rating:** Complete questionnaire (likely "Everyone")

### 2.2 Privacy & Compliance

**Privacy Policy:**
- [ ] **Privacy Policy URL:** Required for Google Play
  - Must be publicly accessible
  - Must cover data collection, usage, sharing
  - Suggested URL: `https://todotomorrow.com/privacy-policy`
  - **Status:** ⚠️ **NOT CREATED YET** - See Section 4.1

**Data Safety:**
- [ ] **Complete Data Safety Section** in Play Console
  - Declare what data is collected
  - Declare how data is used
  - Declare data sharing practices
  - Required for apps that collect user data

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
- ✅ Version: `1.0.0`
- ✅ Icon: `./assets/icon.png`
- ✅ Splash screen: `./assets/splash.png`
- ✅ Adaptive icon configured

**Action Items:**
- [ ] **Verify version code:** Ensure `versionCode` is set (Expo handles this automatically)
- [ ] **Verify app signing:** EAS Build handles signing automatically
- [ ] **Test production build:** Build and test before submission

### 3.2 EAS Build Configuration

**Current Configuration:** ✅ **VERIFIED**
- ✅ `eas.json` configured for production builds
- ✅ Android build type: `app-bundle` (required for Play Store)
- ✅ EAS project ID: `d9259efb-a198-4da8-9580-23e51504ac3b`

**Build Commands:**
```bash
# Create production build
eas build --platform android --profile production

# Submit to Play Store (after build completes)
eas submit --platform android
```

**Pre-Build Checklist:**
- [ ] **Environment Variables:** Verify all secrets are in EAS secrets
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
  - Any other required env vars
- [ ] **Test Build Locally:** Run preview build first
  ```bash
  eas build --platform android --profile preview
  ```
- [ ] **Install Test APK:** Test on physical Android device
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

### 4.1 Privacy Policy ⚠️ **REQUIRED - NOT CREATED**

**Status:** ⚠️ **MISSING** - Must be created before submission

**Requirements:**
- Must be publicly accessible URL
- Must cover:
  - What data is collected (email addresses, tasks, preferences)
  - How data is used (email delivery, app functionality)
  - Data storage (Supabase)
  - Data sharing (third-party services: Supabase, Resend)
  - User rights (data deletion, access)
  - Contact information for privacy inquiries

**Suggested Content:**
- Data collection: Email addresses, tasks, user preferences, delivery time
- Data storage: Supabase (encrypted, secure)
- Third-party services: Supabase (database), Resend (email delivery)
- User rights: Can delete account, request data export
- Contact: support@todotomorrow.com

**Action Items:**
- [ ] **Create Privacy Policy document**
  - Template: Use standard privacy policy template
  - Host at: `https://todotomorrow.com/privacy-policy`
  - Or use privacy policy generator (e.g., TermsFeed, iubenda)
- [ ] **Add Privacy Policy link to app**
  - Settings screen → ABOUT section → Privacy Policy row
  - Currently shown in design but not implemented (Story 6.2)

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

**Feature Graphic:** ⚠️ **NOT CREATED**
- Size: 1024×500px
- Format: PNG or JPG
- Purpose: Banner shown at top of Play Store listing
- **Action:** Create feature graphic showcasing app

**Screenshots:** ⚠️ **NOT CREATED**
- Minimum: 2 screenshots
- Maximum: 8 screenshots
- Format: PNG or JPG
- Size: Minimum 320px height
- Recommended: 1080×1920px (portrait)
- **Action:** Capture screenshots from production build

**Screenshot Checklist:**
- [ ] Auth screen (magic link entry)
- [ ] Main screen with tasks (active tab)
- [ ] Empty state (no tasks)
- [ ] Settings screen
- [ ] Archive view (if applicable)
- [ ] Dark mode screenshot (optional but nice)
- [ ] Onboarding screen (optional)

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
- [ ] **Build Production APK/AAB**
  ```bash
  eas build --platform android --profile production
  ```
- [ ] **Install on Physical Device**
  - Test on multiple Android versions (8.0+)
  - Test on different screen sizes
- [ ] **Test All Features:**
  - [ ] Authentication flow
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
- [ ] All store listing fields completed
- [ ] Privacy policy URL added and accessible
- [ ] Content rating completed
- [ ] Screenshots uploaded (minimum 2)
- [ ] Feature graphic uploaded
- [ ] App icon uploaded
- [ ] Production build tested and verified
- [ ] All app permissions declared
- [ ] Data safety section completed

### 8.2 Submission Steps

1. [ ] **Upload AAB File**
   - Use EAS Submit: `eas submit --platform android`
   - Or manually upload in Play Console
   - File: `.aab` format (not `.apk`)

2. [ ] **Complete Store Listing**
   - Fill in all required fields
   - Upload graphics
   - Add description

3. [ ] **Set Content Rating**
   - Complete questionnaire
   - Get rating certificate

4. [ ] **Set Pricing & Distribution**
   - Set as free
   - Select countries (or worldwide)
   - Set availability

5. [ ] **Review & Submit**
   - Review all information
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

1. **Privacy Policy** ⚠️ **CRITICAL**
   - Create privacy policy document
   - Host at publicly accessible URL
   - Add URL to Play Console

2. **Store Listing Graphics** ⚠️ **REQUIRED**
   - Feature graphic (1024×500px)
   - At least 2 screenshots (1080×1920px recommended)

3. **Production Build** ⚠️ **REQUIRED**
   - Build production AAB
   - Test on physical device
   - Verify all features work

4. **Content Rating** ⚠️ **REQUIRED**
   - Complete questionnaire
   - Get rating certificate

5. **Data Safety Section** ⚠️ **REQUIRED**
   - Declare data collection
   - Declare data usage
   - Declare data sharing

### ✅ **ALREADY COMPLETE:**

- ✅ App configuration (app.json)
- ✅ Package name (`com.todotomorrow.app`)
- ✅ App icon (512×512px)
- ✅ Splash screen
- ✅ EAS Build configuration
- ✅ Contact form (in-app support)

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
1. ⚠️ **Create Privacy Policy** (highest priority)
2. ⚠️ **Create Feature Graphic** (1024×500px)
3. ⚠️ **Capture Screenshots** (at least 2, recommended 4-6)
4. ✅ **Set up Google Play Developer Account** (if not done)
5. ✅ **Create app listing** in Play Console

**After Assets Ready:**
1. Build production AAB
2. Test on physical device
3. Complete store listing
4. Submit for review

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

