# Debugging "Invalid API key" Error

## Current Status
- Error: `AuthApiError: Invalid API key` in production build
- Both `app.config.js` and `app.json` have hardcoded fallback values
- Debug logging added to `src/lib/supabase.ts`

## Next Steps

### 1. Rebuild with Debug Logging
The updated `src/lib/supabase.ts` now logs:
- Whether `expoConfig` exists
- Whether `extra` exists  
- The Supabase URL (first 30 chars)
- The API key (first 20 chars)
- Full `extra` object

**Rebuild command:**
```bash
eas build --platform android --profile production
```

### 2. Check Logs After Rebuild
After installing the new build, check logs for:
```
Supabase Config Debug: { ... }
```

This will show what values are actually being read.

### 3. Possible Issues to Check

**Issue A: Config Not Being Embedded**
- If logs show `MISSING` for URL or key
- Solution: May need to ensure `app.config.js` is being processed correctly

**Issue B: API Key Expired/Invalid**
- If logs show values but still get "Invalid API key"
- Solution: Verify API key in Supabase Dashboard → Project Settings → API

**Issue C: Wrong API Key Being Used**
- If logs show different values than expected
- Solution: Check if EAS secrets are overriding (even if empty, might be setting undefined)

### 4. Verify API Key in Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/zrnjxrtgrommlhexbpde/settings/api
2. Check the `anon` / `public` key
3. Compare with the key in `app.config.js` (line 32)

### 5. Alternative: Set EAS Secrets (Recommended)
Even though we have fallbacks, setting EAS secrets ensures they're used:

```bash
# Set Supabase URL
eas secret:create --name EXPO_PUBLIC_SUPABASE_URL --value "https://zrnjxrtgrommlhexbpde.supabase.co" --scope project --type string

# Set Supabase Anon Key  
eas secret:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo" --scope project --type string
```

## Current Configuration

**app.config.js (line 31-32):**
```javascript
supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "https://zrnjxrtgrommlhexbpde.supabase.co",
supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo",
```

**app.json (line 19-20):**
```json
"supabaseUrl": "https://zrnjxrtgrommlhexbpde.supabase.co",
"supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpybmp4cnRncm9tbWxoZXhicGRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4ODc2OTQsImV4cCI6MjA3NzQ2MzY5NH0.8Ci--doOpAqx9FRGLH_cIF4E4xPHIKszlwp0DorSvOo",
```

Both match ✅

