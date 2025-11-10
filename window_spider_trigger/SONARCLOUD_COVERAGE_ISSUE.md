# SonarCloud Coverage Integration Issue

**Status:** window_spider_trigger achieving 98.62% local coverage, but SonarCloud reports 0%
**Date:** 2025-11-10
**Priority:** HIGH - Blocking coverage visibility

## Summary

The window_spider_trigger project has:
- ✅ **98.62% test coverage locally** (93 passing tests, 0 skipped)
- ✅ **Comprehensive refactoring** with dependency injection
- ✅ **Proper lcov.info generation** with correct paths
- ❌ **SonarCloud showing 0% coverage** for all 3 files

## What Works Locally

```bash
cd window_spider_trigger
pixi run coverage
```

Output:
```
File                       | % Stmts | % Branch | % Funcs | % Lines |
---------------------------|---------|----------|---------|---------|
All files                  |   98.62 |    91.89 |   94.44 |   98.59 |
 window_spider_trigger     |   94.87 |    84.61 |   71.42 |   94.87 |
  server.js                |   94.87 |    84.61 |   71.42 |   94.87 |
 window_spider_trigger/lib |     100 |    95.83 |     100 |     100 |
  SerialPortManager.js     |     100 |    95.45 |     100 |     100 |
  SocketIOHandler.js       |     100 |      100 |     100 |     100 |
```

## What's Configured

### 1. Jest Coverage Generation
- **Location:** `jest.config.js`
- **Coverage directory:** `coverage/`
- **Reporter:** `lcov` (among others)
- **Generates:** `coverage/lcov.info` with relative paths

### 2. Path Fixing Script
- **Location:** `../scripts/fix-lcov-paths.sh`
- **Purpose:** Prepend `window_spider_trigger/` to relative paths
- **Status:** ✅ Idempotent (safe to run multiple times)
- **Input:** `SF:server.js`
- **Output:** `SF:window_spider_trigger/server.js`

### 3. SonarCloud Configuration
- **Location:** `../sonar-project.properties`
- **Coverage path:** `sonar.javascript.lcov.reportPaths=window_spider_trigger/coverage/lcov.info`
- **Sources:** `sonar.sources=.` (entire repo)
- **Exclusions:** Test files, node_modules, coverage dirs

### 4. CI Workflow
- **Location:** `../.github/workflows/coverage.yml`
- **Steps:**
  1. Run `pixi run coverage` in window_spider_trigger/
  2. Run `./scripts/fix-lcov-paths.sh` to fix paths
  3. Upload to Codecov
  4. Run SonarCloud Scan

## What's in lcov.info

After fix script runs:
```
SF:window_spider_trigger/server.js
SF:window_spider_trigger/lib/SerialPortManager.js
SF:window_spider_trigger/lib/SocketIOHandler.js
```

File size: 278 lines (compared to spider_crawl_projection: 2245 lines)

## Investigation Steps for Next Agent

### 1. Verify CI Artifacts

Check if coverage files are being uploaded:
```bash
# Look at GitHub Actions artifacts
# Verify window_spider_trigger/coverage/lcov.info exists
# Check file size (should be ~278 lines)
# Verify paths start with "SF:window_spider_trigger/"
```

### 2. Check SonarCloud Scanner Logs

Look for warnings/errors in SonarCloud analysis:
- Is lcov.info being found?
- Are paths being matched to source files?
- Any exclusion patterns catching these files?

### 3. Compare with Working Project

spider_crawl_projection IS showing coverage (86-88%) on some files:
```bash
# Compare lcov.info format between projects
diff window_spider_trigger/coverage/lcov.info spider_crawl_projection/coverage/lcov.info

# Check if there's a pattern difference
```

### 4. Test SonarCloud Locally

```bash
# Install sonar-scanner locally
# Run against window_spider_trigger
# Check what files it finds and analyzes
```

## Potential Root Causes

### Theory 1: Timing Issue
The fix-lcov-paths.sh script runs AFTER coverage generation but BEFORE SonarCloud scan.
Maybe SonarCloud is scanning before the script runs?

**Check:** CI workflow order in .github/workflows/coverage.yml

### Theory 2: File Size
window_spider_trigger lcov.info is only 278 lines vs 2245 for spider_crawl_projection.
Maybe SonarCloud has a minimum threshold?

**Check:** SonarCloud documentation for minimum coverage file size

### Theory 3: Path Mismatch
SonarCloud might be looking for files at different paths than what's in lcov.info.

**Check:**
- SonarCloud's file tree view
- Verify exact file paths match between source and lcov.info

### Theory 4: Language Detection
Maybe SonarCloud isn't recognizing window_spider_trigger files as JavaScript?

**Check:**
- sonar.javascript.file.suffixes in sonar-project.properties
- Language detection in SonarCloud dashboard

### Theory 5: Exclusion Pattern
Maybe an exclusion pattern is accidentally catching these files?

**Check:**
```
sonar.exclusions=**/node_modules/**,**/coverage*/**,**/*.test.js,...
```
Verify `window_spider_trigger/server.js` doesn't match any pattern.

## Files Modified in Refactoring

All these files should show coverage:

1. **window_spider_trigger/server.js** (142 lines)
   - Main server with dependency injection
   - Coverage: 94.87%

2. **window_spider_trigger/lib/SerialPortManager.js** (204 lines)
   - Serial port communication logic
   - Coverage: 100%

3. **window_spider_trigger/lib/SocketIOHandler.js** (103 lines)
   - Socket.IO event handlers
   - Coverage: 100%

## Next Steps

1. **Immediate:** Check GitHub Actions logs for the latest coverage.yml run
2. **Verify:** Coverage files are uploaded as artifacts
3. **Compare:** lcov.info between window_spider_trigger and spider_crawl_projection
4. **Test:** Run sonar-scanner locally to reproduce the issue
5. **Document:** Findings and solution once discovered

## References

- Local coverage works: `pixi run coverage` shows 98.62%
- CI workflow: `.github/workflows/coverage.yml`
- SonarCloud config: `sonar-project.properties`
- Fix script: `scripts/fix-lcov-paths.sh`
- Issue tracking: This file

## Contact

If you solve this, please:
1. Document the solution here
2. Update CLAUDE.md with the fix
3. Add comments to relevant config files
4. Consider adding a verification step to CI

---

**Last Updated:** 2025-11-10
**Status:** UNRESOLVED - Investigating
**Impact:** Coverage metrics not visible in SonarCloud despite 98.62% local coverage
