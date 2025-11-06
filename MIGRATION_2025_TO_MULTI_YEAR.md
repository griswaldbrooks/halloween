# Repository Migration Guide - Multi-Year Setup

**Status:** ✅ **COMPLETE** - All tests passing, CI operational

This document explains the reorganization completed on 2025-11-05/06.

## What Changed

### 1. Repository Renamed
- **Old:** `halloween_2025`
- **New:** `halloween`

This makes the repo year-agnostic and suitable for reuse.

### 2. Directory Structure

**Root directory (reusable components):**
```
halloween/
├── hatching_egg/              # Spider egg animatronic (241 tests)
├── spider_crawl_projection/   # Procedural spider animation (12 tests)
├── twitching_body/            # Twitching victim (integration tests)
├── window_spider_trigger/     # Video scare (integration tests)
├── .github/workflows/         # CI testing
├── README.md                  # Main documentation
└── 2025/                      # Year-specific materials
```

**2025 folder (this year's event):**
```
2025/
├── PROJECT_PLAN.md            # 6-chamber layout
├── AGENT_HANDOFF.md           # Session notes
├── SHOPPING_LIST.md           # Materials ($3,025 budget)
├── LAYOUT_MAP.txt             # Physical layout
├── LAYOUT_MAP_8BIT.txt        # ASCII art layout
├── invitation1.png            # Event invitation
├── tamari_script.txt          # Narrative script
├── retros/                    # Post-event notes
└── README.md                  # 2025 event summary
```

### 3. GitHub Actions CI
- Added `.github/workflows/test.yml`
- Automatically runs all unit tests on push/PR
- Tests all 4 projects (~500 total tests)
- Uses Pixi for reproducible environments

## GitHub Repository Steps

Since you renamed the local directory, you'll need to update the GitHub repository:

### Option 1: Rename on GitHub (Recommended)

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/[username]/halloween_2025`

2. **Go to Settings**
   - Click the "Settings" tab

3. **Rename the repository**
   - In the "Repository name" field, change `halloween_2025` to `halloween`
   - Click "Rename"

4. **Update your local remote URL**
   ```bash
   cd /home/griswald/personal/halloween
   git remote set-url origin https://github.com/[username]/halloween.git
   ```

5. **Push the reorganization changes**
   ```bash
   git push origin main
   ```

### Option 2: Force Push to Existing Repo

If you want to keep the old repo name on GitHub:

1. **Update remote URL** (if it changed due to local rename)
   ```bash
   cd /home/griswald/personal/halloween
   git remote -v  # Check current remote
   # If it still points to halloween_2025, you're good!
   ```

2. **Push the changes**
   ```bash
   git push origin main
   ```

Note: GitHub will automatically redirect `halloween_2025` URLs to `halloween` if you rename.

### Verify CI is Working

After pushing:

1. Go to the "Actions" tab on GitHub
2. You should see "Unit Tests" workflow
3. It will run automatically on every push
4. Check that all tests pass (green checkmark)

## Benefits of New Structure

### For Next Year (2026)

1. **Create new year folder:**
   ```bash
   mkdir 2026
   cp 2025/PROJECT_PLAN.md 2026/  # Use as template
   cp 2025/SHOPPING_LIST.md 2026/
   ```

2. **Reuse all animatronics:**
   - All code in `hatching_egg/`, `twitching_body/`, etc. still works
   - Just test: `cd [project] && pixi run test`
   - Deploy: `cd [project] && pixi run deploy`

3. **Customize for new theme:**
   - Edit 2026 project plan
   - Adjust layouts
   - Keep same hardware!

### Continuous Integration

- All tests run automatically on GitHub
- Prevents breaking changes
- Ensures animatronics work year after year
- Confidence when making updates

## Testing After Migration

To verify everything still works:

```bash
cd /home/griswald/personal/halloween

# Test each project
cd hatching_egg && pixi run test
cd ../spider_crawl_projection && pixi run test
cd ../twitching_body && pixi run integration-test
cd ../window_spider_trigger && pixi run integration-test
```

All tests should pass as before!

## File Changes Summary

**Moved to 2025/:**
- PROJECT_PLAN.md
- AGENT_HANDOFF.md
- SHOPPING_LIST.md
- LAYOUT_MAP.txt
- LAYOUT_MAP_8BIT.txt
- invitation1.png
- tamari_script.txt
- retros/

**Added:**
- README.md (root)
- 2025/README.md
- .github/workflows/test.yml

**Deleted:**
- web_projection/spiders_spread1.png (unused)
- web_projection/spiders_spread2.png (unused)

## Final Status

1. ✅ Repository reorganized locally
2. ✅ All changes committed (10 commits total)
3. ✅ GitHub repo renamed: `halloween_2025` → `halloween`
4. ✅ Pushed to GitHub
5. ✅ CI tests passing (all green!)

### CI Fixes Applied

During migration, several CI issues were identified and fixed:

1. **Pixi auto-install** - Disabled, added explicit install per project
2. **Setup dependencies** - Added `pixi run setup` before integration tests
3. **Directory creation** - Created `.pixi/bin` and `.arduino15` before use
4. **Shell command chaining** - Added explicit `&&` separators in multi-line commands
5. **Counter increments** - Fixed `((var++))` to `$((var + 1))` for `set -e` compatibility
6. **Deprecated fields** - Refactored `[project]` to `[workspace]` in all pixi.toml files
7. **Keyframe cleanup** - Removed unused keyframe feature from spider_crawl_projection

### Test Results

**All projects passing:**
- Hatching Egg: 241/241 tests ✅
- Spider Crawl Projection: 8/8 tests ✅
- Twitching Body: 5/5 integration tests ✅
- Window Spider Trigger: 5/5 integration tests ✅

**Total:** ~260 tests, all passing ✅

---

**Migration completed:** 2025-11-06
**Commits:** 64bf440...28066f3 (10 commits)
**Status:** ✅ Complete and operational
