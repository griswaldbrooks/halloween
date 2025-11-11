# Quick Reference Card

## New Agent? Start Here 👋

**5-Minute Onboarding:**

1. **Read first:**
   - SESSION_2025-11-11.md (what happened last session)
   - NEXT_AGENT_COVERAGE.md (your priority)

2. **Run this:**
   ```bash
   python tools/sonarcloud_verify.py --component hatching_egg
   ```

3. **Your job:** Fix C++ coverage display in SonarCloud

## Essential Commands

```bash
# Verify SonarCloud state (USE THIS FIRST!)
python tools/sonarcloud_verify.py --project griswaldbrooks_halloween
python tools/sonarcloud_verify.py --component hatching_egg

# Run all tests
bash verify-all.sh

# Generate coverage
cd hatching_egg && pixi run coverage-all
cd window_spider_trigger && pixi run test-coverage
cd spider_crawl_projection && pixi run coverage

# Check CI
gh run list --workflow=coverage.yml --limit 1
gh run watch
```

## Project Status (One-Liner)

✅ Excellent: spider_crawl_projection (97.48%), window_spider_trigger (96.6%)
✅ Good: hatching_egg Python (92%), JS (90.6%), C++ local (85.9%)
⚠️ Issue: hatching_egg C++ not in SonarCloud dashboard
❌ Needs work: twitching_body (0%)

## Current Problem

**What:** C++ coverage doesn't display in SonarCloud
**Why:** Path mismatch (hypothesis)
**How to fix:** Read NEXT_AGENT_COVERAGE.md
**How to verify:** `python tools/sonarcloud_verify.py --component hatching_egg`

## Key Documents

| Document | Purpose |
|----------|---------|
| SESSION_2025-11-11.md | What was done, what needs work |
| NEXT_AGENT_COVERAGE.md | Your starting point |
| VERIFIED_LOCAL_COVERAGE.md | Current working state |
| PRODUCTION_EMBEDDED_TESTING.md | How to write production code |
| tools/README.md | Tool usage guide |
| tools/SONARCLOUD_API.md | API reference |
| QUICK_REFERENCE.md | This file |

## Agent Standards

**Before claiming success:**
1. ✅ Run verification tool (don't guess)
2. ✅ Show actual output
3. ✅ Ask user to confirm UI
4. ❌ Don't skip verification
5. ❌ Don't assume without checking

**Coverage targets:**
- Core logic: 80%
- App logic: 70%
- Hardware wrappers: Integration tests

**Architecture:**
- Hardware abstraction mandatory
- Interface classes required
- .ino files < 100 lines
- See PRODUCTION_EMBEDDED_TESTING.md

## Need Help?

Read the docs above. They're comprehensive and up-to-date.

## Quick Wins

If C++ coverage takes too long:
- Refactor twitching_body (0% → 80%)
- Guide: PRODUCTION_EMBEDDED_TESTING.md
- Estimate: 8-12 hours
