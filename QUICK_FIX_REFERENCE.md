# Quick Fix Reference - C++ Coverage in SonarCloud

**Problem:** Header files show 0% in SonarCloud (should be 85.9%)
**Solution:** Use gcovr instead of raw gcov (Official SonarSource pattern)
**Confidence:** 95% (Based on official examples)

---

## The Fix (3 Changes)

### 1. Add Dependency
**File:** `hatching_egg/pixi.toml`
```toml
[dependencies]
gcovr = "*"  # Add this line
```

### 2. Update Coverage Task
**File:** `hatching_egg/pixi.toml` (test-cpp-coverage task)

**Remove these lines:**
```bash
gcov -p test_servo_mapping_cov-test_servo_mapping.gcda ...
bash scripts/fix_gcov_paths.sh
```

**Add this line:**
```bash
gcovr --sonarqube coverage-cpp.xml
```

### 3. Update SonarCloud Config
**File:** `sonar-project.properties`

**Change:**
```diff
-sonar.cfamily.gcov.reportsPath=hatching_egg/
+sonar.coverageReportPaths=hatching_egg/coverage-cpp.xml
```

### 4. Delete Hack Script
```bash
rm hatching_egg/scripts/fix_gcov_paths.sh
```

---

## Test Locally First

```bash
cd hatching_egg
pixi install          # Install gcovr
pixi run coverage     # Run tests + generate coverage
ls coverage-cpp.xml   # Verify XML exists
```

**Expected:** File exists, no errors

---

## Then Push

```bash
git add .
git commit -m "Fix C++ coverage for SonarCloud: Use gcovr instead of gcov

- Switch from native .gcov files to gcovr XML format
- Remove path-fixing hack (no longer needed)
- Follow official SonarSource example pattern
- Reference: sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc"

git push
```

---

## Verify Results

```bash
# After GitHub Actions completes
python tools/sonarcloud_verify.py --project griswaldbrooks_halloween --component hatching_egg
```

**Expected:** Header files show 85.9% coverage

---

## Why This Works

**Official SonarSource Example:**
https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc

Uses `gcovr --sonarqube` for C++ coverage with GoogleTest.

**Our Problem:**
- Using `gcov -p` instead of `gcov --preserve-paths` (wrong flag)
- Post-processing .gcov files with hack script (wrong approach)

**The Solution:**
- gcovr handles paths automatically
- Generates SonarQube XML directly
- No post-processing needed

---

## Full Details

- **Research Report:** WORKING_EXAMPLES_RESEARCH.md
- **Implementation Plan:** GCOVR_IMPLEMENTATION_PLAN.md
- **Executive Summary:** RESEARCH_SUMMARY.md
