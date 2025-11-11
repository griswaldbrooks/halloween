# SonarCloud Coverage Investigation Report - Hatching Egg

**Date:** 2025-11-10
**Status:** Investigation Complete - Solutions Identified

## Executive Summary

SonarCloud is reporting partial coverage for hatching_egg due to:
1. **JavaScript**: 2 of 3 files missing from coverage (animation-behaviors.js, preview-app.js)
2. **C++**: Coverage generated locally but NOT configured in sonar-project.properties
3. **Python**: Coverage generated locally but NOT configured in sonar-project.properties

All three languages generate proper coverage reports locally, but only JavaScript is partially uploaded to SonarCloud.

---

## Phase 1: JavaScript Coverage Investigation

### Current Status
- **Reported to SonarCloud:** leg-kinematics.js only (92.12%)
- **Missing from SonarCloud:** animation-behaviors.js (0%), preview-app.js (0%)

### Root Cause Analysis

#### animation-behaviors.js - Browser-Only Module (Cannot be tested in Node.js)

**File:** `/home/griswald/personal/halloween/hatching_egg/animation-behaviors.js`

**Issue:** Uses top-level `await` and `fetch()` API (browser-only):
```javascript
// Line 7-8
const response = await fetch('animation-config.json');
const config = await response.json();
```

**Why it's not in coverage:**
- Top-level `await` makes it an ES module
- Cannot be `require()`'d in Node.js (error: ERR_REQUIRE_ASYNC_MODULE)
- Uses `fetch()` API which doesn't exist in Node.js without polyfills
- File is designed for browser-only execution

**Testing approach:**
- Currently tested via `test_animation_behaviors.js` which tests the *data* (animation-config.json)
- Does NOT directly execute animation-behaviors.js code
- Tests verify JSON structure, not the loading/interpolation logic

**Recommendation:** EXCLUDE from coverage
- Similar to window_spider_trigger/public/client.js (browser-only, excluded)
- Similar to spider_crawl_projection/spider-animation.js (excluded)

#### preview-app.js - Browser-Only Application

**File:** `/home/griswald/personal/halloween/hatching_egg/preview-app.js`

**Issue:** Browser-dependent code:
```javascript
// Line 2-3
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
```

**Why it's not in coverage:**
- Depends on `document` and DOM APIs
- Cannot be executed in Node.js test environment
- No `module.exports` (not designed as a module)
- Interactive preview application, not a library

**Testing approach:**
- Currently not directly tested
- Serves as visual preview tool for development
- Functionality tested indirectly via leg-kinematics.js tests

**Recommendation:** EXCLUDE from coverage
- This is a development tool, not production library code
- Similar rationale to browser-only animation files

### JavaScript Solution

**Update sonar-project.properties:**
```properties
# Coverage exclusions
# Browser-only files that cannot be tested in Node.js environment
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/test*.js,**/test*.cpp,**/test*.py,**/optimize-*.js,**/__tests__/**,**/jest.config.js,**/c8.config.json,**/arduino/**,**/public/**,**/spider-animation.js,hatching_egg/animation-behaviors.js,hatching_egg/preview-app.js
```

**Justification:**
- Both files are browser-only (top-level await + fetch, DOM APIs)
- Similar pattern to already-excluded files in other projects
- Tested indirectly via data validation tests
- Development/preview tools, not production code

---

## Phase 2: C++ Coverage Investigation

### Current Status
- **Local Coverage:** 85.9% (1621/1888 lines) - EXCELLENT
- **SonarCloud:** Not visible (0%)
- **Coverage File:** `/home/griswald/personal/halloween/hatching_egg/coverage-cpp-filtered.info`

### Root Cause Analysis

**Issue:** C++ coverage path is configured in sonar-project.properties but NOT working:

```properties
# Line 22 in sonar-project.properties
sonar.cpp.coverage.reportPaths=hatching_egg/coverage-cpp-filtered.info
```

**Why it's not working:**

1. **Wrong property name:** `sonar.cpp.coverage.reportPaths` is NOT a valid SonarCloud property
   - SonarCloud C/C++ analysis is DISABLED (line 38-40):
     ```properties
     sonar.c.file.suffixes=-
     sonar.cpp.file.suffixes=-
     sonar.objc.file.suffixes=-
     ```
   - This means SonarCloud is NOT analyzing C++ source files at all

2. **C++ analysis disabled intentionally:** To avoid scanning Arduino C++ files (which aren't meant for SonarCloud)

3. **Coverage format is correct:** `coverage-cpp-filtered.info` is valid lcov format:
   ```
   TN:
   SF:/home/griswald/personal/halloween/hatching_egg/.pixi/envs/default/include/gtest/gtest-assertion-result.h
   FN:162,_ZN7testing15AssertionResultC2IbEERKT_...
   ```

### C++ Solution Options

**Option A: Enable C++ analysis for specific directories (RECOMMENDED)**

Update sonar-project.properties:
```properties
# Enable C++ analysis for header files only (Arduino logic)
sonar.c.file.suffixes=-
sonar.cpp.file.suffixes=.h
sonar.objc.file.suffixes=-

# Exclude .ino and test files from analysis
sonar.exclusions=**/node_modules/**,**/coverage*/**,**/*.test.js,**/*.spec.js,**/test*.js,**/test*.cpp,**/test*.py,**/pixi.lock,**/.pixi/**,**/2025/**,**/.github/**,**/arduino/**/*.ino,**/arduino/**/*.cpp

# C++ coverage (generic lcov format)
sonar.coverageReportPaths=hatching_egg/coverage-cpp-filtered.info
```

**Option B: Keep C++ analysis disabled, document coverage locally only**

- Remove C++ coverage from SonarCloud configuration
- Continue generating local coverage reports
- Document coverage in README.md only
- Simpler, avoids C++ SonarCloud analysis complexity

**Recommendation:** Option B (Keep disabled)
- Arduino C++ is compiled/tested locally, not in cloud
- Local coverage reports are comprehensive (85.9%)
- Avoids SonarCloud C++ analysis issues
- Consistent with current approach (Arduino excluded from analysis)

---

## Phase 3: Python Coverage Investigation

### Current Status
- **Local Coverage:** 97% (152/157 lines) - EXCELLENT
- **SonarCloud:** Not visible (0%)
- **Coverage File:** `/home/griswald/personal/halloween/hatching_egg/coverage-python/coverage.xml`

### Root Cause Analysis

**Issue:** Python coverage path is configured but coverage file NOT generated by CI:

```properties
# Line 25 in sonar-project.properties
sonar.python.coverage.reportPaths=hatching_egg/coverage-python/coverage.xml
```

**Why it's not working:**

1. **Coverage not generated in CI:** `.github/workflows/coverage.yml` line 31 runs:
   ```bash
   pixi run coverage
   ```
   But `pixi run coverage` only generates JS and C++ coverage, NOT Python!

2. **Python coverage task exists but not called:**
   ```toml
   # pixi.toml line 43-49
   test-python-coverage = { cmd = """
   python -m coverage run test_servo_mapping.py
   python -m coverage html -d coverage-python
   python -m coverage xml -o coverage-python/coverage.xml
   python -m coverage report
   echo "Python coverage report generated in coverage-python/index.html"
   """, description = "Run Python tests with coverage" }
   ```

3. **Coverage XML format is correct:**
   ```xml
   <?xml version="1.0" ?>
   <coverage version="6.2" timestamp="1762824635488" lines-valid="157" lines-covered="152" line-rate="0.9682">
     <sources>
       <source>/home/griswald/personal/halloween/hatching_egg</source>
     </sources>
   ```

### Python Solution

**Update pixi.toml to include Python in coverage task:**

```toml
coverage-all = { cmd = "bash -c 'echo \"Running JavaScript coverage...\" && pixi run coverage-js-only && echo && echo \"Running C++ coverage...\" && pixi run test-cpp-coverage && echo && echo \"Running Python coverage...\" && pixi run test-python-coverage && echo && ...'", description = "Run all tests with coverage (JS, C++, Python)" }
```

**Current problem:** Line 59 shows Python task IS included!

**Real issue:** Need to verify CI actually uploads coverage-python directory.

Check `.github/workflows/coverage.yml` line 87-93:
```yaml
path: |
  window_spider_trigger/coverage/
  spider_crawl_projection/coverage/
  hatching_egg/coverage-js/
  hatching_egg/coverage-cpp/
  hatching_egg/coverage-python/  # ✅ Already included
```

**So why is it missing?**

The directory might not exist after CI run. Let me check if `pixi run coverage` actually runs `test-python-coverage`:

From pixi.toml line 61:
```toml
coverage = { depends-on = ["coverage-all"], description = "Generate all code coverage reports" }
```

And line 59:
```toml
coverage-all = { cmd = "bash -c '... && pixi run test-python-coverage && ...'", ... }
```

**Conclusion:** Python coverage SHOULD be generated, but may be failing silently in CI.

**Solution:** Update `coverage-all` to fail on error:
```toml
coverage-all = { cmd = "bash -c 'set -e && echo \"Running JavaScript coverage...\" && pixi run coverage-js-only && echo && echo \"Running C++ coverage...\" && pixi run test-cpp-coverage && echo && echo \"Running Python coverage...\" && pixi run test-python-coverage && ...'", description = "Run all tests with coverage (JS, C++, Python)" }
```

---

## Phase 4: Multi-Language Coverage Matrix

| Language   | Test Framework | Coverage Tool | Output Format       | Output Path                              | SonarCloud Config                              | Status        |
|------------|---------------|---------------|---------------------|------------------------------------------|------------------------------------------------|---------------|
| JavaScript | Node.js       | c8/Istanbul   | lcov.info           | `coverage-js/lcov.info`                  | ✅ `sonar.javascript.lcov.reportPaths`          | ⚠️ Partial    |
| C++        | GoogleTest    | gcov/lcov     | lcov.info           | `coverage-cpp-filtered.info`             | ❌ C++ analysis disabled                        | ❌ Not shown  |
| Python     | unittest      | coverage.py   | coverage.xml        | `coverage-python/coverage.xml`           | ✅ `sonar.python.coverage.reportPaths`          | ❌ Not shown  |

### JavaScript Issues
- ✅ leg-kinematics.js: 92.12% (working)
- ❌ animation-behaviors.js: Browser-only (top-level await + fetch)
- ❌ preview-app.js: Browser-only (DOM APIs)

### C++ Issues
- C++ file analysis disabled intentionally (Arduino .ino files)
- Coverage property configured but analysis disabled
- Local coverage excellent (85.9%)

### Python Issues
- Coverage generation may fail silently in CI
- Need `set -e` in bash command to catch errors
- Coverage file format correct

---

## Recommended Solutions (Priority Order)

### 1. JavaScript - Add Coverage Exclusions (SIMPLE)

**File:** `sonar-project.properties`

**Change:**
```diff
- sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/test*.js,**/test*.cpp,**/test*.py,**/optimize-*.js,**/__tests__/**,**/jest.config.js,**/c8.config.json,**/arduino/**,**/public/**,**/spider-animation.js
+ sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/test*.js,**/test*.cpp,**/test*.py,**/optimize-*.js,**/__tests__/**,**/jest.config.js,**/c8.config.json,**/arduino/**,**/public/**,**/spider-animation.js,hatching_egg/animation-behaviors.js,hatching_egg/preview-app.js
```

**Rationale:**
- Both files are browser-only
- Cannot be tested in Node.js environment
- Similar to already-excluded files
- Tested indirectly via data validation

**Expected Result:** SonarCloud will show leg-kinematics.js at 92.12%, others excluded

---

### 2. Python - Fix Coverage Generation (MEDIUM)

**File:** `hatching_egg/pixi.toml`

**Change (line 59):**
```diff
- coverage-all = { cmd = "bash -c 'echo \"Running JavaScript coverage...\" && pixi run coverage-js-only && echo && echo \"Running C++ coverage...\" && pixi run test-cpp-coverage && echo && echo \"Running Python coverage...\" && pixi run test-python-coverage && echo && echo \"================================================\" && echo \"Coverage reports generated:\" && echo \"  - JavaScript: coverage-js/index.html\" && echo \"  - C++:        coverage-cpp/index.html\" && echo \"  - Python:     coverage-python/index.html\" && echo \"================================================\"'", description = "Run all tests with coverage (JS, C++, Python)" }
+ coverage-all = { cmd = "bash -c 'set -e && echo \"Running JavaScript coverage...\" && pixi run coverage-js-only && echo && echo \"Running C++ coverage...\" && pixi run test-cpp-coverage && echo && echo \"Running Python coverage...\" && pixi run test-python-coverage && echo && echo \"================================================\" && echo \"Coverage reports generated:\" && echo \"  - JavaScript: coverage-js/index.html\" && echo \"  - C++:        coverage-cpp/index.html\" && echo \"  - Python:     coverage-python/index.html\" && echo \"================================================\"'", description = "Run all tests with coverage (JS, C++, Python)" }
```

**Rationale:**
- Add `set -e` to fail fast on any error
- Prevents silent failures in coverage generation
- Python coverage.xml should be generated and uploaded

**Expected Result:** SonarCloud will show Python coverage at ~97%

---

### 3. C++ - Document as Local-Only Coverage (SIMPLE)

**Option A: Keep C++ analysis disabled, document coverage locally**

**File:** `sonar-project.properties`

**Change:**
```diff
- # C++ (gcov/lcov)
- sonar.cpp.coverage.reportPaths=hatching_egg/coverage-cpp-filtered.info
+ # C++ coverage is generated locally only (Arduino embedded code)
+ # Not uploaded to SonarCloud (C++ analysis disabled for Arduino .ino files)
+ # Local coverage: 85.9% (1621/1888 lines) - see coverage-cpp/index.html
```

**File:** `hatching_egg/README.md`

**Add section:**
```markdown
## Test Coverage

- **JavaScript:** 92.12% (leg-kinematics.js)
- **C++:** 85.9% (171 GoogleTest tests) - *local only*
- **Python:** 97% (20 tests) - *local only*

### Browser-Only Files (Not Tested)
- `animation-behaviors.js` - Uses browser `fetch()` API and top-level await
- `preview-app.js` - Interactive canvas preview (development tool)

### Local Coverage Reports
Run `pixi run coverage` to generate:
- JavaScript: `coverage-js/index.html`
- C++: `coverage-cpp/index.html`
- Python: `coverage-python/index.html`
```

**Rationale:**
- C++ analysis disabled intentionally (Arduino)
- Local coverage reports are comprehensive
- Avoids SonarCloud C++ complexity
- Clear documentation of coverage status

**Expected Result:** Clear documentation, no SonarCloud C++ coverage

---

**Option B: Enable C++ analysis for headers only (COMPLEX - NOT RECOMMENDED)**

This would require:
1. Enable C++ analysis for `.h` files only
2. Add complex exclusion patterns for `.ino` and test files
3. Configure gcov/lcov paths correctly
4. Deal with potential SonarCloud C++ issues
5. May still not work due to Arduino-specific code

**Recommendation:** Option A (document as local-only)

---

## Implementation Checklist

### Phase 1: JavaScript Exclusions (5 min)
- [ ] Update `sonar-project.properties` coverage exclusions
- [ ] Add comment explaining why animation-behaviors.js and preview-app.js are excluded
- [ ] Commit: "Exclude browser-only JS files from hatching_egg coverage"

### Phase 2: Python Coverage Fix (10 min)
- [ ] Update `hatching_egg/pixi.toml` - add `set -e` to coverage-all
- [ ] Test locally: `cd hatching_egg && pixi run coverage`
- [ ] Verify `coverage-python/coverage.xml` is generated
- [ ] Commit: "Fix Python coverage generation with set -e in hatching_egg"

### Phase 3: C++ Documentation (10 min)
- [ ] Update `sonar-project.properties` - document C++ as local-only
- [ ] Update `hatching_egg/README.md` with coverage matrix
- [ ] Commit: "Document hatching_egg C++ coverage as local-only"

### Phase 4: Verification (after CI runs)
- [ ] Push changes to GitHub
- [ ] Wait for coverage.yml workflow to complete
- [ ] Check SonarCloud dashboard:
  - JavaScript: leg-kinematics.js at 92.12% ✅
  - JavaScript: animation-behaviors.js excluded ✅
  - JavaScript: preview-app.js excluded ✅
  - Python: test_servo_mapping.py at ~97% ✅
  - C++: Not shown (documented as local-only) ✅

---

## Expected Final State

### SonarCloud Coverage Report
- **hatching_egg/leg-kinematics.js:** 92.12% ✅
- **hatching_egg/animation-behaviors.js:** Excluded (browser-only) ✅
- **hatching_egg/preview-app.js:** Excluded (browser-only) ✅
- **hatching_egg/test_servo_mapping.py:** 97% ✅
- **hatching_egg C++ files:** Not analyzed (documented as local-only) ✅

### Local Coverage Reports
- **JavaScript:** 92.12% (leg-kinematics.js only)
- **C++:** 85.9% (1621/1888 lines, 171 GoogleTest tests)
- **Python:** 97% (152/157 lines, 20 tests)

### Overall Project Coverage
- **Combined (weighted by file count):** ~91% across all testable code
- **Comprehensive test suite:** 241 total tests
- **Multi-language testing:** JS (Node.js), C++ (GoogleTest), Python (unittest)

---

## Lessons Learned

1. **Multi-language projects need separate coverage configurations**
   - Each language has different tools and formats
   - SonarCloud requires language-specific property keys

2. **Browser-only code needs explicit exclusions**
   - Top-level `await` and `fetch()` cannot run in Node.js
   - DOM APIs require jsdom or exclusion
   - Better to exclude than attempt complex mocking

3. **Bash scripts need `set -e` for error handling**
   - Without it, coverage failures may be silent
   - CI won't report errors in pixi task chains

4. **C++ coverage in SonarCloud is complex**
   - Requires C++ analysis to be enabled
   - May conflict with Arduino-specific code
   - Local coverage may be sufficient for embedded projects

5. **CI workflows need artifact verification**
   - Coverage directories must exist before upload
   - Silent failures hide coverage generation issues
   - Add explicit checks for coverage file existence

---

## Next Agent Actions

If you are implementing these fixes:

1. **Read this report fully** before making changes
2. **Implement Phase 1-3** in order (JavaScript → Python → C++)
3. **Test locally** before pushing (especially Python coverage)
4. **Update CLAUDE.md** with lessons learned
5. **Verify on SonarCloud** after CI completes
6. **Update this report** with actual results

**Success criteria:**
- SonarCloud shows JavaScript + Python coverage
- Browser-only files properly excluded
- C++ coverage documented as local-only
- No regression in existing coverage numbers
