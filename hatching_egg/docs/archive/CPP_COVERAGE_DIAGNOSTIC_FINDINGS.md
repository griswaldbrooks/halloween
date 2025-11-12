# C++ Coverage Diagnostic Findings
**Date:** 2025-11-11
**Component:** hatching_egg
**Issue:** C++ headers appear in SonarCloud but show 0% coverage

## Executive Summary

**ROOT CAUSE IDENTIFIED:** SonarCloud has the header files in its component tree but is NOT receiving coverage data for them. The .gcov files exist locally with correct paths and coverage data, but they are not being uploaded or parsed by SonarCloud.

## Diagnostic Tool Results

### Tool 1: Enhanced SonarCloud Verification (`tools/sonarcloud_verify.py --cpp-diagnostic`)

**What SonarCloud Actually Has:**
```
Total C++ files: 10
Header files (.h): 9
Source files (.cpp): 1
Headers WITH coverage: 0
Sources WITH coverage: 1
```

**Headers in SonarCloud (ALL showing NO COVERAGE):**
- hatching_egg/arduino/hatching_egg/animation_config.h
- hatching_egg/arduino/animation_tester/animation_config.h
- hatching_egg/arduino/servo_mapping.h
- hatching_egg/arduino/servo_tester/servo_mapping.h
- hatching_egg/arduino/servo_sweep_test/servo_mapping.h
- hatching_egg/arduino/servo_sweep_test_logic.h
- hatching_egg/arduino/servo_sweep_test/servo_sweep_test_logic.h
- hatching_egg/arduino/servo_tester_logic.h
- hatching_egg/arduino/servo_tester/servo_tester_logic.h

**Source file:**
- hatching_egg/coverage_compilation.cpp (0.0% - this should have coverage!)

**KEY FINDING:** SonarCloud DOES have these files as language='cpp' in its component tree, but no coverage data is associated with them.

### Tool 2: GCOV File Diagnostic (`tools/gcov_diagnostic.py`)

**Local .gcov files with coverage data:**
```
✅ hatching_egg/arduino/servo_mapping.h - 85.1% (80/94 lines)
✅ hatching_egg/arduino/servo_sweep_test_logic.h - 100.0% (44/44 lines)
✅ hatching_egg/arduino/servo_tester_logic.h - 100.0% (33/33 lines)
```

**Files in .gcov format:**
- servo_mapping.h.gcov → Source: hatching_egg/arduino/servo_mapping.h
- servo_sweep_test_logic.h.gcov → Source: hatching_egg/arduino/servo_sweep_test_logic.h
- servo_tester_logic.h.gcov → Source: hatching_egg/arduino/servo_tester_logic.h

**Path Matching:**
- ✅ Matched: 3 (the three main header files)
- ❌ Expected but no .gcov: 10 (includes duplicates in subdirs, test files)
- ⚠️ .gcov but not in expected: 39 (stdlib headers - expected, should be ignored)

## The Problem

### What SHOULD Happen:
1. CI generates .gcov files ✅ WORKING
2. .gcov files have correct Source: paths ✅ WORKING
3. SonarCloud scanner finds and uploads .gcov files ❌ **NOT HAPPENING**
4. SonarCloud parses .gcov files and associates coverage with files ❌ **NOT HAPPENING**
5. SonarCloud displays coverage for headers ❌ **NOT HAPPENING**

### What IS Happening:
1. SonarCloud finds and analyzes the header files (they appear in component tree) ✅
2. SonarCloud does NOT have coverage data for these files ❌
3. The .gcov files exist locally but are NOT being uploaded/used by SonarCloud ❌

## Hypotheses (Ranked by Likelihood)

### Hypothesis 1: .gcov Files Not Being Uploaded to SonarCloud (MOST LIKELY)
**Evidence:**
- .gcov files exist locally with correct coverage data
- SonarCloud shows 0% coverage for all headers
- SonarCloud shows 0% for coverage_compilation.cpp (which SHOULD have coverage)

**Potential causes:**
- .gcov files not in the directory that sonar-scanner looks in
- sonar.cfamily.gcov.reportsPath not set or incorrect
- .gcov files generated AFTER sonar-scanner runs
- .gitignore or .sonarignore excluding .gcov files

### Hypothesis 2: Path Mismatch Between .gcov and SonarCloud (LESS LIKELY)
**Evidence:**
- .gcov Source paths: `hatching_egg/arduino/servo_mapping.h`
- SonarCloud file keys: `hatching_egg/arduino/servo_mapping.h`
- **PATHS MATCH** (contradiction: this should work!)

**Potential causes:**
- SonarCloud might need absolute paths?
- sonar.cfamily.gcov.pathPrefix needed?

### Hypothesis 3: .gcov File Format Issue (UNLIKELY)
**Evidence:**
- .gcov files parse correctly locally
- genhtml generates HTML coverage report successfully
- Format appears standard

**Potential causes:**
- SonarCloud requires specific gcov version?
- Binary vs text .gcov format?

## Next Steps (In Order)

### Step 1: Verify .gcov Files Are In Scanner's Search Path ✅ DO THIS FIRST
**Action:**
```bash
# Check current sonar-project.properties
grep gcov sonar-project.properties

# Expected to find:
# sonar.cfamily.gcov.reportsPath=<path>
```

**If missing:** Add `sonar.cfamily.gcov.reportsPath=hatching_egg/*.gcov` or similar

**If present but wrong:** Fix the path to where .gcov files actually are

### Step 2: Verify .gcov Files Generated BEFORE Scanner Runs
**Action:**
```bash
# Check CI workflow order
# coverage generation → .gcov file creation → sonar-scanner

# Verify .gcov files exist when scanner runs
ls hatching_egg/*.gcov  # Should list files
```

**If .gcov generated after scanner:** Reorder CI steps

### Step 3: Check .gitignore / .sonarignore
**Action:**
```bash
# Check if .gcov files are ignored
grep gcov .gitignore .sonarignore

# If found, either:
# 1. Remove the exclusion
# 2. OR force-include in sonar-project.properties
```

### Step 4: Try LCOV Format Instead
**Action:**
Generate lcov.info and use `sonar.cfamily.lcov.reportPaths` instead of gcov

**Rationale:**
- LCOV format is more standardized
- Might have better SonarCloud support
- Already working for JavaScript

### Step 5: Add sonar.cfamily.gcov.pathPrefix If Needed
**Action:**
If paths still mismatch after above fixes:
```properties
sonar.cfamily.gcov.pathPrefix=halloween/
# OR
sonar.cfamily.gcov.pathPrefix=/home/griswald/personal/halloween/
```

## Files To Investigate

1. **sonar-project.properties** - Check gcov configuration
2. **.github/workflows/*.yml** - Verify CI step ordering
3. **.gitignore** - Check for .gcov exclusions
4. **.sonarignore** - Check for .gcov exclusions
5. **hatching_egg/pixi.toml** - Verify coverage task generates .gcov in correct location

## Success Criteria

When fixed, we should see:
- ✅ SonarCloud shows ~85% coverage for servo_mapping.h
- ✅ SonarCloud shows 100% coverage for servo_tester_logic.h
- ✅ SonarCloud shows 100% coverage for servo_sweep_test_logic.h
- ✅ coverage_compilation.cpp shows >0% coverage
- ✅ Overall C++ coverage: ~85-90% (matching local)

## Tools Created

### 1. Enhanced SonarCloud Verification Tool
**Location:** `tools/sonarcloud_verify.py`

**Usage:**
```bash
# C++ diagnostic report
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component hatching_egg \
    --cpp-diagnostic
```

**Features:**
- Language breakdown (how many files per language)
- C++ file count (headers vs sources)
- Coverage status per file
- Exclusion configuration
- Complete file list for component

### 2. GCOV File Diagnostic Tool
**Location:** `tools/gcov_diagnostic.py`

**Usage:**
```bash
# Validate .gcov files and check paths
python tools/gcov_diagnostic.py hatching_egg
```

**Features:**
- Finds all .gcov files in project
- Parses each .gcov file for Source: path
- Calculates coverage percentages
- Compares .gcov paths with expected SonarCloud paths
- Identifies mismatches and missing files

## Lessons Learned

1. **SonarCloud file presence ≠ coverage data presence**
   - Files can be in the component tree but have no coverage
   - Must verify coverage data separately

2. **Local .gcov generation ≠ SonarCloud receiving data**
   - Just because coverage works locally doesn't mean SonarCloud gets it
   - Must verify upload/parsing step

3. **Build tools when verification is hard**
   - Enhanced sonarcloud_verify.py gave us ground truth
   - gcov_diagnostic.py validated local state
   - Without tools, we'd be guessing

4. **Path matching is critical**
   - Even small path differences can break coverage association
   - Must verify exact path format SonarCloud expects vs what .gcov provides

## References

- SonarCloud API: https://sonarcloud.io/web_api/api/
- GCOV format: https://gcc.gnu.org/onlinedocs/gcc/Invoking-Gcov.html
- SonarCloud C++ coverage: https://docs.sonarcloud.io/advanced-setup/languages/c-c-objective-c/

---

**Next Agent:** Start with Step 1 - check sonar-project.properties for gcov configuration!
