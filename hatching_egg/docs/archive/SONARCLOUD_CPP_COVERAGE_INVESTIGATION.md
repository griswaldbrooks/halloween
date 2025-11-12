# SonarCloud C++ Coverage Investigation

**Status:** Partially Resolved - Needs User Verification in SonarCloud Dashboard

**Last Updated:** 2025-11-11 (CI run: 19277928840, commit: 5577375)

## Summary

C++ coverage is being generated locally (85.9%, 171 GoogleTest tests) and .gcov files are being parsed by SonarCloud, but coverage is not displaying in the SonarCloud dashboard. Added `sonar.cfamily.gcov.pathPrefix` property as a potential fix.

## What Works ✅

1. **Local C++ coverage generation**
   - 85.9% coverage (1621/1888 lines)
   - 171 GoogleTest tests passing
   - Command: `cd hatching_egg && pixi run test-cpp-coverage`
   - HTML report: `hatching_egg/coverage-cpp/index.html`

2. **.gcov files are generated**
   - Files: `arduino#servo_mapping.h.gcov`, `arduino#servo_tester_logic.h.gcov`, `arduino#servo_sweep_test_logic.h.gcov`
   - Location: `hatching_egg/` directory (root of project)
   - Source paths in files: `Source:arduino/servo_mapping.h` (relative)

3. **SonarCloud is analyzing C++ files**
   - C++ files visible in SonarCloud (confirmed via API)
   - Code quality issues are being reported
   - Compilation database (compile_commands.json) is working

4. **SonarCloud is parsing .gcov files**
   - CI logs show: "Parsing /home/runner/work/halloween/halloween/hatching_egg/arduino#servo_mapping.h.gcov"
   - Gcov sensor runs successfully: "Sensor gcov [cpp] (done) | time=190ms"
   - NO parse errors or warnings

## What Doesn't Work ❌

1. **Coverage NOT displaying in dashboard**
   - API verification shows: Files in "Files Without Coverage" list
   - Example: `hatching_egg/arduino/servo_mapping.h` shows "NO COVERAGE DATA"
   - Expected: Should show ~85% coverage

## Root Cause Analysis

### Hypothesis: Path Mismatch

**.gcov file contains:**
```
Source:arduino/servo_mapping.h
```

**SonarCloud file key:**
```
hatching_egg/arduino/servo_mapping.h
```

**The mismatch:**
- .gcov says `arduino/servo_mapping.h`
- SonarCloud expects `hatching_egg/arduino/servo_mapping.h`

### Fix Attempted (Commit 5577375)

Added to `sonar-project.properties`:
```properties
sonar.cfamily.gcov.pathPrefix=hatching_egg/
```

**Rationale:** This tells SonarCloud to prepend "hatching_egg/" to all Source: paths in .gcov files.

**Expected result:** `arduino/servo_mapping.h` → `hatching_egg/arduino/servo_mapping.h`

## Verification Evidence

### CI Logs (Run 19277928840)

**✅ .gcov files generated:**
```
Creating 'arduino#servo_mapping.h.gcov'
Creating 'arduino#servo_tester_logic.h.gcov'
Creating 'arduino#servo_sweep_test_logic.h.gcov'
```

**✅ SonarCloud parsed them:**
```
20:40:33.047 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/arduino#servo_mapping.h.gcov
20:40:33.055 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/arduino#servo_tester_logic.h.gcov
20:40:33.067 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/arduino#servo_sweep_test_logic.h.gcov
20:40:33.070 INFO  Sensor gcov [cpp] (done) | time=190ms
```

**✅ No errors or warnings** in gcov sensor logs

### API Verification (tools/sonarcloud_verify.py)

**Before fix (ca24e1c):**
```
Files Without Coverage:
❌ hatching_egg/arduino/servo_mapping.h (cpp)
❌ hatching_egg/arduino/servo_tester_logic.h (cpp)
❌ hatching_egg/arduino/servo_sweep_test_logic.h (cpp)
```

**After fix (5577375) - SAME RESULT:**
```
Files Without Coverage:
❌ hatching_egg/arduino/servo_mapping.h (cpp)
❌ hatching_egg/arduino/servo_tester_logic.h (cpp)
❌ hatching_egg/arduino/servo_sweep_test_logic.h (cpp)
```

## Configuration

### Current sonar-project.properties
```properties
# C++ (hatching_egg Arduino header files)
# Coverage: 85.9% local (1621/1888 lines, 171 GoogleTest tests)
# Analysis enabled using compilation database from bear
# SonarCloud requires native .gcov files (NOT LCOV format) for C++
# pathPrefix maps .gcov Source: paths to SonarCloud file keys
sonar.cfamily.gcov.reportsPath=hatching_egg/
sonar.cfamily.gcov.pathPrefix=hatching_egg/

sonar.cfamily.compile-commands=hatching_egg/compile_commands.json
sonar.cpp.file.suffixes=.h,.cpp
```

### .gcov File Content
```
File: arduino#servo_mapping.h.gcov
Located: hatching_egg/arduino#servo_mapping.h.gcov

Content:
        -:    0:Source:arduino/servo_mapping.h
        -:    1:/*
        -:    2: * Servo Mapping Logic - Per-Servo Calibrated Ranges
        ...
```

## Potential Issues

1. **pathPrefix property may not work as expected**
   - SonarCloud documentation is sparse on this property
   - May only work with certain gcov formats
   - May require different syntax

2. **Timing issue**
   - SonarCloud may need more time to reprocess
   - API was checked ~2 minutes after CI completion
   - Dashboard might not be immediately updated

3. **Different gcov format needed**
   - Currently using: `gcov -p <files>` (preserve paths mode)
   - May need to try different gcov flags
   - LCOV format doesn't work (previously tested)

## What Has Been Tried

1. ❌ **LCOV format for C++** (commit 016edc6)
   - Changed from LCOV to native .gcov format
   - Result: SonarCloud didn't process LCOV for C++

2. ❌ **coverage_compilation.cpp helper** (commit f13cea7)
   - Created helper file to include headers in compilation DB
   - Result: Helped with C++ analysis, but not coverage display

3. ❌ **Excluded test files from sonar.sources** (commit 388839f)
   - Prevented test files from being analyzed
   - Result: Improved analysis, but coverage still not displayed

4. ✅ **Native .gcov files** (commit 016edc6)
   - Switched to native gcov format
   - Result: Files ARE being parsed by SonarCloud

5. ⏳ **pathPrefix property** (commit 5577375) - **CURRENT ATTEMPT**
   - Added sonar.cfamily.gcov.pathPrefix=hatching_egg/
   - Result: API shows no change yet (may need time)

## Next Steps

### For User (CANNOT BE VERIFIED BY AGENT)

**Please check the SonarCloud web dashboard:**
1. Go to: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween
2. Navigate to: hatching_egg project
3. Check: Are C++ files showing coverage now?
4. Look for: `hatching_egg/arduino/servo_mapping.h` with coverage percentage

**If YES:** The pathPrefix fix worked, but SonarCloud API lags behind the dashboard.

**If NO:** We need to try alternative approaches (see below).

### Alternative Approaches (If pathPrefix Doesn't Work)

1. **Try different gcov invocation**
   ```bash
   # Option A: Use working directory parameter
   gcov -r hatching_egg/ <files>

   # Option B: Generate with full paths in Source: line
   cd /home/runner/work/halloween/halloween
   gcov hatching_egg/*.gcda

   # Option C: Post-process .gcov files to adjust Source: paths
   sed -i 's|Source:arduino/|Source:hatching_egg/arduino/|' *.gcov
   ```

2. **Contact SonarCloud support**
   - Provide CI logs showing .gcov files ARE being parsed
   - Ask why coverage isn't being attributed to source files
   - Request clarification on pathPrefix property usage

3. **Try sonar.sources modification**
   - Change sonar.sources to be more specific
   - Explicitly list hatching_egg/arduino/*.h files

4. **Investigate file key mismatch**
   - Use API to get exact file key for servo_mapping.h
   - Manually adjust .gcov Source: line to match exactly

## References

- **Session history:** SESSION_2025-11-11.md
- **Verification tool:** tools/sonarcloud_verify.py
- **CI run:** https://github.com/griswaldbrooks/halloween/actions/runs/19277928840
- **Commit:** 5577375be5ebce77bcdc6a0c65e2ac50cfad331a

## For Next Agent

**Start here:**
1. Ask user: "Does C++ coverage display in SonarCloud dashboard now?"
2. If YES: Update VERIFIED_LOCAL_COVERAGE.md, close this issue
3. If NO: Try alternative approaches listed above

**Tools:**
```bash
# Verify SonarCloud state
python tools/sonarcloud_verify.py --component hatching_egg

# Regenerate coverage locally
cd hatching_egg && pixi run test-cpp-coverage

# Check .gcov file content
head -5 hatching_egg/arduino#servo_mapping.h.gcov

# View CI logs
gh run view 19277928840 --log | grep -i "gcov\|coverage"
```

**Key insight:** SonarCloud IS parsing the .gcov files (confirmed in logs), but the coverage data isn't being mapped to the source files. This is a path matching issue, not a file discovery or parsing issue.
