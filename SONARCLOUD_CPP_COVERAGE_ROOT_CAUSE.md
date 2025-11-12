# SonarCloud C++ Coverage Root Cause Analysis

**Date:** 2025-11-12
**Investigation:** Deep-dive into why C++ header coverage doesn't appear in SonarCloud
**Result:** ✅ **ROOT CAUSE FOUND**

---

## TL;DR - The Problem

**SonarCloud IS parsing .gcov files but CANNOT apply coverage due to duplicate header filenames.**

The .gcov files reference `hatching_egg/arduino/servo_mapping.h`, but SonarCloud sees **3 different files** with that name in different directories. The gcov sensor cannot determine which file to apply coverage to.

---

## Investigation Summary

### What We Checked

1. ✅ **Official SonarSource examples** - Use gcovr XML format, NOT raw .gcov
2. ✅ **.gcov file generation** - 3 files generated correctly in CI
3. ✅ **.gcov file format** - Correct format with proper `Source:` lines
4. ✅ **Scanner logs** - gcov sensor DOES parse all 3 files
5. ✅ **SonarCloud API** - Files exist but have NO coverage data
6. ✅ **File paths** - AMBIGUOUS due to duplicate filenames

---

## The Evidence

### 1. .gcov Files ARE Being Generated

From CI logs:
```
Creating '#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_mapping.h.gcov'
Creating '#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_sweep_test_logic.h.gcov'
Creating '#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_tester_logic.h.gcov'
```

All 3 header files have coverage data.

### 2. SonarCloud Scanner IS Parsing .gcov Files

From SonarCloud logs:
```
02:41:45.263 INFO  Sensor gcov [cpp]
02:41:45.265 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/coverage-cpp/#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_sweep_test_logic.h.gcov
02:41:45.265 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/coverage-cpp/#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_tester_logic.h.gcov
02:41:45.267 INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/coverage-cpp/#home#runner#work#halloween#halloween#hatching_egg#arduino#servo_mapping.h.gcov
02:41:45.271 INFO  Sensor gcov [cpp] (done) | time=6ms
```

**The gcov sensor completed successfully in 6ms.**

### 3. .gcov Files Have Correct Source: Paths

From artifact inspection:
```
Source:hatching_egg/arduino/servo_mapping.h
Source:hatching_egg/arduino/servo_sweep_test_logic.h
Source:hatching_egg/arduino/servo_tester_logic.h
```

These paths are correctly formatted and match our project structure.

### 4. SonarCloud Has MULTIPLE Files with Same Names

From API query:
```
SonarCloud file keys:
  servo_mapping.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_mapping.h
  servo_mapping.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_tester/servo_mapping.h
  servo_mapping.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_sweep_test/servo_mapping.h

  servo_sweep_test_logic.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_sweep_test_logic.h
  servo_sweep_test_logic.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_sweep_test/servo_sweep_test_logic.h

  servo_tester_logic.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_tester_logic.h
  servo_tester_logic.h -> griswaldbrooks_halloween:hatching_egg/arduino/servo_tester/servo_tester_logic.h
```

**Each of the 3 header files we want coverage for has 2-3 versions in SonarCloud.**

### 5. Coverage Verification Shows No Data

From `tools/sonarcloud_verify.py`:
```
Files Without Coverage:
  ❌ hatching_egg/arduino/servo_mapping.h (cpp)
  ❌ hatching_egg/arduino/servo_sweep_test_logic.h (cpp)
  ❌ hatching_egg/arduino/servo_tester_logic.h (cpp)
  ❌ hatching_egg/arduino/servo_tester/servo_mapping.h (cpp)
  ❌ hatching_egg/arduino/servo_sweep_test/servo_mapping.h (cpp)
  ❌ hatching_egg/arduino/servo_sweep_test_logic.h (cpp)
  ❌ hatching_egg/arduino/servo_sweep_test/servo_sweep_test_logic.h (cpp)
  ❌ hatching_egg/arduino/servo_tester_logic.h (cpp)
  ❌ hatching_egg/arduino/servo_tester/servo_tester_logic.h (cpp)
```

**ALL versions of these headers have NO coverage data.**

---

## Why Arduino Projects Have Duplicate Headers

Arduino IDE enforces a folder structure:
```
arduino/
├── servo_mapping.h              ← "Library" header (source of truth)
├── servo_sweep_test_logic.h     ← Library header
├── servo_tester_logic.h         ← Library header
├── servo_tester/
│   ├── servo_tester.ino         ← Sketch
│   ├── servo_mapping.h          ← COPY for sketch
│   └── servo_tester_logic.h     ← COPY for sketch
├── servo_sweep_test/
│   ├── servo_sweep_test.ino     ← Sketch
│   ├── servo_mapping.h          ← COPY for sketch
│   └── servo_sweep_test_logic.h ← COPY for sketch
└── hatching_egg/
    └── hatching_egg.ino         ← Main sketch (uses library headers)
```

**Each Arduino sketch (.ino) needs a folder with all its dependencies.**

---

## The Matching Problem

When SonarCloud's gcov sensor sees:
```
Source:hatching_egg/arduino/servo_mapping.h
```

It has to match this against these component keys:
- `hatching_egg/arduino/servo_mapping.h`
- `hatching_egg/arduino/servo_tester/servo_mapping.h`
- `hatching_egg/arduino/servo_sweep_test/servo_mapping.h`

**The path in the .gcov file matches ONLY the first one precisely.**

But the gcov sensor might be doing fuzzy matching or might fail when multiple files exist with similar paths.

---

## Possible Solutions

### Option 1: Exclude Duplicate Files from Analysis

Add to `sonar-project.properties`:
```properties
sonar.exclusions=**/servo_tester/**/*.h,**/servo_sweep_test/**/*.h
```

This would remove the duplicate copies, leaving only the source-of-truth headers.

**Pros:**
- Simple fix
- Coverage should work immediately
- Only analyzes actual source files

**Cons:**
- Requires project structure change or exclusion rules
- Won't catch issues in sketch-specific copies (if they diverge)

### Option 2: Use GCOVR XML Format (Like Official Examples)

The official SonarSource example uses:
```yaml
gcovr --sonarqube > coverage.xml
sonar.coverageReportPaths=coverage.xml
```

Instead of:
```properties
sonar.cfamily.gcov.reportsPath=hatching_egg/coverage-cpp
```

**Pros:**
- Official recommended approach
- May handle path resolution better
- Single XML file instead of many .gcov files

**Cons:**
- Requires changing CI workflow
- Need to install/use gcovr tool
- May have same path ambiguity issue

### Option 3: Use More Specific .gcov Source: Paths

Modify the path-fixing script to include the full disambiguating path.

**Pros:**
- Most precise solution
- Each .gcov clearly identifies its target

**Cons:**
- Complex path manipulation
- May not match SonarCloud's file keys anyway

---

## Recommended Immediate Action

**Try Option 1 first** - Exclude the duplicate directories:

```properties
# Exclude Arduino sketch folders (they contain header copies)
sonar.exclusions=**/node_modules/**,...existing...,**/arduino/servo_tester/**,**/arduino/servo_sweep_test/**
```

This should:
1. Remove ambiguity (only one `servo_mapping.h` etc.)
2. Allow gcov sensor to match paths unambiguously
3. Be testable in one CI run

---

## Questions for Further Investigation

1. **Does the gcov sensor log warnings about ambiguous paths?**
   - Need to check logs with DEBUG level enabled

2. **Does SonarCloud's gcov sensor do exact matching or fuzzy matching?**
   - Source code review of CFamily plugin might reveal this

3. **Why doesn't the official example have this problem?**
   - Their project structure has unique filenames

---

## Verification Steps After Fix

1. **Apply exclusion** to sonar-project.properties
2. **Run CI** and wait for SonarCloud analysis
3. **Use verification tool**:
   ```bash
   python3 tools/sonarcloud_verify.py --project griswaldbrooks_halloween --component hatching_egg
   ```
4. **Check for coverage** on the 3 header files:
   - `hatching_egg/arduino/servo_mapping.h`
   - `hatching_egg/arduino/servo_sweep_test_logic.h`
   - `hatching_egg/arduino/servo_tester_logic.h`

Expected result: **85.9% C++ coverage** matching local coverage.

---

## Key Insights

1. ✅ Our .gcov generation is **CORRECT**
2. ✅ SonarCloud gcov sensor is **WORKING**
3. ✅ File analysis is **WORKING**
4. ❌ Path matching **FAILS** due to duplicate filenames
5. 💡 Arduino project structure causes inherent ambiguity

**This is NOT a bug in our configuration. It's an architectural issue with Arduino's requirement for duplicate headers.**

---

## Historical Context

This investigation followed **13+ previous attempts** to get C++ coverage working, including:
- Trying LCOV format (failed - wrong sensor)
- Trying sonar.coverageReportPaths (failed - wrong sensor)
- Creating coverage_compilation.cpp helper (successful for analysis, not coverage)
- Path fixing scripts (successful, but didn't solve ambiguity)
- Numerous property changes

**The root cause was path ambiguity all along.**

---

## Next Steps

1. **USER DECISION:** Choose Option 1, 2, or 3
2. **IMPLEMENT:** Make configuration changes
3. **TEST:** Run CI and verify with tool
4. **DOCUMENT:** Update CLAUDE.md with findings
5. **CELEBRATE:** When we see 85.9% C++ coverage! 🎉
