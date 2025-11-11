# Next Agent: Start Here

## Quick Start - First 5 Minutes

**READ THESE FILES FIRST:**
1. SESSION_2025-11-11.md - What was accomplished, what needs work
2. VERIFIED_LOCAL_COVERAGE.md - Current verified state
3. tools/README.md - How to use verification tools

**RUN THESE COMMANDS:**
```bash
# See current SonarCloud state
python tools/sonarcloud_verify.py --project griswaldbrooks_halloween

# Check hatching_egg specifically
python tools/sonarcloud_verify.py --component hatching_egg

# Run all local tests
bash verify-all.sh
```

## Your Priority: Fix SonarCloud C++ Coverage Display

### The Problem

**Local state:** hatching_egg C++ coverage is 85.9% (171 tests, verified)
**SonarCloud state:** C++ coverage not displaying (0% or "No coverage data")

**Evidence it SHOULD work:**
- ✅ .gcov files generated (hatching_egg/coverage-cpp/*.gcov)
- ✅ SonarCloud analyzes C++ files (shows code issues)
- ✅ SonarCloud parses .gcov files (confirmed in CI logs)
- ❌ Coverage NOT displayed in dashboard

### Hypothesis: Path Mismatch

**.gcov file paths:**
```
Source:arduino/servo_mapping.h
Source:arduino/servo_tester_logic.h
```

**SonarCloud may expect:**
```
hatching_egg/arduino/servo_mapping.h
hatching_egg/arduino/servo_tester_logic.h
```

### Investigation Steps

**1. Use the tool to see what SonarCloud sees:**
```bash
python tools/sonarcloud_verify.py --component hatching_egg
```

Look for:
- Are header files in the file list?
- What are their exact keys?
- Do they have coverage data?

**2. Check .gcov file contents:**
```bash
cat hatching_egg/coverage-cpp/servo_mapping.h.gcov | head -30
```

Look for:
- `Source:` line - what path is listed?
- Is it relative or absolute?
- Does it need a prefix?

**3. Check SonarCloud configuration:**
```bash
cat sonar-project.properties | grep -A5 -B5 gcov
```

Look for:
- `sonar.cfamily.gcov.reportsPath` - is it correct?
- Is there a `sonar.cfamily.gcov.pathPrefix` property?
- Should we add one?

**4. Check CI logs:**
```bash
gh run list --workflow=coverage.yml --limit 1
gh run view <run-id> --log | grep -A10 "gcov"
```

Look for:
- Does SonarCloud find the .gcov files?
- Are there warnings about path mismatches?
- What paths does SonarCloud report?

### Potential Solutions

**Option A: Add path prefix**
```properties
# In sonar-project.properties
sonar.cfamily.gcov.reportsPath=hatching_egg/coverage-cpp
sonar.cfamily.gcov.pathPrefix=hatching_egg/
```

**Option B: Adjust gcov generation**
```bash
# In hatching_egg/pixi.toml
# Generate .gcov with correct paths
gcov -p -o coverage-cpp arduino/*.h
```

**Option C: Use relative paths consistently**
Ensure .gcov `Source:` paths match SonarCloud file keys exactly.

### Testing Your Fix

**After making changes:**

1. **Test locally:**
   ```bash
   cd hatching_egg
   pixi run test-cpp-coverage
   ls -la coverage-cpp/*.gcov
   cat coverage-cpp/servo_mapping.h.gcov | head -10
   ```

2. **Commit and push:**
   ```bash
   git add <files>
   git commit -m "Fix C++ coverage paths for SonarCloud display"
   git push
   ```

3. **Wait for CI:**
   ```bash
   gh run watch
   ```

4. **Verify with tool:**
   ```bash
   python tools/sonarcloud_verify.py --component hatching_egg
   ```

5. **Ask user to confirm in dashboard** (you can't see the UI)

### Success Criteria

- ✅ tools/sonarcloud_verify.py shows C++ files with coverage
- ✅ Coverage percentages displayed (~85% expected)
- ✅ User can see coverage in their SonarCloud dashboard
- ✅ No "No coverage data" for header files

### Reference Documents

- **API Details:** tools/SONARCLOUD_API.md
- **Testing Guide:** PRODUCTION_EMBEDDED_TESTING.md
- **Current State:** VERIFIED_LOCAL_COVERAGE.md
- **Session History:** SESSION_2025-11-11.md

### Don't Repeat Past Mistakes

❌ **Don't** claim it works without running the verification tool
❌ **Don't** guess what SonarCloud sees - use the API
❌ **Don't** make changes without understanding root cause
❌ **Don't** skip verification steps

✅ **Do** use tools/sonarcloud_verify.py to get ground truth
✅ **Do** show actual output when reporting results
✅ **Do** investigate thoroughly before making changes
✅ **Do** ask user to confirm UI when tool shows success

## After C++ Coverage Fix

**Next priority:** twitching_body refactoring (0% coverage → 80%)

**Guide:** PRODUCTION_EMBEDDED_TESTING.md has complete patterns
**Estimate:** 8-12 hours

**Pattern to follow:**
1. Extract logic from .ino to headers
2. Create interface classes (IServoController, etc.)
3. Write unit tests (target: 80%)
4. Create mocks for testing
5. Add integration tests
6. Verify with tools

## Tools at Your Disposal

**Verification:**
- `python tools/sonarcloud_verify.py` - See SonarCloud state
- `bash verify-all.sh` - Run all local tests
- `pixi run coverage` - Generate coverage reports

**Testing:**
- `pixi run test` - Run project tests
- `pixi run test-cpp-coverage` - C++ tests with coverage
- `pixi run view-coverage` - Open coverage report

**Investigation:**
- `gh run list` - See CI runs
- `gh run view <id> --log` - View CI logs
- API documentation in tools/SONARCLOUD_API.md

## Questions?

Read the documentation files:
- SESSION_2025-11-11.md (comprehensive session summary)
- VERIFIED_LOCAL_COVERAGE.md (what's working)
- PRODUCTION_EMBEDDED_TESTING.md (how to write production code)
- tools/README.md (how to use tools)
- tools/SONARCLOUD_API.md (API reference)

Good luck! The groundwork is laid, now fix that C++ coverage display!
