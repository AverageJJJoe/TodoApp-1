# Apple App Store Launch Checklist

**Date Created:** 2025-01-27  
**App Name:** TodoTomorrow  
**Bundle ID:** `com.todotomorrow.app`  
**Status:** Pre-Launch Preparation

---

## ⚠️ CRITICAL: Version & Build Number Check Required Before Every Build

**💰 COST WARNING:** EAS Build credits cost money. Building with wrong version/build number wastes credits!

**Before ANY iOS build command, ALWAYS:**
1. Check App Store Connect for last uploaded build number
2. Increment build number (CFBundleVersion) - must be unique and incrementing
3. Update `version` (CFBundleShortVersionString) in `app.config.js` if needed
4. Ensure version format follows semantic versioning (e.g., "1.0.4")

**📚 Reference:** iOS uses both version (marketing version) and build number (technical version)

---

## Executive Summary

This document outlines all requirements and steps needed to successfully launch TodoTomorrow on the Apple App Store. Use this checklist to ensure nothing is missed before submission.

**Estimated Timeline:** 5-7 days for preparation + 1-3 days for Apple review = **6-10 days total**

**Key Differences from Android:**
- Requires Apple Developer Program membership ($99/year)
- TestFlight for testing (built-in, no separate track needed)
- More strict review process
- Requires certificates and provisioning profiles (handled by EAS)
- Different asset requirements (screenshots, app previews)

---

## 1. Apple Developer Account Setup

### 1.1 Apple Developer Program Membership

- [ ] **Enroll in Apple Developer Program** ⚠️ **REQUIRED FIRST STEP**
  - Cost: $99/year (recurring)
  - URL: https://developer.apple.com/programs/
  - Required: Apple ID, payment method, legal entity info
  - **Note:** Can take 24-48 hours for approval
  
- [ ] **Complete Developer Profile**
  - Organization name: "TodoTomorrow" (or your company name)
  - Contact information
  - Legal entity verification
  - Tax and banking information (if needed)

- [ ] **Accept Apple Developer Agreement**
  - Read and accept Apple Developer Program License Agreement
  - Review App Store Review Guidelines

### 1.2 App Store Connect Setup

- [ ] **Access App Store Connect**
  - URL: https://appstoreconnect.apple.com
  - Sign in with Apple Developer account
  - Complete initial setup if first time

- [ ] **Create New App**
  - App name: "TodoTomorrow"
  - Primary language: English (U.S.)
  - Bundle ID: `com.todotomorrow.app` (must match `app.config.js`)
  - SKU: Unique identifier (e.g., "todotomorrow-001")
  - User access: Full access or App Manager role

---

## 2. App Store Listing Requirements

### 2.1 Store Listing Details

**App Name:**
- [ ] **App Name:** "TodoTomorrow" (max 30 characters)
- [ ] **Subtitle:** Optional (max 30 characters)
  - Example: "Capture tasks, get them by email"

**Description:**
- [ ] **App Description:** (max 4000 characters)
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

**Keywords:**
- [ ] **Keywords:** (max 100 characters, comma-separated)
  - Example: "todo,task,productivity,email,morning,organize,reminder"

**Support URL:**
- [ ] **Support URL:** https://todotomorrow.com/support (or contact page)
  - Must be publicly accessible
  - Should include support email or contact form

**Marketing URL:** (Optional)
- [ ] **Marketing URL:** https://todotomorrow.com
  - Optional but recommended
  - Landing page for your app

**Privacy Policy URL:**
- [x] **Privacy Policy URL:** ✅ **COMPLETE**
  - URL: https://www.todotomorrow.com/privacy
  - Must be publicly accessible ✅
  - Required for all apps ✅

### 2.2 App Store Graphics & Media

**App Icon:**
- [x] **App Icon:** ✅ **CREATED**
  - File: `assets/icon.png`
  - Size: 1024×1024px (required for App Store)
  - Format: PNG (no transparency, no alpha channel)
  - **Note:** Must be exactly 1024×1024px for App Store
  - Status: Ready (verify size matches requirement)

**Screenshots:**
- [ ] **iPhone Screenshots:** ⚠️ **REQUIRED**
  - Minimum: 1 screenshot per device family
  - Maximum: 10 screenshots per device family
  - Required sizes:
    - **6.7" Display (iPhone 14 Pro Max, 15 Pro Max):** 1290×2796px
    - **6.5" Display (iPhone 11 Pro Max, XS Max):** 1242×2688px
    - **5.5" Display (iPhone 8 Plus):** 1242×2208px (optional, legacy)
  - Format: PNG or JPEG
  - **Recommended:** Start with 6.7" display screenshots
  - **Screenshots needed:**
    1. Auth screen (magic link entry)
    2. Main screen with tasks (active tab)
    3. Empty state (no tasks)
    4. Settings screen
    5. Archive view
    6. Dark mode screenshot (optional but nice)

- [ ] **iPad Screenshots:** (Optional but recommended)
  - Since `supportsTablet: true` is set, iPad screenshots are recommended
  - Sizes:
    - **12.9" iPad Pro:** 2048×2732px
    - **11" iPad Pro:** 1668×2388px
  - Format: PNG or JPEG

**App Preview Video:** (Optional but highly recommended)
- [ ] **App Preview Video:** Optional
  - Max length: 30 seconds
  - Format: MOV or MP4
  - Sizes: Same as screenshots (device-specific)
  - Purpose: Show app in action
  - **Note:** Can significantly improve conversion rates

### 2.3 Categorization & Content Rating

**App Category:**
- [ ] **Primary Category:** Productivity
- [ ] **Secondary Category:** (Optional) Lifestyle or Utilities

**Content Rating:**
- [ ] **Complete Content Rating Questionnaire**
  - Age-appropriate content
  - Violence, sexual content, etc.
  - Expected rating: "4+" (Everyone) - no objectionable content
  - **Note:** Apple's rating system is different from Google's

---

## 3. App Configuration & Build

### 3.1 App Configuration (app.config.js)

**Current Configuration:** ✅ **VERIFIED**
- ✅ Bundle ID: `com.todotomorrow.app`
- ✅ App name: "TodoTomorrow"
- ✅ Version: `1.0.4` (CFBundleShortVersionString)
- ✅ Icon: `./assets/icon.png`
- ✅ Splash screen: `./assets/splash.png`
- ✅ Supports tablet: `true`
- ✅ Associated Domains: `applinks:todotomorrow.com` ✅

**Action Items:**
- [ ] **Verify App Icon Size:** Ensure `assets/icon.png` is exactly 1024×1024px
- [ ] **Check Version Number:** Current version is `1.0.4` - verify this matches your release plan
- [ ] **Verify Bundle ID:** `com.todotomorrow.app` matches App Store Connect
- [ ] **Associated Domains:** Already configured ✅

### 3.2 EAS Build Configuration

**Current Configuration:** ✅ **VERIFIED**
- ✅ `eas.json` configured for iOS builds
- ✅ Development profile: Simulator builds enabled
- ✅ Preview profile: Device builds
- ✅ Production profile: App Store builds
- ✅ EAS project ID: `d9259efb-a198-4da8-9580-23e51504ac3b`

**Build Commands:**
```powershell
# ⚠️ CRITICAL: Check version/build number BEFORE building!
# See version check section above

# Create development build (for testing)
eas build --profile development --platform ios

# Create preview build (for TestFlight/internal testing)
eas build --profile preview --platform ios

# Create production build (for App Store submission)
eas build --profile production --platform ios

# Submit to App Store (after build completes)
eas submit --platform ios
```

**⚠️ MANDATORY PRE-BUILD CHECKLIST:**
- [ ] Check App Store Connect for last uploaded build number
- [ ] Increment build number (must be higher than last upload)
- [ ] Update version in `app.config.js` if needed
- [ ] Verify bundle ID matches App Store Connect
- [ ] Verify all EAS secrets are set (see below)

**Pre-Build Checklist:**
- [x] **Environment Variables:** ✅ Verify all secrets are in EAS secrets
  - `EXPO_PUBLIC_SUPABASE_URL` ✅
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY` ✅
  - Any other required env vars ✅

- [ ] **Apple Credentials:** ⚠️ **REQUIRED FOR FIRST BUILD**
  - EAS will prompt for Apple ID credentials
  - EAS manages certificates and provisioning profiles automatically
  - **First time:** You'll need to provide Apple ID and app-specific password
  - **Note:** EAS handles all certificate/provisioning profile management

### 3.3 Apple Certificates & Provisioning Profiles

**EAS Build Automatic Management:** ✅ **AUTOMATIC**
- EAS Build automatically handles:
  - Distribution certificates
  - Provisioning profiles
  - Code signing
- **You don't need to manually create certificates!**

**Action Items:**
- [ ] **First Build Setup:**
  - EAS will prompt for Apple ID credentials
  - Create app-specific password: https://appleid.apple.com → Sign-In and Security → App-Specific Passwords
  - EAS will automatically create necessary certificates and profiles

- [ ] **Verify Credentials:**
  - Ensure Apple Developer account is active
  - Ensure bundle ID is registered in App Store Connect
  - EAS will handle the rest automatically

---

## 4. Legal & Policy Documents

### 4.1 Privacy Policy ✅ **COMPLETE**

**Status:** ✅ **CREATED AND LIVE**

**Privacy Policy URL:** https://www.todotomorrow.com/privacy

**Requirements:** ✅ **ALL MET**
- ✅ Must be publicly accessible URL
- ✅ Covers data collection, usage, sharing
- ✅ Includes user rights and contact information
- ✅ Required for App Store submission ✅

**Action Items:**
- [x] **Create Privacy Policy document** ✅ **COMPLETE**
  - Hosted at: https://www.todotomorrow.com/privacy
- [ ] **Add Privacy Policy link to app** (Optional enhancement)
  - Settings screen → ABOUT section → Privacy Policy row
  - Currently shown in design but not implemented (Story 6.2)
  - **Note:** Not required for App Store submission, but nice UX enhancement

### 4.2 Terms of Service (Optional but Recommended)

**Status:** ⚠️ **NOT CREATED** - Recommended but not required

**Action Items:**
- [ ] **Create Terms of Service document** (optional)
  - Host at: `https://todotomorrow.com/terms`
  - Cover: Usage terms, user responsibilities, service availability
- [ ] **Add Terms link to app** (if created)
  - Settings screen → ABOUT section → Terms of Use row

### 4.3 Export Compliance

**Export Compliance Information:**
- [ ] **Complete Export Compliance Questionnaire**
  - Required for all apps
  - Questions about encryption, military use, etc.
  - Most apps: "No" to encryption questions (using standard HTTPS)
  - **Note:** Standard HTTPS/TLS doesn't require export compliance

---

## 5. Store Listing Assets

### 5.1 Required Graphics

**App Icon:** ✅ **CREATED**
- File: `assets/icon.png`
- Size: **1024×1024px** (REQUIRED - verify this!)
- Format: PNG (no transparency, no alpha channel)
- Status: Ready (verify size matches requirement)

**Screenshots:** ⚠️ **REQUIRED - NEED TO CREATE**
- Minimum: 1 screenshot per device family
- Maximum: 10 screenshots per device family
- **Required sizes:**
  - **6.7" Display (iPhone 14 Pro Max, 15 Pro Max):** 1290×2796px
  - **6.5" Display (iPhone 11 Pro Max, XS Max):** 1242×2688px
- Format: PNG or JPEG
- **How to create:**
  1. Use iPhone device or simulator
  2. Take screenshots at required resolution
  3. Or use design tool to create mockups

**Screenshot Checklist:**
- [ ] Auth screen (magic link entry)
- [ ] Main screen with tasks (active tab)
- [ ] Empty state (no tasks)
- [ ] Settings screen
- [ ] Archive view
- [ ] Dark mode screenshot (optional but nice)

**iPad Screenshots:** (Optional but recommended)
- [ ] 12.9" iPad Pro screenshots (2048×2732px)
- [ ] 11" iPad Pro screenshots (1668×2388px)

### 5.2 Promotional Assets (Optional)

**App Preview Video:** Optional but highly recommended
- Max length: 30 seconds
- Format: MOV or MP4
- Sizes: Same as screenshots (device-specific)
- Purpose: Show app in action
- **Note:** Can significantly improve conversion rates

---

## 6. Pricing & Monetization

### 6.1 App Pricing

**Current Plan:** ✅ **FREE APP**
- App is free to download
- In-app purchases: Not yet implemented (deferred)
- Future: One-time purchase for premium features

**Action Items:**
- [ ] **Set App as Free** in App Store Connect
- [ ] **Declare In-App Purchases** (if planning to add)
  - Currently: None
  - Future: One-time purchase products

### 6.2 Monetization Strategy

**From PRD:**
- Launch: Free (to maximize adoption)
- Future: Freemium with tiered pricing
- Payment: App Store In-App Purchase (30% commission, 15% after year 1 for subscriptions)

**Action Items:**
- [ ] **Plan In-App Purchase Products** (for future)
  - Product IDs
  - Pricing tiers
  - Feature differentiation

---

## 7. Testing & Quality Assurance

### 7.1 TestFlight Testing (Internal)

**TestFlight Setup:**
- [ ] **Enable TestFlight in App Store Connect**
  - Automatic when you create an app
  - No additional setup needed

**Internal Testing:**
- [ ] **Add Internal Testers**
  - Add up to 100 internal testers (team members)
  - Add your Apple ID and family members' Apple IDs
  - They can test immediately after build upload

**Build Process:**
1. [ ] **Create Preview/Development Build**
   ```powershell
   eas build --profile preview --platform ios
   ```
   - This creates a build suitable for TestFlight
   - Build will be available in App Store Connect

2. [ ] **Upload to TestFlight** (Automatic with EAS Submit)
   ```powershell
   eas submit --platform ios
   ```
   - EAS automatically uploads to TestFlight
   - Or manually upload via App Store Connect

3. [ ] **Distribute to Internal Testers**
   - Go to App Store Connect → TestFlight
   - Select build → Add to Internal Testing
   - Testers receive email invitation
   - They install TestFlight app, then your app

4. [ ] **Test on Physical Devices** ⚠️ **REQUIRED**
   - Install TestFlight app on iPhone/iPad
   - Accept invitation
   - Install TodoTomorrow from TestFlight
   - Test all features thoroughly:
     - [ ] Authentication flow (magic link)
     - [ ] Task creation
     - [ ] Task completion
     - [ ] Task deletion
     - [ ] Task editing
     - [ ] Email delivery (test email)
     - [ ] Settings screen
     - [ ] Dark mode toggle
     - [ ] Archive view
     - [ ] Workflow mode switching
     - [ ] Universal Links (email links)

5. [ ] **Test Edge Cases:**
   - [ ] No internet connection
   - [ ] Slow internet connection
   - [ ] App backgrounding/foregrounding
   - [ ] Deep link handling
   - [ ] Universal Links (email links)
   - [ ] Different iOS versions (iOS 13+)
   - [ ] Different device sizes (iPhone SE to iPhone Pro Max)

### 7.2 TestFlight Testing (External - Optional)

**External Testing:** (Optional, for broader testing)
- [ ] **Create External Test Group**
  - Add external testers (up to 10,000)
  - Requires App Store review (faster than production review)
  - Good for beta testing with real users

**Action Items:**
- [ ] **Submit for External Testing** (if desired)
  - Complete TestFlight information
  - Add testers
  - Submit for review
  - Review typically takes 24-48 hours

---

## 8. Submission Process

### 8.1 Pre-Submission Checklist

**Before Submitting:**
- [ ] All store listing fields completed
- [ ] Privacy policy URL added and accessible ✅ (https://www.todotomorrow.com/privacy)
- [ ] Content rating completed
- [ ] Screenshots uploaded (minimum 1 per device family) ⚠️ **NEED TO CREATE**
- [ ] App icon uploaded ✅ (verify 1024×1024px)
- [ ] Production build created and tested ⚠️ **NEXT STEP**
- [ ] TestFlight testing completed ⚠️ **REQUIRED**
- [ ] Export compliance completed
- [ ] Support URL provided

### 8.2 Submission Steps

1. [ ] **Test Production Build via TestFlight** ⚠️ **DO THIS FIRST**
   - Create production build:
     ```powershell
     eas build --profile production --platform ios
     ```
   - Upload to TestFlight:
     ```powershell
     eas submit --platform ios
     ```
   - Test thoroughly on physical devices
   - Verify no crashes or critical bugs
   - **Note:** You can test production builds in TestFlight before submitting to App Store

2. [ ] **Complete App Store Listing** ⚠️ **REQUIRED**
   - Fill in all required fields in App Store Connect
   - Upload screenshots
   - Add description, keywords, support URL
   - Set pricing (free)
   - Complete content rating

3. [ ] **Prepare App Store Version**
   - Go to App Store Connect → Your App → App Store tab
   - Click "+" to create new version
   - Enter version number (e.g., "1.0.4")
   - Fill in "What's New in This Version" (release notes)
     - Example: "Initial release of TodoTomorrow - Capture tasks on the go and get them delivered to your inbox every morning."

4. [ ] **Upload Build** ⚠️ **READY TO DO**
   - **Option A:** Use EAS Submit (recommended):
     ```powershell
     eas submit --platform ios
     ```
     - EAS automatically uploads to App Store Connect
   - **Option B:** Manually upload in App Store Connect:
     - Go to App Store Connect → Your App → TestFlight
     - Select build → Add to App Store version
   - **Note:** Build must be processed by Apple (can take 10-30 minutes)

5. [ ] **Select Build for App Store Version**
   - In App Store Connect → App Store tab → Version
   - Select the build you want to submit
   - Build must be processed (status: "Ready to Submit")

6. [ ] **Complete App Information**
   - Review all information one final time
   - Verify privacy policy link works: https://www.todotomorrow.com/privacy
   - Check release notes
   - Verify screenshots are correct
   - Verify app icon is correct

7. [ ] **Add Demo Account (Required for Apps with Authentication)** ⚠️ **REQUIRED**
   - **Demo Account Email:** _To be determined_
   - **Demo Account Instructions:** _To be determined_
   - **Location:** App Store Connect → Your App → App Information → Demo Account
   - **Status:** ⏸️ **DEFERRED** (Story 7.10 was scrapped - alternative approach needed)

8. [ ] **Submit for Review** ⚠️ **FINAL STEP**
   - Click "Submit for Review" button
   - Answer any additional questions
   - Submit
   - Status will change to "Waiting for Review"

### 8.3 Post-Submission

**Review Timeline:**
- Typical: 24-48 hours
- Can be faster (hours) or slower (up to 7 days)
- Apple will email when review is complete
- You can check status in App Store Connect

**Possible Outcomes:**
- ✅ **Approved:** App goes live (or scheduled release)
- ⚠️ **Rejected:** Fix issues and resubmit
- 📝 **In Review:** Waiting for Apple review
- 🔄 **Pending Developer Release:** Approved, waiting for you to release

**Common Rejection Reasons:**
- Missing or broken privacy policy link
- App crashes or bugs
- Missing required information
- Guideline violations
- **Note:** Apple provides detailed feedback if rejected

---

## 9. Post-Launch Considerations

### 9.1 Monitoring & Analytics

**Set Up Monitoring:**
- [ ] **App Store Connect Analytics**
  - Monitor downloads
  - Track crashes (if enabled)
  - Review user ratings and reviews
- [ ] **App Performance Monitoring**
  - Monitor API response times
  - Track email delivery success rates
  - Monitor app crashes (consider Sentry or similar)

### 9.2 User Support

**Support Channels:**
- [ ] **Support Email:** support@todotomorrow.com (configured in Story 7.5)
- [ ] **In-App Contact Form:** ✅ Implemented (Story 7.5)
- [ ] **App Store Support:** Respond to user reviews
- [ ] **Support URL:** https://todotomorrow.com/support (add to App Store listing)

### 9.3 Updates & Maintenance

**Update Strategy:**
- [ ] **Plan First Update** (bug fixes, improvements)
- [ ] **Set Update Schedule** (monthly or as needed)
- [ ] **Monitor User Feedback** (reviews, support emails)
- [ ] **Track App Store Connect Metrics**
  - Downloads, ratings, reviews
  - Crash reports (if enabled)

---

## 10. Critical Path Items

### ⚠️ **MUST COMPLETE BEFORE SUBMISSION:**

1. **Apple Developer Program Membership** ⚠️ **REQUIRED FIRST STEP**
   - Enroll in Apple Developer Program ($99/year)
   - Wait for approval (24-48 hours)
   - Complete account setup

2. **Create App in App Store Connect** ⚠️ **REQUIRED**
   - Create new app with bundle ID `com.todotomorrow.app`
   - Complete basic app information

3. **Create Screenshots** ⚠️ **REQUIRED**
   - Minimum 1 screenshot per device family
   - Recommended: 6.7" iPhone screenshots (1290×2796px)
   - Create screenshots showing key features

4. **Test Production Build via TestFlight** ⚠️ **REQUIRED**
   - Build production iOS app
   - Upload to TestFlight
   - Test on physical iPhone/iPad devices
   - Test all features thoroughly
   - Verify no crashes or critical bugs

5. **Complete App Store Listing** ⚠️ **REQUIRED**
   - Fill in description, keywords, support URL
   - Upload screenshots
   - Complete content rating
   - Add privacy policy URL

6. **Submit for Review** ⚠️ **FINAL STEP**
   - Upload build to App Store Connect
   - Complete all required information
   - Submit for Apple review

### ✅ **ALREADY COMPLETE:**

- ✅ App configuration (app.config.js)
- ✅ Bundle ID (`com.todotomorrow.app`)
- ✅ App icon (verify 1024×1024px size)
- ✅ Splash screen
- ✅ EAS Build configuration
- ✅ Privacy Policy (https://www.todotomorrow.com/privacy)
- ✅ Associated Domains configured (Universal Links)
- ✅ Contact form (in-app support)
- ✅ Compliance requirements (privacy policy)

---

## 11. Timeline Estimate

**Preparation Phase (5-7 days):**
- Day 1: Enroll in Apple Developer Program, wait for approval
- Day 2: Create app in App Store Connect, complete basic info
- Day 3: Create screenshots, prepare store listing assets
- Day 4: Build production app, upload to TestFlight
- Day 5: Test thoroughly on physical devices
- Day 6: Complete App Store listing, fill in all details
- Day 7: Final review, submit for Apple review

**Review Phase (1-3 days):**
- Apple review: 24-48 hours typical
- Possible revisions: +1-2 days if changes needed

**Total:** 6-10 days from start to live

---

## 12. Resources & References

**Apple Developer:**
- Apple Developer Portal: https://developer.apple.com
- App Store Connect: https://appstoreconnect.apple.com
- Apple Developer Program: https://developer.apple.com/programs/

**Documentation:**
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect Help: https://help.apple.com/app-store-connect/
- EAS Build iOS: https://docs.expo.dev/build/introduction/
- EAS Submit iOS: https://docs.expo.dev/submit/introduction/

**Tools:**
- Screenshot Tools: iPhone Simulator, physical device, design tools
- App Preview: Screen recording on iPhone
- TestFlight: Built into App Store Connect

---

## 13. Next Steps

**Immediate Actions:**

1. ⚠️ **Enroll in Apple Developer Program** (FIRST STEP - HIGH PRIORITY)
   - Go to: https://developer.apple.com/programs/
   - Cost: $99/year
   - Wait for approval (24-48 hours)
   - **Note:** Cannot proceed without this!

2. ⚠️ **Create App in App Store Connect** (After Developer Program approval)
   - Go to: https://appstoreconnect.apple.com
   - Create new app
   - Bundle ID: `com.todotomorrow.app`
   - Complete basic information

3. ⚠️ **Create Screenshots** (REQUIRED - HIGH PRIORITY)
   - Use iPhone device or simulator
   - Create screenshots at required resolution:
     - 6.7" Display: 1290×2796px
   - Screenshots needed:
     - Auth screen
     - Main screen with tasks
     - Empty state
     - Settings screen
     - Archive view
   - **Tip:** Use iPhone Simulator or physical device to capture

4. ⚠️ **Build Production iOS App** (After screenshots ready)
   ```powershell
   # ⚠️ CRITICAL: Check version/build number BEFORE building!
   # Verify version in app.config.js is correct
   
   eas build --profile production --platform ios
   ```
   - Build will take 15-30 minutes
   - EAS will handle certificates/provisioning profiles automatically
   - First build: You'll need to provide Apple ID credentials

5. ⚠️ **Upload to TestFlight** (After build completes)
   ```powershell
   eas submit --platform ios
   ```
   - Or manually upload via App Store Connect
   - Build will be processed by Apple (10-30 minutes)

6. ⚠️ **Test on Physical Devices** (REQUIRED - HIGH PRIORITY)
   - Install TestFlight app on iPhone/iPad
   - Accept invitation (if internal tester)
   - Install TodoTomorrow from TestFlight
   - Test all features thoroughly:
     - Authentication (magic link)
     - Task CRUD operations
     - Email delivery
     - Settings & dark mode
     - Archive view
     - Universal Links (email links)
   - Test on multiple devices if possible
   - Verify no crashes or critical bugs

7. ⚠️ **Complete App Store Listing** (After testing passes)
   - Fill in description, keywords, support URL
   - Upload screenshots
   - Complete content rating
   - Add privacy policy URL: https://www.todotomorrow.com/privacy
   - Set pricing (free)

8. ⚠️ **Submit for Apple Review** (Final step)
   - Create new version in App Store Connect
   - Select build
   - Complete all required information
   - Submit for review

**Status Summary:**
- ⚠️ **Apple Developer Program:** Not enrolled (REQUIRED FIRST STEP)
- ⚠️ **App Store Connect:** Not created (after Developer Program)
- ⚠️ **Screenshots:** Not created (REQUIRED)
- ✅ **App Configuration:** Complete (bundle ID, version, etc.)
- ✅ **Privacy Policy:** Complete (https://www.todotomorrow.com/privacy)
- ⚠️ **Testing:** Not started (requires build first)
- ⚠️ **Submission:** Not started (requires testing first)

---

## 14. iOS-Specific Considerations

### 14.1 Universal Links

**Status:** ✅ **CONFIGURED**
- Associated Domains: `applinks:todotomorrow.com` ✅
- File: `apple-app-site-association` on server ✅
- **Action:** Verify Team ID is set in `apple-app-site-association` file

**Action Items:**
- [ ] **Verify Team ID in apple-app-site-association**
  - File location: `web-assets/.well-known/apple-app-site-association`
  - Replace `TEAM_ID` with your actual Apple Team ID
  - Upload to server: `https://todotomorrow.com/.well-known/apple-app-site-association`
  - **Note:** Get Team ID from Apple Developer Portal (top right)

### 14.2 App Store Review Guidelines

**Key Points:**
- App must function as described
- No crashes or bugs
- Privacy policy must be accessible
- App must comply with all guidelines
- **Note:** Apple's review is more strict than Google's

**Common Issues to Avoid:**
- Broken links (privacy policy, support)
- App crashes
- Missing required information
- Guideline violations

### 14.3 Version & Build Number Management

**iOS Versioning:**
- **Version (CFBundleShortVersionString):** Marketing version (e.g., "1.0.4")
- **Build Number (CFBundleVersion):** Technical version (must increment, e.g., "1", "2", "3")

**Rules:**
- Version can stay same for multiple builds (bug fixes)
- Build number must always increment
- Each App Store submission needs unique build number

**Current Status:**
- Version: `1.0.4` (in `app.config.js`)
- Build Number: Managed by EAS (auto-increments)

---

## Notes

- **App Name:** TodoTomorrow (consistent across all platforms)
- **Bundle ID:** `com.todotomorrow.app` (already configured)
- **Version:** 1.0.4 (initial iOS release)
- **Monetization:** Free app (in-app purchases deferred to post-launch)
- **Target Audience:** Productivity app users, busy professionals

**Questions or Issues?**
- Review this checklist regularly
- Update status as items are completed
- Document any blockers or questions
- Apple Developer Support: https://developer.apple.com/support/

---

## Quick Reference: Build & Submit Commands

```powershell
# 1. Check version/build number first!
# Verify app.config.js has correct version

# 2. Build production iOS app
eas build --profile production --platform ios

# 3. Upload to TestFlight/App Store Connect
eas submit --platform ios

# 4. Test in TestFlight (install TestFlight app, accept invitation)

# 5. Submit for App Store review (via App Store Connect web interface)
```

**Remember:**
- Always check version/build number before building
- Test thoroughly in TestFlight before submitting
- Apple review can take 24-48 hours
- Be prepared to fix issues if rejected

