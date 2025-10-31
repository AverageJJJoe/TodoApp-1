# Story 1.6 Implementation Guide - Universal Links / App Links

## ✅ Completed Code Changes

All code changes have been completed:

1. **app.json** - Updated with Universal Links / App Links configuration:
   - iOS: Added `associatedDomains` with `applinks:todotomorrow.com`
   - Android: Added `intentFilters` for App Links with `https://todotomorrow.com/auth/callback`

2. **AuthScreen.tsx** - Updated deep link handler:
   - Now supports both custom scheme (`todotomorrow://auth/callback`) and Universal Links (`https://todotomorrow.com/auth/callback`)
   - Updated magic link API call to use `https://todotomorrow.com/auth/callback`

3. **Web Assets Created:**
   - `web-assets/auth/callback/index.html` - Redirect page
   - `web-assets/.well-known/apple-app-site-association` - iOS Universal Links file
   - `web-assets/.well-known/assetlinks.json` - Android App Links file
   - `web-assets/UPLOAD_INSTRUCTIONS.md` - Detailed upload guide

## 📋 Action Items for You

### 1. Upload Web Files to Cloudways ⚠️ REQUIRED

**Files to upload:**
- `web-assets/auth/callback/index.html` → `public_html/auth/callback/index.html`
- `web-assets/.well-known/apple-app-site-association` → `public_html/.well-known/apple-app-site-association` (NO .json extension)
- `web-assets/.well-known/assetlinks.json` → `public_html/.well-known/assetlinks.json`

**See:** `web-assets/UPLOAD_INSTRUCTIONS.md` for detailed step-by-step instructions.

**Quick Steps:**
1. Access Cloudways File Manager
2. Navigate to `public_html`
3. Create directories: `auth/callback/` and `.well-known/`
4. Upload the three files above

**Verify after upload:**
- ✅ `https://todotomorrow.com/auth/callback` loads the redirect page
- ✅ `https://todotomorrow.com/.well-known/apple-app-site-association` returns JSON
- ✅ `https://todotomorrow.com/.well-known/assetlinks.json` returns JSON

### 2. Update apple-app-site-association File ⚠️ REQUIRED

The file currently has `TEAM_ID` placeholder. You need to replace it with your Apple Team ID.

**How to get your Team ID:**
1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Your Team ID is shown in the top right (format: `ABCD1234EF`)

**Update the file on Cloudways:**
Replace `TEAM_ID.com.todotomorrow.app` with `YOUR_TEAM_ID.com.todotomorrow.app`

**File location on Cloudways:** `public_html/.well-known/apple-app-site-association`

### 3. Update assetlinks.json File ⚠️ REQUIRED (For Android)

The file currently has `REPLACE_WITH_SHA256_FINGERPRINT` placeholder. You need to replace it with your Android app signing certificate SHA-256 fingerprint.

**For Development/Debug builds:**
```bash
# Get debug keystore SHA-256
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android | grep SHA256
```

**For Production builds:**
```bash
# Get your production keystore SHA-256
keytool -list -v -keystore /path/to/your/production.keystore -alias your-key-alias
```

**Update the file on Cloudways:**
Replace `REPLACE_WITH_SHA256_FINGERPRINT` with your actual SHA-256 fingerprint (format: `AA:BB:CC:DD:...`)

**File location on Cloudways:** `public_html/.well-known/assetlinks.json`

**Note:** If you haven't created a production build yet, you can use the debug certificate fingerprint for testing.

### 4. Update Supabase Configuration ⚠️ REQUIRED

**Steps:**
1. Log in to [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to your project
3. Navigate to: **Authentication** → **URL Configuration**
4. In the **Redirect URLs** section, add:
   - `https://todotomorrow.com/auth/callback`
5. Optionally keep `todotomorrow://auth/callback` for backward compatibility (fallback)

**Why:** Supabase will now send magic link emails with the web URL instead of custom scheme.

### 5. Verify Content-Type Headers (If Needed)

If the `.well-known` files don't return JSON properly, you may need to configure Apache on Cloudways.

**Option: Create `.htaccess` file in `public_html`:**
```apache
<Files "apple-app-site-association">
    Header set Content-Type "application/json"
</Files>

<Files "assetlinks.json">
    Header set Content-Type "application/json"
</Files>
```

Or contact Cloudways support to configure MIME types for these files.

## 🧪 Testing Checklist

After completing the above steps:

### Pre-Testing Verification
- [ ] Redirect page loads: `https://todotomorrow.com/auth/callback`
- [ ] iOS file accessible: `https://todotomorrow.com/.well-known/apple-app-site-association`
- [ ] Android file accessible: `https://todotomorrow.com/.well-known/assetlinks.json`
- [ ] Files return JSON (check Content-Type header)
- [ ] Supabase redirect URL updated

### iOS Universal Links Testing
- [ ] Use [Branch.io AASA Validator](https://branch.io/resources/aasa-validator/) to verify `apple-app-site-association` file
- [ ] Send magic link email from app
- [ ] Click link in iOS Mail app → App should open automatically
- [ ] Click link in Gmail app (if on iOS) → App should open automatically
- [ ] Verify authentication completes successfully

### Android App Links Testing
- [ ] Use [Google App Links Tester](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://todotomorrow.com&relation=delegate_permission/common.handle_all_urls) to verify `assetlinks.json` file
- [ ] Send magic link email from app
- [ ] Click link in Gmail app → App should open automatically
- [ ] Click link in Android Email app → App should open automatically
- [ ] Verify authentication completes successfully

### Fallback Testing
- [ ] Uninstall app
- [ ] Click magic link → Should show "Open in app" page
- [ ] Click "Open in app" button → Should attempt to open app (may prompt to install)

## 📝 Notes

### iOS Universal Links
- Works on iOS 9+
- Requires Associated Domains capability (configured in `app.json`)
- File must be served over HTTPS
- File must have NO `.json` extension
- File must return `Content-Type: application/json`

### Android App Links
- Works on Android 6.0+
- Requires intent filters in manifest (configured in `app.json`)
- File must be served over HTTPS
- Requires app signing certificate SHA-256 fingerprint
- Android automatically verifies the link on install/first run

### Development Build Required
**Important:** Universal Links / App Links only work in:
- ✅ Development builds (EAS Build with profile)
- ✅ Production builds
- ❌ **NOT in Expo Go**

To test Universal Links / App Links, you'll need to create a development build:
```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

## 🐛 Troubleshooting

### Universal Links Not Working on iOS

1. **Verify file is accessible:**
   ```bash
   curl https://todotomorrow.com/.well-known/apple-app-site-association
   ```

2. **Check file format:**
   - Must be valid JSON
   - Must have correct bundle ID (with Team ID)
   - Must have correct paths

3. **Verify Associated Domains:**
   - Check `app.json` has `associatedDomains` configured
   - Rebuild app after adding Associated Domains

4. **Test on physical device:**
   - Universal Links don't work in simulator for some email clients

### App Links Not Working on Android

1. **Verify file is accessible:**
   ```bash
   curl https://todotomorrow.com/.well-known/assetlinks.json
   ```

2. **Check SHA-256 fingerprint:**
   - Must match your app's signing certificate
   - Format: `AA:BB:CC:DD:...` (colons required)

3. **Verify intent filters:**
   - Check `app.json` has `intentFilters` configured
   - `autoVerify: true` is required
   - Rebuild app after adding intent filters

4. **Check App Links verification:**
   - Use Google's App Links Tester tool
   - Android verifies on install/first run

### Redirect Page Not Working

1. **Check file location:**
   - Must be at: `public_html/auth/callback/index.html`

2. **Check file permissions:**
   - Should be 644 (readable)

3. **Test directly:**
   - Visit `https://todotomorrow.com/auth/callback?token=test&type=magiclink`
   - Should show redirect page

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all files are uploaded correctly
3. Verify all URLs are accessible
4. Check that Team ID and SHA-256 fingerprint are correct
5. Ensure you're testing on a development or production build (not Expo Go)

## ✅ Summary

Once you complete the 4 action items above:
1. ✅ Upload web files to Cloudways
2. ✅ Update `apple-app-site-association` with Team ID
3. ✅ Update `assetlinks.json` with SHA-256 fingerprint
4. ✅ Update Supabase redirect URL

The Universal Links / App Links authentication flow will be complete and ready for testing!

