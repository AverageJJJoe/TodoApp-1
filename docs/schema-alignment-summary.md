# Database Schema Alignment Summary

**Date:** October 31, 2025  
**Purpose:** Resolve schema discrepancy between PRD Appendix B and Architecture document

---

## Problem Identified

The PRD Appendix B and Architecture document had conflicting database schemas:

**Key Differences:**
1. **Users table:**
   - PRD: Used `mode`, lacked `auth_id`, had `trial_days_remaining` generated column
   - Architecture: Used `workflow_mode`, had `auth_id`, lacked monetization fields
   - Both had different monetization field structures

2. **Tasks table:**
   - PRD: Used `title` field, separate `archived_at` and `completed_at` timestamps
   - Architecture: Used `text` field, had `status` enum, included `synced_at` and `emailed_at` for offline sync

3. **Payments table:**
   - PRD: Had `status` field, `cohort_at_purchase`, `test_variant_paid`
   - Architecture: Had `validation_status`, `receipt_data`, lacked analytics fields

---

## Solution: Unified Schema

Created a unified schema that combines:

### ✅ Architecture Foundation (Technical Requirements)
- `auth_id` field for Row-Level Security (RLS)
- `workflow_mode` (more descriptive than `mode`)
- `status` enum for tasks (cleaner than boolean flags)
- `synced_at` and `emailed_at` for offline-first architecture
- `receipt_data` and `validation_status` for payment security

### ✅ PRD Monetization Fields (Business Requirements)
- `cohort` and `grandfather_status` for tiered freemium strategy
- `trial_expires_at` and `trial_tasks_count` for trial tracking
- `paid_at`, `paid_price_cents`, `unlock_method` for payment analytics
- `paywall_shown_count` and related analytics fields
- `cohort_at_purchase` and `test_variant_paid` for A/B testing

---

## Files Updated

### 1. `docs/architecture.md`
- ✅ Updated Users table schema with all monetization fields
- ✅ Added `email_enabled` field
- ✅ Updated Tasks table: clarified `text` field (displayed as "title" in UI)
- ✅ Added `archived_at` to Tasks table
- ✅ Updated Payments table with analytics fields
- ✅ Added missing indexes for monetization queries

### 2. `docs/prd.md`
- ✅ Updated Appendix B to match unified schema
- ✅ Added note about `text` vs `title` field naming
- ✅ Updated Story 1.3 to reference unified schema
- ✅ Updated Story 2.1 to reference correct field names
- ✅ Updated Stories 2.3, 2.6, 5.3 to use `text` instead of `title`
- ✅ Updated Epic List: Added Story 1.2.5 (Testing Framework Setup)
- ✅ Created Story 1.2.5: Testing Framework Setup (resolves validation finding)

---

## Key Schema Decisions

### Tasks Table: `text` vs `title`
- **Database field:** `text` (more semantic, better for task content)
- **UI display:** Shows as "title" to users (better UX terminology)
- **Implementation:** Map `text` field to "title" label in UI components

### Users Table: `workflow_mode` vs `mode`
- **Decision:** Use `workflow_mode` (more descriptive)
- **Note:** All stories and queries now use `workflow_mode`

### Trial Tracking: Dual System
- **`trial_expires_at`:** Timestamp when trial expires (30 days from start)
- **`trial_tasks_count`:** Counter for 100-task limit (alternative gate)
- **Both used:** Trial expires when EITHER expires (whichever comes first)

---

## New Story Added

### Story 1.2.5: Testing Framework Setup
- **Dependencies:** Story 1.2 (Supabase Client)
- **Estimated Time:** 2 hours
- **Purpose:** Establish testing infrastructure early
- **Includes:** Jest, React Native Testing Library, test directory structure

This addresses the PO validation finding that testing framework setup was missing from the story sequence.

---

## Verification Checklist

- [x] Users table includes all monetization fields
- [x] Users table includes `auth_id` for RLS
- [x] Tasks table uses `text` field (with UI note)
- [x] Tasks table includes `status` enum and sync fields
- [x] Payments table includes validation and analytics fields
- [x] All indexes created for performance
- [x] Stories updated to reference correct field names
- [x] Epic list updated (6 stories in E1, total 29 stories)
- [x] Testing framework story added

---

## Next Steps for Developers

1. **Story 1.3:** Use unified schema from `docs/architecture.md` Section 3 (lines 128-170)
2. **Story 2.1:** Create tasks table with `text` field (not `title`)
3. **Story 1.2.5:** Set up testing framework before Story 2.1
4. **All Stories:** Reference `docs/architecture.md` as source of truth for schema

---

**Status:** ✅ **RESOLVED** - Both documents now aligned with unified schema

