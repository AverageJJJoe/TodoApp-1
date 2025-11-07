# Setting EAS Secrets for Production Builds

**IMPORTANT:** These commands set the secrets that EAS Build will use during production builds.

## Set/Update Supabase Secrets

**Your secrets already exist!** To update them with the new publishable key, run these commands **interactively** (they will prompt you):

```bash
# Update Supabase Publishable Key (IMPORTANT: Update to new publishable key!)
# When prompted, select the variable and confirm
eas env:update production --variable-name EXPO_PUBLIC_SUPABASE_ANON_KEY --variable-environment production --value "<YOUR_PUBLISHABLE_KEY>" --visibility sensitive --scope project

# Update Supabase URL (if needed)
eas env:update production --variable-name EXPO_PUBLIC_SUPABASE_URL --variable-environment production --value "https://zrnjxrtgrommlhexbpde.supabase.co" --visibility plaintext --scope project
```

**Alternative:** If update doesn't work, delete then create:
```bash
# Delete existing variable (select it when prompted)
eas env:delete production --variable-name EXPO_PUBLIC_SUPABASE_ANON_KEY --variable-environment production --scope project

# Create with new value
eas env:create production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<YOUR_PUBLISHABLE_KEY>" --scope project --visibility sensitive
```

**If secrets don't exist**, create them:
```bash
# Create Supabase URL
eas env:create production --name EXPO_PUBLIC_SUPABASE_URL --value "https://zrnjxrtgrommlhexbpde.supabase.co" --scope project --visibility plaintext

# Create Supabase Publishable Key
eas env:create production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "<YOUR_PUBLISHABLE_KEY>" --scope project --visibility sensitive
```

**Note:** The `eas secret:*` commands are deprecated. Use `eas env:*` commands instead. The `--force` flag will prompt you to confirm overwriting existing variables.

## Verify Secrets Are Set

```bash
eas secret:list
```

Or use the newer command:
```bash
eas env:list
```

## How It Works

1. **Local Development:**
   - Uses `.env` file (gitignored, safe)
   - Values: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`

2. **EAS Build (Production):**
   - Uses EAS secrets (set via `eas secret:create`)
   - Same variable names: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Secrets are encrypted and only available during build

3. **Committed Files:**
   - `app.config.js` - No hardcoded values ✅
   - `app.json` - No hardcoded values ✅
   - `.env` - Gitignored, safe ✅

## Security Benefits

- ✅ No secrets in git repository
- ✅ No secrets in git history
- ✅ GitGuardian won't flag these files
- ✅ Publishable key is safe to expose (by design), but best practice is to use env vars
- ✅ Secret key (`sb_secret_...`) is NEVER committed (only used server-side)

