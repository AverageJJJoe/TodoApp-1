# Cloudways Upload Instructions

## Files to Upload

Upload the following files to your Cloudways server's `public_html` directory:

### Directory Structure on Cloudways

```
public_html/
├── auth/
│   └── callback/
│       └── index.html          (redirect page)
└── .well-known/
    ├── apple-app-site-association   (iOS Universal Links - NO .json extension)
    └── assetlinks.json              (Android App Links)
```

## Step-by-Step Upload Process

### Option 1: Using Cloudways File Manager (Recommended)

1. **Access File Manager:**
   - Log in to Cloudways Dashboard
   - Go to your **Application** → **File Manager**
   - Navigate to `public_html` directory (this is your web root)

2. **Create Directory Structure:**
   - Create folder: `auth`
   - Inside `auth`, create folder: `callback`
   - Create folder: `.well-known` (note the dot at the beginning)

3. **Upload Files:**
   - Upload `index.html` to `public_html/auth/callback/`
   - Upload `apple-app-site-association` (NO extension) to `public_html/.well-known/`
   - Upload `assetlinks.json` to `public_html/.well-known/`

4. **Important: Verify File Permissions:**
   - Files should be readable (644 permissions)
   - `.well-known` directory should be accessible (755 permissions)

### Option 2: Using SFTP

1. **Get SFTP Credentials:**
   - Cloudways Dashboard → **Application** → **Access Details**
   - Note your SFTP host, username, and password

2. **Connect via SFTP Client:**
   - Use FileZilla, WinSCP, or similar
   - Connect to your Cloudways server
   - Navigate to `public_html`

3. **Upload Files:**
   - Create the directory structure as shown above
   - Upload all files maintaining the exact structure

## Critical Configuration Steps

### 1. apple-app-site-association File

**IMPORTANT:** This file must:
- Have NO file extension (not `.json`)
- Be served with `Content-Type: application/json` header
- Be accessible at: `https://todotomorrow.com/.well-known/apple-app-site-association`
- Return status 200 (not 404)

**Cloudways Apache Configuration:**
If the file isn't accessible, you may need to add this to your `.htaccess` file in `public_html`:

```apache
<Files "apple-app-site-association">
    Header set Content-Type "application/json"
</Files>
```

### 2. assetlinks.json File

**IMPORTANT:** This file must:
- Be served with `Content-Type: application/json` header
- Be accessible at: `https://todotomorrow.com/.well-known/assetlinks.json`
- Have the correct SHA-256 fingerprint (see below)

**Before uploading, you must:**
1. Replace `REPLACE_WITH_SHA256_FINGERPRINT` in `assetlinks.json` with your actual Android app signing certificate SHA-256 fingerprint
2. If you haven't generated a production build yet, use a development/debug certificate fingerprint for testing

### 3. Verify File Access

After uploading, test these URLs in your browser:
- `https://todotomorrow.com/auth/callback` → Should show the redirect page
- `https://todotomorrow.com/.well-known/apple-app-site-association` → Should show JSON (iOS file)
- `https://todotomorrow.com/.well-known/assetlinks.json` → Should show JSON (Android file)

### 4. Content-Type Headers

If the `.well-known` files don't show as JSON in the browser:
- Check that Cloudways is serving them with `Content-Type: application/json`
- You may need to add `.htaccess` rules (see above)

## Next Steps

After uploading files:
1. ✅ Test redirect page loads correctly
2. ✅ Verify `.well-known` files are accessible
3. ✅ Update Android `assetlinks.json` with SHA-256 fingerprint
4. ✅ Update iOS `apple-app-site-association` with your Apple Team ID
5. ✅ Test Universal Links on iOS device
6. ✅ Test App Links on Android device

## Troubleshooting

**Files not accessible?**
- Check file permissions (should be 644)
- Check directory permissions (should be 755)
- Verify you're in the correct `public_html` directory

**Content-Type wrong?**
- Add `.htaccess` rules (see above)
- Or contact Cloudways support to configure MIME types

**Universal/App Links not working?**
- Verify files are accessible over HTTPS
- Check file format (JSON, correct structure)
- Verify bundle ID / package name matches app configuration
- Use verification tools:
  - iOS: https://branch.io/resources/aasa-validator/
  - Android: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://todotomorrow.com&relation=delegate_permission/common.handle_all_urls

