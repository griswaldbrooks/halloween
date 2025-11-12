# cmake_prototype Coverage Solution

**Status:** ✅ SOLVED - 100% coverage showing in SonarCloud
**Date:** 2025-11-12
**Commits:** 15ff974 (wrong approach), 4786789 (correct solution)

## Problem Summary

cmake_prototype had 100% local coverage (21 GoogleTest tests) but 0% in SonarCloud despite:
- ✅ Coverage XML generated correctly with gcovr --sonarqube
- ✅ compile_commands.json present and correct
- ✅ C++ files being analyzed by CFamily sensor
- ✅ SonarCloud processing coverage reports without errors

## Root Cause

**The problem was path mismatching due to projectBaseDir.**

When the CI workflow runs:
```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  with:
    projectBaseDir: cmake_prototype  # ← This changes the scanner's working directory
```

The `projectBaseDir` parameter **changes the scanner's working directory** to `cmake_prototype`. This means:
- Scanner looks for files relative to `cmake_prototype/`
- Coverage report paths must also be relative to `cmake_prototype/`

### The Wrong Approach (Commit 15ff974)

First attempt added sed post-processing to make paths repo-relative:
```toml
coverage-xml = { cmd = "cd build && gcovr --sonarqube ../coverage.xml --root .. --filter '../lib/.*' ... && sed -i 's|<file path=\"lib/|<file path=\"cmake_prototype/lib/|g' ../coverage.xml" }
```

Result: `coverage.xml` had `<file path="cmake_prototype/lib/servo_logic.cpp" ...>`

This FAILED because:
- Scanner working directory: `cmake_prototype/`
- Scanner sees file as: `lib/servo_logic.cpp`
- Coverage has path: `cmake_prototype/lib/servo_logic.cpp`
- **Paths don't match** → 0% coverage

### The Correct Solution (Commit 4786789)

Keep paths relative to projectBaseDir:
```toml
coverage-xml = { cmd = "cd build && gcovr --sonarqube ../coverage.xml --root .. --filter '../lib/.*' ..." }
```

Result: `coverage.xml` has `<file path="lib/servo_logic.cpp" ...>`

This WORKS because:
- Scanner working directory: `cmake_prototype/`
- Scanner sees file as: `lib/servo_logic.cpp`
- Coverage has path: `lib/servo_logic.cpp`
- **Paths match perfectly** → 100% coverage!

## Key Insights

### 1. projectBaseDir Changes Path Resolution

From SonarSource documentation and examples:
- `projectBaseDir` sets the scanner's **working directory**
- All relative paths (sources, tests, coverage) are **relative to this directory**
- This is different from repo-relative paths

### 2. Reference Implementation

Studied SonarSource's example: [linux-cmake-gcovr-gh-actions-sc](https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc)

Key differences:
- They **don't use** `projectBaseDir` → paths are repo-relative
- We **do use** `projectBaseDir` → paths must be projectBaseDir-relative
- Both approaches work, but paths must match the scanner's working directory

### 3. Generic Coverage Report Sensor Timing

From CI logs:
```
20:55:37.634 INFO  Sensor Generic Coverage Report
20:55:37.669 INFO  Imported coverage data for 0 files
20:55:37.670 INFO  Sensor Generic Coverage Report (done) | time=36ms
20:55:38.272 INFO  Sensor CFamily [cpp]
```

The Generic Coverage Report sensor runs **before** CFamily sensor, but with correct paths, it successfully imports coverage for C++ files.

## Solution Implementation

### pixi.toml Configuration

```toml
# Generate coverage in SonarQube XML format (for SonarCloud)
# CRITICAL: When using projectBaseDir in CI, paths must be relative to projectBaseDir
# CI runs scanner with: projectBaseDir: cmake_prototype
# Therefore coverage.xml paths must be: lib/servo_logic.cpp (NOT cmake_prototype/lib/servo_logic.cpp)
# The --root .. makes paths relative to cmake_prototype directory
coverage-xml = { cmd = "cd build && gcovr --sonarqube ../coverage.xml --root .. --filter '../lib/.*' --exclude-throw-branches --exclude-unreachable-branches", depends-on = ["test"] }
```

### sonar-project.properties

```properties
# Coverage report path (relative to projectBaseDir)
sonar.coverageReportPaths=coverage.xml
```

### CI Workflow (.github/workflows/cmake-prototype.yml)

```yaml
- name: Generate coverage (XML)
  run: pixi run coverage

- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  with:
    projectBaseDir: cmake_prototype  # Sets scanner working directory
```

## Verification

### Local Testing
```bash
cd cmake_prototype
pixi run coverage-xml
python3 -c "import xml.etree.ElementTree as ET; tree = ET.parse('coverage.xml'); [print(f.attrib['path']) for f in tree.findall('.//file')]"
# Output: lib/servo_logic.cpp  ✅
```

### SonarCloud Verification
```bash
python3 tools/sonarcloud_verify.py --project griswaldbrooks_halloween --component cmake_prototype
```

Output:
```
Overall Coverage: 100.0%
Lines to Cover: 17
Uncovered Lines: 0
```

## Lessons Learned

1. **projectBaseDir matters for path resolution**
   - Always make paths relative to projectBaseDir when using it
   - Don't mix repo-relative and projectBaseDir-relative paths

2. **Test with verification tools**
   - Don't rely on web UI alone
   - Use tools/sonarcloud_verify.py to see actual SonarCloud state
   - Download CI artifacts to verify coverage.xml paths

3. **Study official examples**
   - SonarSource provides excellent reference implementations
   - Understanding differences (projectBaseDir usage) is critical

4. **Document path assumptions**
   - Comment why paths are relative to a specific directory
   - Make it obvious for future maintainers

## Applying This to hatching_egg

The hatching_egg project has the same issue but more complex:
- Uses bear to generate compile_commands.json
- Has native .gcov files instead of SonarQube XML
- Currently 85.9% local, 0% SonarCloud

**Recommended approach:**
1. **Option A (Easier):** Migrate to CMake using cmake_prototype as template
   - Single source of truth, zero code duplication
   - CMAKE_EXPORT_COMPILE_COMMANDS generates compile_commands.json
   - gcovr generates coverage in correct format
   - Proven to work with SonarCloud

2. **Option B (Harder):** Fix current setup
   - Generate SonarQube XML with gcovr instead of raw .gcov
   - Ensure paths are relative to projectBaseDir
   - May still have issues with bear-generated compile_commands.json

**Recommendation:** Option A (CMake migration) - see cmake_prototype/MIGRATION.md

## References

- SonarCloud C++ Coverage Docs: https://docs.sonarcloud.io/enriching/test-coverage/c-c-objective-c-test-coverage/
- Example Repository: https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc
- Verification Tool: tools/sonarcloud_verify.py
- Related Docs: cmake_prototype/COMPARISON.md, cmake_prototype/MIGRATION.md

---

**Last Updated:** 2025-11-12
**Next Steps:** Consider migrating hatching_egg to CMake for consistent coverage reporting
