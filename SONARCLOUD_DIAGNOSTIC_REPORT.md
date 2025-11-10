# SonarCloud Coverage Issue - Diagnostic Report
**Date:** 2025-11-10
**Issue:** window_spider_trigger shows 0% coverage on SonarCloud despite having 98.62% local coverage
**Status:** **ROOT CAUSE IDENTIFIED**

---

## Executive Summary

**The problem is NOT with SonarCloud, lcov.info paths, or configuration files.**

**The problem IS with the GitHub Actions workflow's grep pattern that detects the coverage task.**

The workflow checks if the `coverage` task exists using:
```bash
if pixi task list | grep -q "^coverage"; then
```

But `pixi task list` outputs tasks on a **single comma-separated line**, not separate lines:
```
Tasks that can run on this machine:
-----------------------------------
arduino-clean, arduino-compile, arduino-detect, ... coverage, deploy, ...
```

The grep pattern `^coverage` looks for lines **starting** with "coverage", which doesn't match the comma-separated format. The check fails, so the workflow runs `pixi run test` instead of `pixi run coverage`, which means **no lcov.info file is ever generated** in CI.

---

## Evidence

### 1. GitHub Actions Logs Show the Problem

From workflow run `19248463419` (commit `1ff489a`):

```
coverage	Test Window Spider Trigger with Coverage	2025-11-10T22:42:05.7851396Z ⚠️  No coverage task defined for window_spider_trigger
coverage	Test Window Spider Trigger with Coverage	2025-11-10T22:42:05.7851891Z Running tests only
coverage	Test Window Spider Trigger with Coverage	2025-11-10T22:42:05.7978654Z ✨ Pixi task (test in default): npm test
```

The workflow **thinks** there's no coverage task, so it runs `npm test` (no coverage).

### 2. Codecov Confirms File Not Found

```
coverage	Upload coverage reports to Codecov	2025-11-10T22:42:16.6235220Z warning - Some files were not found --- {"not_found_files": ["window_spider_trigger/coverage/lcov.info", "hatching_egg/coverage/lcov.info"]}
```

Codecov couldn't find `window_spider_trigger/coverage/lcov.info` because it was never created.

### 3. SonarCloud Confirms File Not Found

```
coverage	SonarCloud Scan	2025-11-10T22:42:57.8072343Z INFO  No LCOV files were found using window_spider_trigger/coverage/lcov.info
coverage	SonarCloud Scan	2025-11-10T22:42:57.8073811Z INFO  Analysing [/home/runner/work/halloween/halloween/spider_crawl_projection/coverage/lcov.info, /home/runner/work/halloween/halloween/hatching_egg/coverage-js/lcov.info]
```

SonarCloud analyzed spider_crawl_projection and hatching_egg (which both worked), but couldn't find window_spider_trigger's file.

### 4. SonarCloud API Shows 0% Coverage

Query: `https://sonarcloud.io/api/measures/component_tree?component=griswaldbrooks_halloween&metricKeys=coverage&qualifiers=FIL`

Results:
```
window_spider_trigger/lib/SerialPortManager.js: 0.0% (118 lines)
window_spider_trigger/server.js: 0.0% (92 lines)
window_spider_trigger/lib/SocketIOHandler.js: 0.0% (46 lines)
```

SonarCloud correctly reports 0% because it received **no coverage data**.

### 5. Local Coverage Works Fine

Local execution:
```bash
$ cd window_spider_trigger && pixi run coverage
✨ Pixi task (test-coverage): npm run test:coverage
Coverage: 98.62%
$ ls coverage/lcov.info
coverage/lcov.info  # File exists locally
```

The coverage task works perfectly locally because the grep check isn't used.

### 6. Comparison: Working vs Broken

**spider_crawl_projection (WORKS ✅):**
- CI runs: `pixi run coverage`
- Generates: `spider_crawl_projection/coverage/lcov.info`
- SonarCloud: 86-97% coverage on files
- Files found by Codecov and SonarCloud

**window_spider_trigger (BROKEN ❌):**
- CI runs: `pixi run test` (NOT `pixi run coverage`)
- Generates: Nothing (tests run without coverage)
- SonarCloud: 0% coverage on all files
- File not found by Codecov or SonarCloud

---

## Why Did This Happen?

The CI workflow was designed to be defensive - check if a `coverage` task exists before running it. The grep pattern worked for some task list formats but fails with pixi's comma-separated output format.

**Workflow logic (.github/workflows/coverage.yml, lines 30-36):**
```yaml
- name: Test Hatching Egg with Coverage
  working-directory: ./hatching_egg
  run: |
    pixi install
    if pixi task list | grep -q "^coverage"; then
      pixi run coverage
    else
      echo "⚠️  No coverage task defined for hatching_egg"
      echo "Running tests only"
      pixi run test
    fi
```

**Why the grep fails:**
- Pattern: `^coverage` (line must START with "coverage")
- Actual output: `arduino-clean, arduino-compile, ..., coverage, ...`
- The word "coverage" appears mid-line, not at the start
- Grep returns false, fallback to `pixi run test`

---

## Why Wasn't This Caught Earlier?

1. **Local testing works:** Running `pixi run coverage` locally always works (no grep check)
2. **No CI failures:** The workflow completes successfully (tests pass, just no coverage)
3. **Silent failure:** The warning message looks informational, not like an error
4. **Other projects worked:** hatching_egg and spider_crawl_projection may have passed the check by chance or different pixi versions

---

## The Fix

### Option 1: Fix the Grep Pattern (RECOMMENDED)

Change from:
```bash
if pixi task list | grep -q "^coverage"; then
```

To:
```bash
if pixi task list | grep -qE "(^|, )coverage(,|$)"; then
```

This matches "coverage" as a standalone word in a comma-separated list.

**Or simpler:**
```bash
if pixi task list | grep -q "coverage"; then
```

This matches "coverage" anywhere in the output (good enough since task names are unique).

### Option 2: Use Pixi's Built-in Check (BETTER)

Replace the grep check with pixi's own task checking:
```bash
if pixi task list coverage &>/dev/null; then
  pixi run coverage
else
  echo "⚠️  No coverage task defined"
  pixi run test
fi
```

### Option 3: Remove the Check Entirely (BEST)

Since CLAUDE.md requires all projects to have a `coverage` task, just remove the defensive check:
```yaml
- name: Test Window Spider Trigger with Coverage
  working-directory: ./window_spider_trigger
  run: |
    pixi install
    pixi run install
    pixi run coverage
```

If a project is missing the task, the workflow will fail with a clear error message.

---

## Why 12 Previous "Fixes" Didn't Work

All previous attempts focused on fixing the **wrong problems**:

1. **Jest configuration** - Changed `rootDir`, `coverageDirectory`, etc.
2. **Path prefixing** - Added `fix-lcov-paths.sh` script
3. **sonar-project.properties** - Modified coverage paths, exclusions
4. **Coverage task definition** - Verified `pixi.toml` has the task

**None of these mattered** because the CI workflow **never ran the coverage task in the first place**.

The lcov.info file was never generated in CI, so no amount of path fixing or configuration changes could help.

---

## Verification Steps (After Fix)

1. **Apply the fix** to `.github/workflows/coverage.yml`
2. **Push a commit** and wait for CI to run
3. **Check the logs** - should see:
   ```
   ✨ Pixi task (test-coverage): npm run test:coverage
   ```
   Instead of:
   ```
   ⚠️  No coverage task defined for window_spider_trigger
   ```
4. **Check Codecov** - file should be found:
   ```
   info - > /home/runner/work/halloween/halloween/window_spider_trigger/coverage/lcov.info
   ```
5. **Check SonarCloud** - should analyze the file:
   ```
   INFO  Analysing [... window_spider_trigger/coverage/lcov.info ...]
   ```
6. **Check SonarCloud dashboard** - coverage should jump from 0% to ~98%

---

## Lessons Learned

1. **Check CI logs first** - The answer was in the logs all along ("⚠️  No coverage task defined")
2. **Test workflows match local behavior** - Conditional logic in workflows can diverge from local execution
3. **Grep patterns are fragile** - Different output formats break regex assumptions
4. **Silent failures are dangerous** - A warning that looks informational was actually critical
5. **Don't guess, diagnose** - 12 config changes didn't help because they addressed the wrong problem

---

## Related Files

- **Workflow:** `.github/workflows/coverage.yml` (lines 50-61 for window_spider_trigger)
- **Task definition:** `window_spider_trigger/pixi.toml` (lines 88-91)
- **Coverage file:** `window_spider_trigger/coverage/lcov.info` (generated locally, not in CI)
- **SonarCloud config:** `sonar-project.properties` (line 19, correct but unused)

---

## Next Steps

1. **Apply Option 3 fix** (remove defensive check, simplify workflow)
2. **Test in CI** with a new commit
3. **Verify coverage appears** on SonarCloud
4. **Update CLAUDE.md** with this lesson learned
5. **Check other projects** (hatching_egg may have the same issue hidden)

---

**Investigation completed:** 2025-11-10
**Time to root cause:** ~45 minutes of systematic diagnosis
**Key insight:** The file was never generated because the workflow's conditional logic failed silently
