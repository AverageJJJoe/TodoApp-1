# Android White Screen Fix

## The Problem
After clicking the magic link email on Android, you see a white screen instead of the app opening.

## Why This Happens

### Android App Links Should Intercept Automatically
When Android App Links are properly configured and verified, Android should intercept the `https://todotomorrow.com/auth/callback` URL **before it even reaches the browser**. You shouldn't see the web page at all.

If you're seeing a white screen, it means:
1. **App Links aren't verified** - Android hasn't verified the `assetlinks.json` file yet
2. **App not installed** - The app needs to be installed for App Links to work
3. **JavaScript error** - The redirect page has an error (less likely)

## Quick Fixes

### Fix 1: Verify App Links Are Working

**Test App Links Verification:**
1. Open Chrome on your Android device
2. Visit: `https://todotomorrow.com/.well-known/assetlinks.json`
3. Verify it shows your JSON file correctly

**Use Google's Verification Tool:**
Visit this URL in Chrome (on desktop or Android):
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://todotomorrow.com&relation=delegate_permission/common.handle_all_urls
```

**Expected Result:**
Should show a JSON response with your app package and fingerprint if verified.

**If Not Verified:**
- Check that `assetlinks.json` is accessible
- Verify SHA-256 fingerprint matches your app's signing certificate
- Wait a few minutes after installing/updating the app (Android verifies on install)

### Fix 2: Force Android to Re-verify App Links

**On Android Device:**
1. Go to **Settings** → **Apps** → **TodoTomorrow** (or your app name)
2. Tap **Open by default** or **Set as default**
3. Tap **Add link** or **Supported links**
4. Verify `https://todotomorrow.com` is listed and enabled
5. If not listed, Android hasn't verified App Links yet

**Alternative Method:**
1. Uninstall the app
2. Reinstall the app
3. Android will verify App Links on first install

### Fix 3: Use Custom Scheme Fallback (Updated Redirect Page)

I've updated the redirect page to use custom scheme (`todotomorrow://`) as the primary method for Android, which is more reliable than waiting for App Links to verify.

**The updated page now:**
- Detects Android devices
- Immediately redirects to `todotomorrow://auth/callback?token=...`
- Shows a fallback button if the redirect doesn't work

**Upload the updated file:**
The file `web-assets/auth/callback/index.html` has been updated. Upload it to Cloudways at:
- `public_html/auth/callback/index.html`

### Fix 4: Test Direct Deep Link

**To verify your app can receive deep links:**
1. In Chrome on Android, type: `todotomorrow://auth/callback?token=test123&type=magiclink`
2. If a dialog appears asking to open the app, tap "Open"
3. This confirms deep link handling works

If this works, the issue is with the redirect page. If it doesn't work, the issue is with your app's deep link configuration.

## Testing Steps

### Step 1: Verify Files Are Uploaded
- ✅ `https://todotomorrow.com/auth/callback` loads the redirect page (not 404)
- ✅ `https://todotomorrow.com/.well-known/assetlinks.json` returns JSON

### Step 2: Verify App Links
- ✅ Google verification tool shows your app (see Fix 1)
- ✅ Android device shows app can handle links (see Fix 2)

### Step 3: Test Magic Link Flow
1. Request a new magic link from the app
2. Click the link in Gmail/Email app
3. **Expected:** App opens immediately (or redirect page briefly shows then app opens)
4. **If white screen:** See troubleshooting below

## Troubleshooting

### White Screen with No Content
**Possible Causes:**
- JavaScript error preventing page from rendering
- Redirect happening too fast (page loads then immediately redirects)
- Browser security blocking redirect

**Solution:**
1. Upload the updated `index.html` file (uses custom scheme for Android)
2. Try opening the redirect URL directly: `https://todotomorrow.com/auth/callback?token=test&type=magiclink`
3. If you see content, the page works - the issue is with the redirect flow

### App Links Not Verified
**Symptoms:**
- Android doesn't show app as handler for `todotomorrow.com` links
- Google verification tool doesn't show your app

**Solutions:**
1. Wait 5-10 minutes after installing app (Android verifies on install)
2. Reinstall the app to trigger verification
3. Check `assetlinks.json` SHA-256 fingerprint matches your app
4. Verify file is accessible over HTTPS without errors

### App Opens But Authentication Fails
**Different issue** - Deep link is working, but token verification fails.

**Check:**
- Token isn't expired (request fresh magic link)
- Deep link handler in app is receiving the URL correctly
- Check app console/logs for error messages

## What I've Fixed

I've updated the redirect page to:
1. ✅ Use custom scheme (`todotomorrow://`) as primary method for Android (more reliable)
2. ✅ Add better error handling and visibility
3. ✅ Show fallback button if redirect doesn't work
4. ✅ Detect if page is still visible (app didn't open) and show button

## Next Steps

1. **Upload updated file:** Upload the new `web-assets/auth/callback/index.html` to Cloudways
2. **Test again:** Request a new magic link and click it
3. **Check result:**
   - ✅ App opens immediately → Success!
   - ⚠️ White screen → Check JavaScript console in browser
   - ⚠️ Redirect page shows → Click "Open in App" button

If it still doesn't work, let me know and I'll help debug further!

