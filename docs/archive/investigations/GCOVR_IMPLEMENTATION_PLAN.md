# Action Plan: Implement gcovr for SonarCloud C++ Coverage

**Date:** 2025-11-11
**Based On:** WORKING_EXAMPLES_RESEARCH.md findings
**Goal:** Fix C++ header coverage display in SonarCloud (currently 0%, should be 85.9%)
**Approach:** Switch from native gcov to gcovr (SonarSource recommended approach)

---

## Why This Will Work

**Evidence:**
1. ✅ Official SonarSource example uses gcovr: `linux-cmake-gcovr-gh-actions-sc`
2. ✅ SonarCloud documentation explicitly supports gcovr
3. ✅ Community threads confirm gcovr works better for header-only code
4. ✅ Our current issue is wrong gcov flags (`-p` instead of `--preserve-paths`)
5. ✅ gcovr handles this automatically - no manual path management needed

**Confidence:** 95% (based on official SonarSource examples)

---

## Implementation Steps

### Step 1: Add gcovr Dependency

**File:** `/home/griswald/personal/halloween/hatching_egg/pixi.toml`

**Change:**
```toml
[dependencies]
python = ">=3.11"
cxx-compiler = "*"
gtest = "*"
lcov = "*"  # Keep for local HTML reports
coverage = "*"
bear = "*"
gcovr = "*"  # NEW: Add gcovr for SonarCloud coverage
```

**Verification:**
```bash
cd /home/griswald/personal/halloween/hatching_egg
pixi install
pixi run which gcovr  # Should find gcovr in .pixi/envs/default/bin/
```

### Step 2: Update C++ Coverage Task

**File:** `/home/griswald/personal/halloween/hatching_egg/pixi.toml`

**Current test-cpp-coverage task (lines 41-42):**
```bash
g++ --coverage -fprofile-abs-path ... && ./test_servo_mapping_cov && \
g++ --coverage -fprofile-abs-path ... && ./test_servo_tester_cov && \
g++ --coverage -fprofile-abs-path ... && ./test_servo_sweep_cov && \
lcov --capture --directory . --output-file coverage-cpp.info && \
genhtml coverage-cpp.info --output-directory coverage-cpp && \
gcov -p test_servo_mapping_cov-test_servo_mapping.gcda ... && \
bash scripts/fix_gcov_paths.sh  # REMOVE THIS
```

**New test-cpp-coverage task:**
```bash
# Compile all tests with coverage
g++ -std=c++17 --coverage -fprofile-abs-path -I.pixi/envs/default/include \
    test_servo_mapping.cpp -o test_servo_mapping_cov \
    -L.pixi/envs/default/lib -lgtest -pthread && \
LD_LIBRARY_PATH=.pixi/envs/default/lib ./test_servo_mapping_cov && \

g++ -std=c++17 --coverage -fprofile-abs-path -I.pixi/envs/default/include \
    test_servo_tester.cpp -o test_servo_tester_cov \
    -L.pixi/envs/default/lib -lgtest -pthread && \
LD_LIBRARY_PATH=.pixi/envs/default/lib ./test_servo_tester_cov && \

g++ -std=c++17 --coverage -fprofile-abs-path -I. -I.pixi/envs/default/include \
    test_servo_sweep.cpp -o test_servo_sweep_cov \
    -L.pixi/envs/default/lib -lgtest -pthread && \
LD_LIBRARY_PATH=.pixi/envs/default/lib ./test_servo_sweep_cov && \

# Generate HTML report for local viewing (OPTIONAL - can also use gcovr for this)
echo "Generating local HTML coverage report..." && \
lcov --capture --directory . --output-file coverage-cpp.info && \
lcov --remove coverage-cpp.info "/usr/*" "*.pixi/*" --output-file coverage-cpp-filtered.info && \
genhtml coverage-cpp-filtered.info --output-directory coverage-cpp && \

# Generate SonarCloud XML report (NEW - THE FIX)
echo "Generating SonarCloud coverage report..." && \
gcovr --sonarqube coverage-cpp.xml && \

echo "✅ C++ coverage generated:" && \
echo "   Local HTML:     coverage-cpp/index.html" && \
echo "   SonarCloud XML: coverage-cpp.xml"
```

**Key Changes:**
1. ✅ Removed `gcov -p` invocation (wrong flags)
2. ✅ Removed `scripts/fix_gcov_paths.sh` (no longer needed)
3. ✅ Added `gcovr --sonarqube coverage-cpp.xml` (correct approach)
4. ✅ Kept lcov for local HTML viewing (developers benefit from this)

### Step 3: Update SonarCloud Configuration

**File:** `/home/griswald/personal/halloween/sonar-project.properties`

**Current (lines 38-43):**
```properties
# C++ (hatching_egg Arduino header files)
# Coverage: 85.9% local (1621/1888 lines, 171 GoogleTest tests)
# Analysis enabled using compilation database from bear
# SonarCloud requires native .gcov files (NOT LCOV format) for C++
# .gcov files are post-processed by scripts/fix_gcov_paths.sh to add hatching_egg/ prefix
sonar.cfamily.gcov.reportsPath=hatching_egg/
```

**New:**
```properties
# C++ (hatching_egg Arduino header files)
# Coverage: 85.9% local (1621/1888 lines, 171 GoogleTest tests)
# Analysis enabled using compilation database from bear
# Coverage format: SonarQube XML via gcovr (official SonarSource recommended approach)
# Reference: https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc
sonar.coverageReportPaths=hatching_egg/coverage-cpp.xml
```

**Key Changes:**
1. ✅ Changed from `sonar.cfamily.gcov.reportsPath` to `sonar.coverageReportPaths`
2. ✅ Point to `coverage-cpp.xml` instead of directory with .gcov files
3. ✅ Updated comments to reflect new approach and reference official examples

### Step 4: Remove Obsolete Post-Processing Script

**Files to DELETE:**
- `/home/griswald/personal/halloween/hatching_egg/scripts/fix_gcov_paths.sh`

**Rationale:**
This script was a HACK to fix paths in .gcov files. With gcovr, paths are handled correctly from the start.

**Safety Check Before Deletion:**
```bash
# Verify the script is only used in test-cpp-coverage task
cd /home/griswald/personal/halloween
grep -r "fix_gcov_paths.sh" --exclude-dir=.git
# Should only appear in:
# - hatching_egg/pixi.toml (removed in Step 2)
# - hatching_egg/scripts/fix_gcov_paths.sh (the file itself)
```

### Step 5: Update Documentation

**File:** `/home/griswald/personal/halloween/hatching_egg/pixi.toml`

Update task description (line 42):
```toml
test-cpp-coverage = { cmd = "...", description = "Run C++ tests with coverage (HTML via lcov, XML via gcovr for SonarCloud)" }
```

**File:** `/home/griswald/personal/halloween/CLAUDE.md`

Update C++ coverage section (around line 40):
```markdown
### C++ Coverage

**Current Status:**
- Local: 85.9% (1621/1888 lines, 171 GoogleTest tests)
- SonarCloud: Should match local after gcovr implementation

**Tools:**
- gcovr: Generates SonarQube XML format for SonarCloud
- lcov: Generates HTML reports for local viewing
- GoogleTest: C++ unit testing framework

**Configuration:**
- Coverage XML: hatching_egg/coverage-cpp.xml
- SonarCloud property: sonar.coverageReportPaths
- Reference: SonarSource official example (linux-cmake-gcovr-gh-actions-sc)
```

---

## Testing Plan

### Phase 1: Local Verification

**Goal:** Verify coverage reports generate correctly locally

**Steps:**
```bash
cd /home/griswald/personal/halloween/hatching_egg

# 1. Install dependencies (including gcovr)
pixi install

# 2. Run coverage task
pixi run coverage

# 3. Verify outputs exist
ls -lh coverage-cpp/index.html     # LCOV HTML report
ls -lh coverage-cpp.xml             # gcovr XML for SonarCloud

# 4. Check XML format
head -50 coverage-cpp.xml
# Should see: <coverage version="1">
#             <sources>...</sources>
#             <packages>...</packages>
```

**Expected Results:**
- ✅ Both coverage-cpp/index.html and coverage-cpp.xml exist
- ✅ HTML shows 85.9% coverage (same as before)
- ✅ XML contains coverage data in SonarQube format
- ✅ No errors about missing gcovr

**If Errors:**
- Check pixi installed gcovr: `pixi list | grep gcovr`
- Check gcovr version: `pixi run gcovr --version` (should be >= 5.0, < 5.1)
- Check .gcda files exist after running tests: `find . -name "*.gcda"`

### Phase 2: CI/CD Verification

**Goal:** Verify GitHub Actions generates coverage correctly

**Steps:**
1. Commit changes
2. Push to GitHub
3. Monitor GitHub Actions workflow: https://github.com/griswaldbrooks/halloween/actions
4. Check "Code Coverage" job logs
5. Download artifacts to verify coverage-cpp.xml exists

**Expected Results:**
- ✅ Coverage task completes successfully
- ✅ coverage-cpp.xml exists in hatching_egg/ directory
- ✅ File uploaded to SonarCloud
- ✅ No errors in logs about missing gcovr or invalid XML

### Phase 3: SonarCloud Verification

**Goal:** Verify SonarCloud displays C++ coverage

**Steps:**
```bash
cd /home/griswald/personal/halloween

# 1. Wait for SonarCloud analysis to complete (check GitHub Actions)

# 2. Use verification tool to check actual state
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component hatching_egg

# 3. Compare with local coverage
python tools/sonarcloud_verify.py \
    --project griswaldbrooks_halloween \
    --component hatching_egg \
    --compare-local hatching_egg/coverage-cpp.xml
```

**Expected Results:**
- ✅ SonarCloud shows coverage for .h files
- ✅ Coverage percentages match local (85.9%)
- ✅ Files like `servo_mapping.h` show line-by-line coverage
- ✅ No "0% coverage" or "No coverage data" messages

**Success Criteria:**
```
SonarCloud C++ Coverage for hatching_egg:
  servo_mapping.h:          85.9% (123/143 lines)
  servo_tester.h:           88.2% (456/517 lines)
  servo_sweep.h:            84.7% (892/1053 lines)
  ...
  TOTAL:                    85.9% (1621/1888 lines)
```

### Phase 4: Manual Dashboard Check

**Goal:** Verify user can see coverage in SonarCloud UI

**Steps:**
1. Open: https://sonarcloud.io/project/overview?id=griswaldbrooks_halloween
2. Navigate to "Coverage" tab
3. Filter to hatching_egg component
4. Check for .h files with coverage data

**Expected Results:**
- ✅ Dashboard shows 85.9% C++ coverage
- ✅ Header files appear in file list
- ✅ Can click into .h files and see green/red coverage lines
- ✅ Matches local HTML report

---

## Rollback Plan

If implementation fails:

### Quick Revert
```bash
git revert <commit-hash>
git push
```

### Manual Revert

1. **Restore pixi.toml:**
   - Remove gcovr from dependencies
   - Restore old test-cpp-coverage task with `gcov -p`
   - Restore call to `scripts/fix_gcov_paths.sh`

2. **Restore sonar-project.properties:**
   - Change back to `sonar.cfamily.gcov.reportsPath=hatching_egg/`

3. **Restore fix_gcov_paths.sh:**
   - Restore from git history

**When to Rollback:**
- gcovr fails to install
- coverage-cpp.xml has invalid format
- SonarCloud rejects the XML
- Coverage drops significantly (> 5% difference)

**Don't Rollback If:**
- Coverage shows correctly locally but not in SonarCloud (investigate further)
- Minor version differences (85.8% vs 85.9% is fine)
- SonarCloud takes time to update (wait 24 hours)

---

## Risk Assessment

### Low Risk
- ✅ gcovr is widely used and stable
- ✅ Official SonarSource examples use this approach
- ✅ We can verify locally before pushing
- ✅ Easy rollback if needed

### Medium Risk
- ⚠️ Coverage percentages might differ slightly due to different calculation methods
- ⚠️ gcovr version compatibility (need 5.0, but not 5.1)
- ⚠️ SonarCloud might take time to update after push

### Mitigation
- Pin gcovr version in pixi.toml if needed: `gcovr = "5.0.*"`
- Test locally first before pushing
- Use verification tool to confirm SonarCloud state
- Keep LCOV reports as backup reference

---

## Success Metrics

### Primary Goal: SonarCloud Coverage Display
- ✅ C++ header files show coverage in SonarCloud dashboard
- ✅ Coverage percentage matches local (85.9% ± 2%)
- ✅ All .h files in hatching_egg/arduino/ have coverage data

### Secondary Goals: Code Quality
- ✅ Remove hack script (fix_gcov_paths.sh)
- ✅ Use official SonarSource recommended approach
- ✅ Align with working examples from sonarsource-cfamily-examples
- ✅ Improve documentation with references to working examples

### Tertiary Goals: Developer Experience
- ✅ Simpler coverage generation (one command vs many)
- ✅ Faster coverage generation (gcovr is faster than lcov + gcov)
- ✅ Maintain local HTML reports for debugging

---

## Timeline

### Immediate (< 1 hour)
1. Add gcovr dependency to pixi.toml
2. Update test-cpp-coverage task
3. Test locally: `pixi run coverage`
4. Verify both outputs exist

### Short-term (1-2 hours)
5. Update sonar-project.properties
6. Remove fix_gcov_paths.sh
7. Update documentation
8. Commit and push changes

### Medium-term (2-4 hours)
9. Monitor GitHub Actions
10. Wait for SonarCloud analysis
11. Run verification tool
12. Check SonarCloud dashboard

### Follow-up (next day)
13. Verify coverage is stable
14. Update CLAUDE.md with lessons learned
15. Document for future agents

---

## Future Improvements

Once this works:

### 1. Consolidate HTML Reports
Currently we generate both lcov HTML and gcovr XML. Could use gcovr for both:
```bash
gcovr --html-details coverage-cpp/index.html  # Local HTML
gcovr --sonarqube coverage-cpp.xml            # SonarCloud XML
```

### 2. Add Coverage Thresholds
```bash
gcovr --fail-under-line 80 --fail-under-branch 75
```

### 3. Generate JSON for Tools
```bash
gcovr --json coverage-cpp.json  # Machine-readable format
```

### 4. Consider build-wrapper
For maximum SonarCloud compatibility, could switch from bear to build-wrapper:
```bash
build-wrapper-linux-x86-64 --out-dir bw_output g++ ...
```

But this is NOT required - gcovr fix should work with bear.

---

## References

### Official SonarSource Examples
- **Primary Reference:** https://github.com/sonarsource-cfamily-examples/linux-cmake-gcovr-gh-actions-sc
- **All Examples:** https://github.com/sonarsource-cfamily-examples

### Documentation
- **SonarCloud C++ Coverage:** https://docs.sonarcloud.io/enriching/test-coverage/c-c-objective-c-test-coverage/
- **gcovr Documentation:** https://gcovr.com/
- **gcovr SonarQube XML:** https://gcovr.com/en/stable/output/sonarqube.html

### Research
- **Working Examples Research:** WORKING_EXAMPLES_RESEARCH.md (this repo)
- **Investigation History:** SESSION_2025-11-11.md (this repo)

---

## Questions for User (If Implementation Unclear)

1. **gcovr version:** Should we pin to specific version or use latest?
   - Recommendation: Use 5.0.x (avoid 5.1 per community warnings)

2. **Keep LCOV reports?** Should we keep generating local HTML via lcov or switch to gcovr for both?
   - Recommendation: Keep both - lcov is familiar, gcovr is for SonarCloud

3. **Timing:** Implement immediately or wait for more research?
   - Recommendation: Implement now - high confidence (95%) based on official examples

---

**Action Plan Created:** 2025-11-11
**Ready for Implementation:** YES
**Confidence Level:** Very High (95%)
**Recommended Next Step:** Proceed with Step 1 (Add gcovr dependency)
