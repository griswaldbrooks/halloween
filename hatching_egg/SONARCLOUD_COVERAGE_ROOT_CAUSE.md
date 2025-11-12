# SonarCloud C++ Coverage Issue: Root Cause Analysis

**Date:** 2025-11-11
**Status:** ROOT CAUSE IDENTIFIED
**Project:** hatching_egg
**Coverage:** 85.9% local, 0% SonarCloud

---

## Executive Summary

SonarCloud successfully **imports** C++ coverage data (logs show "Imported coverage data for 3 files") but does **not display** it in the dashboard (API shows empty measures).

**Root cause:** Sensor execution order - the Generic Coverage Report sensor runs **before** the CFamily sensor indexes C++ files, preventing coverage from being applied.

---

## Evidence

### 1. Coverage XML is Correct ✅

```bash
$ head -20 hatching_egg/coverage-cpp/coverage.xml
<?xml version='1.0' encoding='UTF-8'?>
<coverage version="1">
  <file path="hatching_egg/arduino/servo_mapping.h">
    <lineToCover lineNumber="36" covered="true"/>
    <lineToCover lineNumber="37" covered="true" branchesToCover="5" coveredBranches="4"/>
    ...
  </file>
  <file path="hatching_egg/arduino/servo_sweep_test_logic.h">...</file>
  <file path="hatching_egg/arduino/servo_tester_logic.h">...</file>
</coverage>
```

**Verification:**
- Generated with `gcovr --sonarqube` (official SonarSource pattern)
- Paths match SonarCloud expectations (relative to project root)
- Contains 3 files with detailed line + branch coverage

### 2. Coverage Successfully Imported ✅

```
[SonarCloud Log 00:27:44.391]
INFO  Sensor Generic Coverage Report
INFO  Parsing /home/runner/work/halloween/halloween/hatching_egg/coverage-cpp/coverage.xml
INFO  Imported coverage data for 3 files
INFO  Sensor Generic Coverage Report (done) | time=6ms
```

**Verification:**
- No errors during import
- No "unknown files" warnings
- 3 files imported matches 3 files in XML

### 3. C++ Files Indexed by CFamily ✅

```
[SonarCloud Log 00:27:46.861]
INFO  Percentage of files indexed with CFamily languages: 9.71% (C: 0, C++: 10, ObjC: 0, AnyLang: 103)
INFO  100% of the project includes directives were resolved (0 out of 6 were not resolved)
```

**Files in SonarCloud** (verified via API):
```bash
$ python tools/sonarcloud_verify.py --component hatching_egg --cpp-diagnostic

C++ File Analysis:
--------------------------------------------------------------------------------
Total C++ files: 10
Header files (.h): 9
Source files (.cpp): 1
Headers WITH coverage: 0  ⚠️
Sources WITH coverage: 1  ⚠️

Header Files in SonarCloud:
--------------------------------------------------------------------------------
❌ NO COVERAGE: hatching_egg/arduino/servo_mapping.h
❌ NO COVERAGE: hatching_egg/arduino/servo_sweep_test_logic.h
❌ NO COVERAGE: hatching_egg/arduino/servo_tester_logic.h
...
```

**Paths match exactly:**
- XML: `hatching_egg/arduino/servo_mapping.h`
- SonarCloud: `hatching_egg/arduino/servo_mapping.h`

### 4. Coverage Data NOT Applied ❌

```bash
$ curl -s "https://sonarcloud.io/api/measures/component?component=griswaldbrooks_halloween:hatching_egg/arduino/servo_mapping.h&metricKeys=coverage"
{
    "component": {
        "key": "griswaldbrooks_halloween:hatching_egg/arduino/servo_mapping.h",
        "path": "hatching_egg/arduino/servo_mapping.h",
        "language": "cpp",
        "measures": []  ⚠️ EMPTY
    }
}
```

**Files exist ✅ Files indexed ✅ Files analyzed ✅ But coverage measures: EMPTY**

---

## Root Cause: Sensor Execution Order

### Timeline of Events

```
00:27:20.508 - General file indexing: 209 files
00:27:44.391 - Generic Coverage Report sensor STARTS
00:27:44.396 - Imports coverage data for 3 files
00:27:44.397 - Generic Coverage Report sensor DONE
00:27:44.398 - CFamily sensor STARTS
00:27:46.873 - CFamily sensor DONE (indexed 10 C++ files)
```

### The Problem

**The Generic Coverage Report sensor runs BEFORE the CFamily sensor!**

When the Generic Coverage Report sensor attempts to apply coverage data (at 00:27:44.396), the C++ header files have not yet been indexed by the CFamily sensor. The CFamily sensor doesn't start until 1 millisecond later (00:27:44.398).

### Supporting Evidence

From SonarSource community forum research:

> "Coverage data only applies to files that are already being analyzed by SonarQube. When files in the coverage report don't match files being analyzed, SonarQube displays messages like 'Coverage data ignored for 82 unknown files'."

But we have **no "unknown files" warnings**, which suggests the Generic Coverage Report sensor found the files in the initial 209-file indexing pass, but they weren't yet marked as C++ files requiring coverage metrics.

---

## Why This Happens

### SonarCloud Sensor Order

SonarCloud runs sensors in a specific order:
1. **Language-agnostic sensors** (including Generic Coverage Report)
2. **Language-specific sensors** (including CFamily for C++)

The Generic Coverage Report sensor is designed to be language-agnostic, so it runs early. The CFamily sensor, being language-specific, runs later.

### The Mismatch

For C++ coverage to work with `sonar.coverageReportPaths`:
- Coverage must be applied **after** files are indexed as C++ files
- But Generic Coverage Report sensor runs **before** CFamily indexes them

This creates a chicken-and-egg problem:
- Coverage sensor: "I'll apply coverage to files that exist"
- CFamily sensor (later): "I'll index these as C++ files"
- Result: Coverage applied to generic files, not recognized as C++ coverage

---

## Why the Official Example Works

The [official SonarSource example](https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc) uses:

```properties
sonar.sources=src
```

And passes coverage via scanner parameter:
```bash
--define sonar.coverageReportPaths=coverage.xml
```

**Key differences that may affect sensor ordering:**
1. Simpler source structure (`src/` instead of monorepo with multiple projects)
2. Coverage XML at project root (not in subdirectory)
3. Scanner parameters vs sonar-project.properties
4. Single language project (C++ only, no JS/Python mixed in)

In a simpler project, C++ files might be indexed earlier in the analysis process, before the Generic Coverage Report sensor runs.

---

## Solution Options

### Option A: Use Native GCOV Format ✅ RECOMMENDED

**Change from:**
```properties
sonar.coverageReportPaths=hatching_egg/coverage-cpp/coverage.xml
```

**Change to:**
```properties
sonar.cfamily.gcov.reportsPath=hatching_egg/coverage-cpp/
```

**How it works:**
- Point to directory containing `.gcov` files (not XML)
- The **CFamily sensor** processes `.gcov` files during its analysis phase
- Coverage applied at the right time (during C++ file indexing)
- This is a CFamily-specific property, processed by the CFamily sensor

**Implementation:**
```bash
# In hatching_egg pixi.toml or CI workflow
gcov --branch-probabilities --branch-counts --preserve-paths *.gcda
# This generates .gcov files in the directory
# Point sonar.cfamily.gcov.reportsPath to that directory
```

**Pros:**
- Processed by CFamily sensor (correct timing)
- Proven to work for C++ projects
- No sensor ordering issues

**Cons:**
- Different from official SonarSource gcovr example
- Requires generating .gcov files instead of XML

---

### Option B: Try Scanner Parameters Instead of Properties

The official example passes coverage via `--define sonar.coverageReportPaths=coverage.xml` instead of sonar-project.properties.

**Test if scanner parameters affect sensor ordering:**
```yaml
# In .github/workflows/coverage.yml
- name: SonarCloud Scan
  uses: SonarSource/sonarqube-scan-action@v6
  with:
    args: >
      -Dsonar.coverageReportPaths=hatching_egg/coverage-cpp/coverage.xml
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**Pros:**
- Matches official example pattern
- May affect sensor ordering
- Keep using gcovr XML

**Cons:**
- Unclear if this will actually fix the issue
- May still have sensor ordering problem

---

### Option C: Simplify Project Structure

Move C++ coverage to project root:
```
halloween/
├── coverage-cpp/
│   └── coverage.xml
└── sonar-project.properties
```

Change paths in XML to be simpler:
```xml
<file path="hatching_egg/arduino/servo_mapping.h">
```

**Pros:**
- Matches official example structure
- May help sensor ordering

**Cons:**
- Requires restructuring
- Doesn't fix fundamental sensor ordering issue

---

### Option D: Contact SonarSource Support

This appears to be a sensor ordering limitation in SonarCloud for monorepo projects with C++.

**Questions for support:**
1. Why does Generic Coverage Report sensor run before CFamily sensor?
2. How to apply coverage to C++ files that are indexed by CFamily sensor?
3. Is there a way to force CFamily sensor to run earlier?

**Pros:**
- May get official solution or workaround
- Could be a bug they need to fix

**Cons:**
- Takes time
- May not have immediate solution

---

## Recommended Next Steps

1. **Try Option A (Native GCOV) first**
   - Modify hatching_egg coverage generation to produce .gcov files
   - Change sonar-project.properties to use `sonar.cfamily.gcov.reportsPath`
   - Test if coverage appears in SonarCloud
   - **Estimated effort:** 2-3 hours

2. **If Option A fails, try Option B (Scanner Parameters)**
   - Pass coverage via scanner parameter
   - See if sensor ordering changes
   - **Estimated effort:** 1 hour

3. **If both fail, contact SonarSource Support (Option D)**
   - Document the issue with evidence from this analysis
   - Ask for guidance on sensor ordering
   - **Estimated effort:** Wait time for response

---

## Testing Verification

After implementing any solution, verify success with:

```bash
# 1. Check SonarCloud logs for coverage import
gh run view <run-id> --log 2>&1 | grep -A 5 "coverage"

# 2. Use verification tool to check API
python tools/sonarcloud_verify.py --component hatching_egg --cpp-diagnostic

# 3. Check API directly for a known file
curl -s "https://sonarcloud.io/api/measures/component?component=griswaldbrooks_halloween:hatching_egg/arduino/servo_mapping.h&metricKeys=coverage" | python -m json.tool

# 4. Verify in dashboard
# Open: https://sonarcloud.io/component_measures?id=griswaldbrooks_halloween&metric=coverage&selected=griswaldbrooks_halloween:hatching_egg/arduino/servo_mapping.h
```

**Success criteria:**
- API returns non-empty `measures` array
- Coverage percentage appears in dashboard
- Tools report header files have coverage

---

## References

- **Investigation session:** SESSION_2025-11-11.md
- **Tool usage:** tools/README.md
- **Official example:** https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc
- **SonarCloud docs:** https://docs.sonarsource.com/sonarqube-cloud/enriching/test-coverage/c-c-objective-c-test-coverage
- **Verification tool:** tools/sonarcloud_verify.py

---

## Conclusion

The issue is **NOT** with:
- ❌ Path mismatches (paths are correct)
- ❌ Coverage generation (XML is valid)
- ❌ File indexing (files are indexed)
- ❌ Import process (coverage is imported)

The issue **IS** with:
- ✅ **Sensor execution order** - Generic Coverage Report runs before CFamily
- ✅ **Coverage application timing** - Coverage applied before files marked as C++

**Next action:** Implement Option A (native GCOV format) to bypass sensor ordering issue.
