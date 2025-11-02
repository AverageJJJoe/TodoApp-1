# Monetization Strategy Alignment Analysis

**Date:** January 27, 2025  
**Analyst:** John (PM)  
**Document Analyzed:** `docs/todomorning-monetization-strategy.md`  
**Compared Against:** PRD (`docs/prd.md`), Architecture (`docs/architecture.md`), and Requirements

---

## Executive Summary

✅ **Overall Assessment: STRONG ALIGNMENT** with minor inconsistencies requiring correction.

The monetization strategy document aligns well with the PRD, architecture, and requirements on core strategy, pricing tiers, cohort definitions, database schema, and payment platforms. However, there are **naming inconsistencies** and one **trial start logic clarification** needed.

---

## ✅ Areas of Strong Alignment

### 1. Pricing Strategy & Phases
- ✅ **Phase 1 (Weeks 4-6):** FREE launch aligns with PRD Section 1.3
- ✅ **Phase 2 (Weeks 7-8):** A/B test $2.99 vs $4.99 matches PRD exactly
- ✅ **Phase 3 (Month 3+):** Winner price implementation matches PRD
- ✅ **Target conversion rates:** 10-12% (Phase 2), 12%+ (Phase 3) consistent

### 2. Cohort Definitions
All cohorts match PRD FR19 and architecture schema:
- ✅ `free_launch` (Weeks 4-6)
- ✅ `early_freemium_2.99` (Weeks 7-8)
- ✅ `early_freemium_4.99` (Weeks 7-8)
- ✅ `paid_cohort_v1` (Month 3+)
- ✅ `paid_cohort_v2` (Month 4+, optional)

### 3. Database Schema Fields
Monetization strategy database schema aligns with:
- ✅ PRD Appendix B (Users Table)
- ✅ Architecture Section 3 (Database Schema)
- ✅ All required fields present: `cohort`, `grandfather_status`, `trial_started_at`, `trial_expires_at`, `trial_tasks_count`, `is_paid`, `paid_at`, `paid_price_cents`, `unlock_method`, paywall tracking fields

### 4. Payment Platform Integration
- ✅ **iOS:** Apple IAP non-consumable products aligned with PRD FR26
- ✅ **Android:** Google Play Billing one-time products aligned with PRD FR26
- ✅ **Web:** Stripe one-time charge aligned with PRD FR26
- ✅ **Validation:** Server-side Edge Functions aligned with PRD FR27

### 5. Trial Logic
- ✅ **Duration:** 30 days OR 100 tasks (whichever first) matches PRD FR20
- ✅ **Grandfather status:** `free_launch` cohort never charged matches PRD FR21
- ✅ **Paywall triggers:** Trial expiration, task limit (100), manual upgrade match PRD FR24

### 6. Paywall Messaging Strategy
- ✅ **Day 27:** "Trial ending in 3 days" matches PRD FR22
- ✅ **Day 30:** Hard paywall matches PRD FR22
- ✅ **Cohort-specific messaging:** $2.99 vs $4.99 variations match PRD FR23

### 7. Revenue Projections
- ✅ **Month 1:** $0 revenue (free phase) aligned
- ✅ **Month 2:** ~$90 net revenue projection reasonable
- ✅ **Month 3:** Acknowledged gap to $500 goal with mitigation strategies

---

## ⚠️ Issues Requiring Correction

### Issue 1: Naming Inconsistency - "TodoMorning" vs "TodoTomorrow"

**Severity:** HIGH (affects user-facing content and product IDs)

**Location in Monetization Strategy:**
- Line 133: "Keep **TodoMorning** for just $2.99"
- Line 153: "Unlock **TodoMorning Premium** for $4.99"
- Line 172: "Love **TodoMorning**? ❤️"
- Lines 233-234: Product IDs use `com.todomorning.premium_oneoff_2.99` (should be `com.todotomorrow...`)
- Lines 239-240: SKUs use `todomorning_premium_2_99` (should be `todotomorrow_premium_2_99`)
- Line 245: "**ToDoMorning Premium**"

**PRD/Architecture Standard:**
- Project name: **"TodoTomorrow"** (consistent across PRD, architecture, and implementation)
- Domain: `todotomorrow.com`
- Product IDs should follow: `com.todotomorrow.premium_oneoff_2.99`

**Action Required:**
- Replace all "TodoMorning" references with "TodoTomorrow"
- Update product IDs: `com.todotomorrow.premium_oneoff_2.99` and `com.todotomorrow.premium_oneoff_4.99`
- Update Android SKUs: `todotomorrow_premium_2_99` and `todotomorrow_premium_4_99`
- Update Stripe product name: "TodoTomorrow Premium"

---

### Issue 2: Trial Start Logic Clarification

**Severity:** MEDIUM (implementation detail clarification needed)

**Monetization Strategy States:**
- Line 119: "30 days from **account creation**"
- Line 60/68: "trial_expires_at: 30 days from signup"

**Architecture States:**
- `docs/architecture/payment-trial-system.md` Line 5: "**Trigger:** First task creation"

**PRD Requirements:**
- FR20: "The app shall track trial expiration based on **30 days from signup** OR 100 task limit"

**Resolution:**
PRD is the source of truth: **trial starts on signup** (not first task). However, `trial_started_at` timestamp may be set on first task creation for tracking purposes, while `trial_expires_at` is calculated from `created_at` (signup date).

**Recommendation:**
Clarify in monetization strategy that:
- `trial_expires_at` = `created_at` + 30 days (from signup)
- `trial_started_at` may be set on first task creation for analytics, but trial duration is always calculated from signup date

---

## 📋 Minor Observations (Not Issues)

### 1. Revenue Projection Gap
Monetization strategy acknowledges Month 3 projection is $191 (short of $500 goal) with mitigation strategies. This is **intentional transparency** and aligns with PRD goals that acknowledge the need for optimization.

### 2. Database Schema Completeness
Monetization strategy proposes additional fields not in current architecture:
- `trial_days_remaining` (generated column) - useful but optional
- `test_price_cents` - already covered by `cohort` field tracking

These are enhancements, not misalignments.

### 3. Paywall Flow Details
Monetization strategy provides more detailed paywall flow (Days 1-26 banner, Day 27-29 modal, Day 30 hard paywall) than PRD Section 3.5, but these are **compatible extensions** that enhance the PRD requirements.

---

## ✅ Recommendation

**Status:** Monetization strategy is **FULLY ALIGNED** ✅ - All corrections have been applied.

**Completed Actions:**
1. ✅ Updated all "TodoMorning" references to "TodoTomorrow" (user-facing and product IDs)
2. ✅ Updated product IDs: `com.todotomorrow.premium_oneoff_2.99` / `4.99`
3. ✅ Updated Android SKUs: `todotomorrow_premium_2_99` / `4_99`
4. ✅ Clarified trial start logic (from signup, not first task)

**Verification:**
✅ All corrections applied. Monetization strategy is **fully aligned** with PRD, architecture, and requirements.

---

## Summary Checklist

| Area | Status | Notes |
|------|--------|-------|
| Pricing Strategy | ✅ Aligned | All phases match PRD |
| Cohort Definitions | ✅ Aligned | All 5 cohorts match |
| Database Schema | ✅ Aligned | All fields present |
| Payment Platforms | ✅ Aligned | iOS/Android/Stripe match |
| Trial Logic | ✅ Aligned | 30 days OR 100 tasks |
| Grandfather Status | ✅ Aligned | free_launch never charged |
| Paywall Messaging | ✅ Aligned | Cohort-specific messages |
| **Naming Consistency** | ✅ **Fixed** | TodoMorning → TodoTomorrow |
| **Product IDs** | ✅ **Fixed** | todomorning → todotomorrow |
| Trial Start Logic | ✅ **Clarified** | From signup (matches PRD) |

---

**Conclusion:** ✅ The monetization strategy is comprehensive and **fully aligned** with project requirements. All naming corrections have been applied, and it is ready for architecture implementation handoff.

