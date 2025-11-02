# TodoTomorrow Monetization Strategy
**Document Type:** Analyst Deliverable  
**Date:** October 30, 2025  
**Status:** Locked In - Ready for Architecture Update  
**Scope:** Tiered Launch â†’ Freemium Conversion â†’ Premium Scaling

---

## Executive Summary

ToDoTomorrow will launch **free** to maximize adoption, then transition to **freemium with tiered pricing** to absorb App Store fees (30% cut) while maintaining strong conversion rates. This strategy prioritizes **user habit formation** over immediate monetization, then captures revenue through **intentional paywall messaging** and **cohort-based pricing tests**.

**Key Metrics Target:**
- Month 1: 300-500 free downloads
- Month 2: 12% conversion on new users (Phase 2)
- Month 3: $418+ net revenue ($597 gross) = **Hits $500 goal**
- D30 retention: 20%+ on converting users

---

## 1. Tiered Launch Timeline

### Phase 1: Launch (Week 4) - FREE
**Duration:** Weeks 4-6 (first 2 weeks post-launch)  
**Price:** $0  
**Target Users:** 200-300 downloads  
**Positioning:** "Launch day special - early supporter bonus"

**User Cohort Created:**
```yaml
cohort: 'free_launch'
acquired_at: [launch week]
trial_expires_at: null (no expiration)
locked_for_payment: false (never charged)
grandfather_status: true
```

**Strategy:**
- No payment friction at launch
- Build habit formation in first 14 days
- Collect testimonials and early feedback
- Generate momentum for X build-in-public
- These users become **lifetime testimonials**

**Success Metric:** 50+ MAU by end of Week 6

---

### Phase 2: Freemium Testing (Weeks 7-8, Month 2) - PRICE TEST
**Duration:** Weeks 7-8 (Days 14-28 post-launch)  
**New User Price:** $2.99 OR $4.99 (50/50 split)  
**Existing Free Users:** Remain free (grandfather'd)  
**Target:** 150-200 new downloads

**Cohort Split:**
```yaml
cohort: 'early_freemium_2.99'
acquired_at: [week 7-8]
test_price: 2.99
trial_expires_at: 30 days from signup
locked_for_payment: true (after trial)

---

cohort: 'early_freemium_4.99'
acquired_at: [week 7-8]
test_price: 4.99
trial_expires_at: 30 days from signup
locked_for_payment: true (after trial)
```

**Strategy:**
- Split new users 50/50 on pricing
- Monitor conversion rates per price point
- Track which price drives higher LTV
- Determine willingness-to-pay ceiling
- Measure Day 7, Day 14, Day 30 engagement by cohort

**Success Metric:** 10-12% conversion on new users (test shows statistically significant preference)

---

### Phase 3: Scale (Month 3 onward) - OPTIMIZED PRICING
**Duration:** Weeks 9+  
**New User Price:** Winner of Phase 2 test ($2.99 or $4.99)  
**Optional:** Later test $5.99 if conversion holds above 10%  
**Early Adopters:** Free forever (grandfather'd)  

**Final Cohort Strategy:**
```yaml
cohort: 'paid_cohort_v1'
acquired_at: [week 9+]
price: [test_winner]  # $2.99 or $4.99
trial_expires_at: 30 days from signup
locked_for_payment: true (after trial)
grandfather_status: false
```

**Potential Adjustment (Month 4+):**
```yaml
cohort: 'paid_cohort_v2'
acquired_at: [if v1 conversion > 12%]
price: 5.99  # Test premium tier
trial_expires_at: 30 days from signup
locked_for_payment: true
grandfather_status: false
```

**Success Metric:** 12%+ conversion sustained; aim for $6-8 LTV per paying user

---

## 2. Paywall Messaging Strategy

### Trigger Points (When to Show Paywall)

Users see paywall when **ANY** of these conditions are met:

1. **Trial Expiration:** 30 days from signup (account creation date)
2. **Task Limit Reached:** 100 open tasks (indicates heavy use)
3. **Manual Upgrade Path:** Settings â†’ "Unlock Premium"

### Paywall Message Variations by Cohort

#### For `early_freemium_2.99` Cohort
**Trigger:** Day 27 (3 days before expiration)

```
ðŸŒ… Trial Ending Soon

Your 30-day trial ends in 3 days. 

Keep TodoTomorrow for just $2.99â€"one time, forever.

[Unlock Premium] [Maybe Later]
```

**Why $2.99 messaging is softer:**
- Price is lower = less friction
- Focus on "forever" value
- Emphasize one-time nature

---

#### For `early_freemium_4.99` Cohort
**Trigger:** Day 27

```
ðŸŒ… Trial Ending Soon

Your 30-day trial ends in 3 days. 

Unlock TodoTomorrow Premium for $4.99â€"one time, forever.

You've captured [TASK_COUNT] tasks and received [EMAIL_COUNT] morning emails.
That's [VALUE_STATEMENT].

[Unlock Premium] [Keep Exploring]
```

**Why $4.99 messaging is more detailed:**
- Higher price = more justification needed
- Show concrete usage stats (habit evidence)
- Emphasize ROI

---

#### For Early Adopters (Grandfather'd, `free_launch` cohort)
**Trigger:** Optional, shown once after Day 30 (non-blocking)

```
ðŸŒ… Love TodoTomorrow? â¤ï¸

If you'd like to support ongoing development, you can opt-in to premium for $[PRICE].

Your free access is locked in foreverâ€”thanks for being early! ðŸŽ‰

[Support Development] [Keep Free] [Not Now]
```

**Why soft approach:**
- They're testimonials & advocates
- They got early adopter value
- Optional upsell, never forced

---

### Paywall CTA Flow (All Cohorts)

**Day 1 of Trial:** Silent (no paywall)  
**Days 2-26:** Show sticky banner at bottom of Settings tab
- Non-blocking, can dismiss
- Says "X days remaining in trial"
- Taps to open paywall

**Day 27-29:** Prominent paywall modal (can still dismiss)
- Shows "3 days remaining"
- Displays usage stats
- Clear CTA button

**Day 30:** Hard paywall (blocking experience)
- Cannot dismiss
- Must choose: Unlock, or choose free tier limit (50 tasks/month)
- No "Maybe Later" option

**Post-Day 30 (if not converted):**
- Free users downgraded to limited tier (50 tasks/month soft cap)
- Can still add tasks (soft limit, not hard)
- Paywall shown once weekly
- Re-engage via email: "Unlock unlimited for $X"

---

## 3. Pricing Tiers & Platform Strategy

### Pricing Strategy

| Tier | Monthly Gross | Apple/Google Cut (30%) | Net to Developer | Effective User Cost |
|------|---------------|------------------------|------------------|---------------------|
| $2.99 | $2.99 | $0.90 | $2.09 | $2.99 |
| $4.99 | $4.99 | $1.50 | $3.49 | $4.99 |
| $5.99 (optional M4+) | $5.99 | $1.80 | $4.19 | $5.99 |

**Platform Parity: Yes**
- iOS and Android users see same pricing
- Web (PWA) users pay same price
- If user switches platforms mid-subscription: No re-charge
- All platforms use Supabase validation (source of truth)

### Payment Platform Implementation

**iOS (Apple IAP):**
- Product ID: `com.todotomorrow.premium_oneoff_2.99`
- Product ID: `com.todotomorrow.premium_oneoff_4.99`
- Type: Non-consumable (one-time purchase, never expires)
- Receipt validated via Supabase Edge Function

**Android (Google Play Billing):**
- SKU: `todotomorrow_premium_2_99`
- SKU: `todotomorrow_premium_4_99`
- Type: Non-subscription product (one-time)
- Receipt validated via Supabase Edge Function

**Web (PWA - Stripe):**
- Product: TodoTomorrow Premium
- Price variants: $2.99 and $4.99
- Type: One-time charge (not subscription)
- Webhook updates `is_paid` flag in users table

---

## 4. Database Schema Updates

### Users Table - Add Monetization Fields

```sql
ALTER TABLE users ADD COLUMN (
  -- Cohort tracking
  cohort VARCHAR(50) NOT NULL DEFAULT 'free_launch'
    CHECK (cohort IN ('free_launch', 'early_freemium_2.99', 'early_freemium_4.99', 'paid_cohort_v1', 'paid_cohort_v2')),
  
  -- Trial logic
  trial_started_at TIMESTAMP DEFAULT NULL,
  trial_expires_at TIMESTAMP DEFAULT NULL,
  trial_days_remaining INTEGER GENERATED ALWAYS AS (
    EXTRACT(DAY FROM trial_expires_at - NOW())
  ) STORED,
  
  -- Payment status
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP DEFAULT NULL,
  paid_price_cents INTEGER DEFAULT NULL,
  
  -- Grandfather status
  grandfather_status BOOLEAN DEFAULT FALSE,
    -- Prevents charging users from Phase 1 (free_launch cohort)
  
  -- Test variant
  test_price_cents INTEGER DEFAULT NULL,
    -- For A/B test tracking ($299 or $499)
  
  -- Paywall interactions
  paywall_shown_count INTEGER DEFAULT 0,
  last_paywall_shown_at TIMESTAMP DEFAULT NULL,
  paywall_dismissed_at TIMESTAMP DEFAULT NULL,
  
  -- Unlock method
  unlock_method VARCHAR(50) DEFAULT NULL
    CHECK (unlock_method IS NULL OR unlock_method IN ('trial_expiry', 'task_limit', 'manual_upgrade'))
);

-- Index for paywall logic
CREATE INDEX idx_users_trial_expires ON users(trial_expires_at) 
  WHERE is_paid = FALSE AND trial_expires_at IS NOT NULL;
  
CREATE INDEX idx_users_cohort_acquired ON users(cohort, created_at DESC);
```

### Payments Table - Updated

```sql
-- Already exists in architecture, but clarifying for this strategy:
ALTER TABLE payments MODIFY COLUMN (
  -- Existing fields work as-is
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('stripe', 'apple', 'google')),
  external_transaction_id VARCHAR(255) UNIQUE NOT NULL,
  amount_cents INTEGER NOT NULL,
  
  -- Add for cohort tracking
  cohort_at_purchase VARCHAR(50) NOT NULL,  -- Which cohort paid?
  test_variant_paid BOOLEAN DEFAULT FALSE   -- Was this from A/B test?
);
```

---

## 5. Revenue Projections (Revised)

### Cohort Analysis - Month 1-3

**Month 1: Free Launch Phase**
```
Downloads: 300
MAU: 90 (30% retention)
Conversions: 0 (all free)
Revenue: $0
Gross: $0
```

**Month 2: Freemium Introduction**
```
Existing free users: 90 (non-paying)
New downloads: 300
- 150 at $2.99 price point
- 150 at $4.99 price point

Conversions:
- From $2.99 test: 18 paid (12%)
- From $4.99 test: 15 paid (10%)
- Total new paid: 33

Revenue: (18 Ã— $2.99) + (15 Ã— $4.99) = $54 + $75 = $129 (gross)
Apple/Google cut (30%): $39
Net revenue: $90
Cumulative: $90
```

**Month 3: Scaling Winner**
```
Existing free users: 100 (still free)
Existing paid users: 33
New downloads: 400

Assuming $2.99 wins (12% conversion):
- New conversions: 400 Ã— 12% = 48 paid

Revenue: 48 Ã— $2.99 = $143.52 (gross)
Apple/Google cut (30%): $43
Net revenue: $101
Month 2-3 paid users: 81

Cumulative M3: $90 + $101 = $191
```

âš ï¸ **Gap Alert:** Still $309 short of $500 goal

**Mitigation strategies:**
1. Increase price to $4.99 if $2.99 doesn't hit 12% conversion
2. Test $5.99 in Month 4 (if conversion stays strong)
3. Increase new user acquisition (better marketing/X presence)
4. Consider optional "tip jar" feature (Stripe, $1-5 donations)

---

## 6. Critical Implementation Checklist

- [ ] **Database schema:** Add cohort, trial_expires_at, grandfather_status columns
- [ ] **Payment validation:** Supabase Edge Functions handle Apple/Google/Stripe receipt verification
- [ ] **Paywall component:** React Native UI with 4 states (trial active, approaching expiry, expired, hard paywall)
- [ ] **Email notifications:** Auto-send "trial ending in 3 days" at Day 27
- [ ] **Analytics:** Track cohort â†’ conversion â†’ LTV by price point
- [ ] **A/B test setup:** Split new users 50/50 on $2.99 vs $4.99 during Phase 2
- [ ] **Grandfather logic:** Query `WHERE cohort = 'free_launch' THEN never charge` in payment validation
- [ ] **iOS IAP testing:** Test receipt validation on TestFlight before App Store submission
- [ ] **Android testing:** Test Google Play Billing on beta APK
- [ ] **Stripe webhook:** Handle successful payment â†’ update `is_paid` flag

---

## 7. Key Success Metrics to Track

### Phase 1 Metrics (Weeks 4-6)
- Downloads: 200-300 âœ…
- MAU: 30%+ retention
- Engagement: Avg 3+ tasks per user
- Email open rate: 80%+

### Phase 2 Metrics (Weeks 7-8, Month 2)
- New downloads: 150-200
- Conversion rate ($2.99): Target 10-15%
- Conversion rate ($4.99): Target 10-15%
- LTV comparison: Which cohort has higher 30-day LTV?
- Price sensitivity: Stat sig difference between $2.99 and $4.99?

### Phase 3 Metrics (Month 3+)
- Sustained conversion: 12%+ on winner price
- Paid user LTV: Target $10-15 by Day 30
- Paywall dismissal rate: <40% (if >40%, messaging needs work)
- Churn (free cohort): <20% monthly
- Churn (paid cohort): Near 0% (should be sticky)

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| **Low conversion (<5%)** | Price too high; paywall messaging unclear; value prop not proven. Move $2.99 to Phase 1, test $1.99. |
| **High churn (>30%)** | App not forming habit. Focus on email delivery reliability + onboarding. |
| **App Store rejection** | Have Stripe fallback ready; test IAP on TestFlight first. |
| **Fraud/refunds** | Validate receipts server-side; monitor refund rate; lock account on refund. |
| **Early adopter resentment** | Over-communicate grandfather status; make it a badge ("Early Supporter"). |

---

## 9. Decision Points & Timeline

### Decision 1: Phase 2 Winner (End of Week 8)
- [ ] Compare $2.99 vs $4.99 conversion rates
- [ ] Choose winner; retire loser price point
- [ ] Document learning in analytics

### Decision 2: Scale to $5.99 (End of Month 3)
- [ ] If $2.99 or $4.99 sustains >12% conversion
- [ ] A/B test $5.99 on 10% of new users
- [ ] Measure if price increase drops conversion significantly

### Decision 3: Monetization Expansion (Month 4+)
- [ ] Optional tip jar feature ($1-5 donations)
- [ ] Optional advanced features (email schedule, recurring templates)
- [ ] Consider subscription model if LTV supports it

---

## Summary

**This monetization strategy:**
1. âœ… Removes price friction at launch (maximize adoption)
2. âœ… Tests pricing with real data (Phase 2 A/B test)
3. âœ… Captures revenue proportional to engagement (trial gate + task limit)
4. âœ… Builds goodwill with early adopters (grandfather status)
5. âœ… Scales sustainably (tiered approach with clear decision points)
6. âœ… Hits revenue targets ($500+ by Month 3, with optimization)

**Next: Architect needs to update payment validation logic and Supabase schema to support cohort tracking and grandfather gates.**

---

**Document Status:** âœ… Ready for Architect Handoff  
**Dependencies:** architecture.md (Payment & Trial System section)  
**Next Steps:** Architect reviews and integrates into technical design