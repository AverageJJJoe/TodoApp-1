# Security & Privacy

## Authentication

**Magic Link Flow:**

```typescript
// auth/magicLink.ts
async function sendMagicLink(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${APP_URL}/auth/callback`
    }
  })

  if (error) throw error
}

async function verifyMagicLink(token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email'
  })

  if (error) throw error
  return data
}
```

## Data Protection

- All API calls use HTTPS/TLS 1.3
- RLS policies enforce user-level access control
- Optional at-rest encryption for sensitive fields
- GDPR data deletion and export functionality

---
