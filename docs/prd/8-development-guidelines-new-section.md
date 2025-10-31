# 8. Development Guidelines - NEW SECTION

## Story Size Principles

**Every story should be:**
- ✅ Completable in 2-4 hours (not 8+ hours)
- ✅ Testable immediately after completion
- ✅ Building directly on previous story
- ✅ Single clear deliverable

**Red Flags (Story Too Big):**
- ❌ Multiple database tables in one story
- ❌ More than 8 acceptance criteria
- ❌ "And also..." appearing in story description
- ❌ Multiple integration points (auth + tasks + emails in one story)
- ❌ Cannot test without completing other stories first

## Build-Test-Fix Workflow

After each story:

1. **Build:** Implement the story
2. **Test:** Verify acceptance criteria (all should pass)
3. **Fix:** If issues found, fix before moving to next story
4. **Commit:** Git commit with story ID (e.g., "Story 1.3: Database schema - Users table")
5. **Next:** Only then move to next story

**Never move forward if current story has failing tests.**

## Story Dependencies

Stories are **intentionally sequential**. Do not skip ahead.

Example: You cannot do Story 2.3 (Save to Supabase) without Story 2.2 (Local state) working first.

If a story is blocked:
1. Check if previous story is actually complete (all ACs passing)
2. If previous story incomplete → Go back and fix it
3. If blocked by external factor (e.g., waiting for Stripe approval) → Mark story as "Blocked" and work on different epic temporarily

## Testing Each Story

**Minimum test for each story:**
- Unit test (if business logic exists)
- Manual test following the "Test:" line in each story
- Verify acceptance criteria manually

**Do not proceed if:**
- Story's "Test:" step fails
- Any acceptance criteria not met
- Code has obvious bugs or crashes

---
