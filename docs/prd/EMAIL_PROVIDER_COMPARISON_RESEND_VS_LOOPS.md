# Email Provider Comparison: Resend vs Loops - Correct Usage Strategy

## Overview

This document explains the correct email provider strategy for TodoTomorrow: **Resend for transactional emails** (critical) and **Loops API for lifecycle/marketing emails** (non-critical). This split protects deliverability, optimizes costs, and uses each provider for its strength.

---

## Current Email Provider Strategy (CORRECTED)

### Resend (Transactional - CRITICAL)
- **Purpose:** Transactional emails (product-critical, time-sensitive)
- **Magic Link Authentication:** Via Supabase SMTP (configured in Supabase Dashboard → Auth → SMTP)
- **Daily Task Batch Emails:** Via Edge Functions API (`supabase/functions/send-daily-emails`)
- **Status:** ✅ Active and working
- **Usage:** 
  - Magic link authentication emails (MUST be reliable, time-sensitive)
  - Daily email digest of tasks to users (core product feature)
- **Why Resend:** Built for transactional emails - fast, reliable, simple

### Loops API (Lifecycle/Marketing - NON-CRITICAL)
- **Purpose:** Lifecycle/marketing emails (nice-to-have, engagement)
- **Integration:** Loops API calls from app code or Edge Functions
- **Status:** 🔄 In Progress (Epic 8, Story 8.4)
- **Usage:** 
  - Welcome emails (sent after signup)
  - Day 3 "no tasks" nudge (re-engagement)
  - Day 5 inactivity email (re-engagement)
- **Why Loops:** Built for marketing automation - sequences, segments, campaigns

---

## Comparison: Resend vs Loops (Correct Usage)

### Setup Complexity

| Aspect | Resend (SMTP + API) | Loops (API) |
|--------|---------------------|-------------|
| **Setup Method** | SMTP: Manual config in Supabase dashboard<br>API: Direct API calls | API: Direct API calls from app code |
| **Configuration Steps** | SMTP: 5-7 steps<br>API: Import and use | API: 2-3 steps (get API key, add code) |
| **Time Required** | SMTP: 15-20 minutes<br>API: Already configured | API: 10-15 minutes |
| **Code Required** | SMTP: None<br>API: Already in Edge Functions | API: 10-20 lines |
| **Documentation** | Resend SMTP guide, Resend API docs | Loops API documentation |

**Winner:** Both are simple, but Resend SMTP is already configured for magic links

---

### Email Design Control

| Aspect | Resend (SMTP + API) | Loops (API) |
|--------|---------------------|-------------|
| **Template Editor** | SMTP: HTML templates (manual)<br>API: HTML/React email templates | Visual drag-and-drop editor |
| **Design Flexibility** | Full HTML control | Visual editor with HTML fallback |
| **Branding** | Manual HTML/CSS | Built-in branding tools |
| **Template Management** | Manual file management | Dashboard-based templates |
| **Preview** | Manual testing | Built-in preview |

**Winner:** Loops (better design control, visual editor) - but Resend is fine for transactional emails

---

### Email Visibility & Analytics

| Aspect | Resend SMTP | Loops SMTP |
|--------|-------------|------------|
| **Dashboard** | Resend dashboard (transactional emails) | Loops dashboard (transactional + marketing) |
| **Email Tracking** | Delivery status, opens, clicks | Delivery status, opens, clicks, engagement |
| **Analytics** | Basic metrics | Advanced analytics and sequences |
| **Email History** | Limited (transactional only) | Comprehensive (all emails) |
| **Integration** | Separate dashboard | Unified dashboard for all emails |

**Winner:** Loops SMTP (better visibility and analytics)

---

### Deliverability & Reliability

| Aspect | Resend SMTP | Loops SMTP |
|--------|-------------|------------|
| **Reputation** | Excellent (focused on transactional) | Excellent (marketing + transactional) |
| **Delivery Rate** | 95%+ typical | 95%+ typical |
| **Bounce Handling** | Automatic | Automatic |
| **Spam Prevention** | Built-in | Built-in |
| **Free Tier Limits** | 100 emails/day | Varies by plan |

**Winner:** Tie (both excellent deliverability)

---

### Cost Comparison

| Aspect | Resend SMTP | Loops SMTP |
|--------|-------------|------------|
| **Free Tier** | 100 emails/day | Varies (check current pricing) |
| **Paid Plans** | Starts at $20/month | Starts at $25/month (approximate) |
| **Pricing Model** | Per email volume | Per email volume + features |
| **Best For** | High-volume transactional | Marketing + transactional |

**Winner:** Resend SMTP (slightly lower cost for pure transactional)

---

### Integration with Supabase

| Aspect | Resend (SMTP + API) | Loops (API) |
|--------|---------------------|-------------|
| **SMTP Integration** | Manual SMTP configuration (for auth emails) | N/A (not using Loops SMTP) |
| **API Integration** | Direct API calls (already working for daily emails) | Direct API calls (simple integration) |
| **Setup Complexity** | SMTP: Manual entry<br>API: Already configured | API: Simple (get key, add code) |
| **Maintenance** | SMTP: Manual updates<br>API: Already working | API: Simple maintenance |
| **Error Handling** | Manual monitoring | Built-in error tracking in Loops dashboard |

**Winner:** Both are simple, but Resend is already configured and working

---

### Use Case Fit

| Use Case | Resend (SMTP + API) | Loops (API) |
|----------|---------------------|-------------|
| **Auth Emails (Magic Links)** | ✅ Excellent (SMTP configured, reliable) | ❌ Not for auth emails |
| **Daily Batch Emails** | ✅ Excellent (API already working) | ❌ Not for daily batch |
| **Welcome Emails** | ⚠️ Possible but not ideal | ✅ Excellent (built for lifecycle) |
| **Marketing Emails** | ❌ Not designed for this | ✅ Excellent (built for marketing) |
| **Email Sequences** | ❌ Not supported | ✅ Excellent (built-in automation) |

**Winner:** 
- **Auth Emails:** Resend SMTP (already configured, reliable, transactional-focused)
- **Daily Batch:** Resend API (already working, efficient)
- **Welcome/Lifecycle:** Loops API (built for marketing automation)
- **Re-engagement Sequences:** Loops API (built-in automation features)

---

## Recommendation: Current Strategy (CORRECTED)

### Why Use Both Providers?

**Resend for Transactional Emails (CRITICAL):**
- ✅ Already configured and working (SMTP for magic links, API for daily emails)
- ✅ Excellent for transactional emails (fast, reliable, simple)
- ✅ Lower cost for high-volume daily emails (3K/month free tier)
- ✅ Magic links MUST be reliable (product-critical)
- ✅ Daily emails are core product feature (must work)
- ✅ No need to change working system

**Loops API for Lifecycle/Marketing Emails (NON-CRITICAL):**
- ✅ Better design control (visual editor)
- ✅ Built for marketing automation (sequences, segments)
- ✅ Better visibility dashboard for lifecycle emails
- ✅ Future-proof for email sequences
- ✅ Non-blocking (if Loops fails, core product still works)
- ✅ Welcome emails are nice-to-have, not critical

### Benefits of This Approach

1. **Separation of Concerns:**
   - Resend: Product-critical transactional emails (magic links, daily digests)
   - Loops: Non-critical lifecycle/marketing emails (welcome, re-engagement)

2. **Deliverability Protection:**
   - If Loops has issues → Magic links still work (Resend SMTP)
   - If Loops has issues → Daily emails still work (Resend API)
   - Core product functionality protected

3. **Optimized for Each Use Case:**
   - Resend optimized for transactional (fast, reliable, simple)
   - Loops optimized for marketing automation (sequences, segments, campaigns)

4. **Future Flexibility:**
   - Can add Loops email sequences later (Story 8.5)
   - Resend continues handling transactional emails efficiently
   - No conflicts between providers

5. **Cost Efficiency:**
   - Resend free tier: 3,000 emails/month (covers magic links + daily digests for ~100 users)
   - Loops free tier: 2,000 contacts, unlimited emails (perfect for welcome/nurture sequences)
   - Both stay within free tiers for months

6. **Non-Blocking Architecture:**
   - Welcome emails don't break signup flow if Loops API fails
   - Re-engagement emails are nice-to-have, not critical
   - Core product (magic links, daily emails) always works

---

## Migration Path (If Needed)

### Current State (CORRECT)
- **Resend SMTP:** Configured for magic link auth emails (product-critical)
- **Resend API:** Used for daily task batch emails (core product feature)
- **Loops API:** Will be used for welcome/re-engagement emails (non-critical)

### No Migration Needed
The current strategy is correct:
- Resend handles transactional emails (critical)
- Loops handles lifecycle/marketing emails (non-critical)
- Both providers coexist without conflict

### If You Need to Change Providers

**Switching Welcome Emails from Loops to Resend:**
1. Remove Loops API call from app code
2. Add Resend API call for welcome emails (if desired)
3. Update email templates in Resend
4. Test welcome emails via Resend
5. **Note:** Not recommended - Loops is better for lifecycle emails

**Switching Magic Links from Resend to Loops:**
1. Configure Loops SMTP in Supabase dashboard
2. Create Loops email templates for magic links
3. Configure Supabase email templates with Loops payloads
4. Test auth emails via Loops
5. **Note:** Not recommended - Resend is better for transactional emails, and magic links are critical

---

## Troubleshooting

### Common Issues

**Issue: Welcome emails not sending via Loops API**
- **Check:** Loops API key is valid (stored in Supabase secrets or environment variables)
- **Check:** Loops email templates are published
- **Check:** Template ID is correct in API call
- **Check:** Loops API call is non-blocking (doesn't break signup flow)
- **Check:** Loops dashboard for delivery errors

**Issue: Magic link emails not sending via Resend SMTP**
- **Check:** Resend SMTP credentials in Supabase dashboard (Settings → Auth → SMTP)
- **Check:** Resend API key is valid (used as SMTP password)
- **Check:** SMTP settings are correct (smtp.resend.com, port 587)
- **Check:** Resend free tier limits (3,000/month)
- **Check:** Supabase auth logs for errors

**Issue: Daily emails not sending via Resend API**
- **Check:** Resend API key in Edge Function secrets
- **Check:** Daily email Edge Function is deployed and working
- **Check:** Resend free tier limits (3,000/month)
- **Check:** Edge Function logs for errors

**Issue: Email design not matching template**
- **Check:** Template is published in Loops
- **Check:** Supabase email template payload includes correct template ID
- **Check:** Template variables are mapped correctly

**Issue: Daily emails stopped working**
- **Check:** Resend Edge Function is deployed
- **Check:** Resend API key in Edge Function secrets
- **Check:** Resend SMTP settings (if using for auth emails)
- **Note:** Daily emails use Edge Functions, not SMTP (unless configured)

---

## Decision Summary

**Current Strategy (Epic 8 - CORRECTED):**
- ✅ **Resend SMTP:** Magic link authentication emails (product-critical, time-sensitive)
- ✅ **Resend API:** Daily task batch emails (core product feature)
- ✅ **Loops API:** Welcome emails and re-engagement sequences (lifecycle/marketing, non-critical)

**Rationale:**
- Resend handles transactional emails (critical, must be reliable)
- Loops handles lifecycle/marketing emails (nice-to-have, non-blocking)
- Deliverability protection: If Loops fails, core product still works
- Cost optimization: Both free tiers sufficient
- Tool specialization: Each provider used for its strength
- Non-blocking architecture: Welcome emails don't break signup flow

**Status:** Approved and in progress (Epic 8, Story 8.4)

---

## References

- [Loops Supabase SMTP Integration Guide](https://loops.so/docs/smtp/supabase)
- [Resend SMTP Documentation](https://resend.com/docs/send-with-smtp)
- Epic 8: Sentry Crash Logging, PostHog Analytics & Loops SMTP Integration
- Story 8.4: Loops SMTP Integration via Supabase Native Integration

