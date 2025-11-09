# Next Agent Tasks - Code Coverage & Quality

**Last Updated:** 2025-11-08 (post SonarCloud cleanup)

---

## 🎯 Current Status

### ✅ Completed Work

**SonarCloud Integration (2025-11-08)**
- ✅ Token configured and working
- ✅ GitHub Action updated to v6
- ✅ Automatic Analysis disabled
- ✅ CI/CD pipeline passing
- ✅ Dashboard: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween

**SonarCloud Issues (2025-11-08) - COMPLETE! 🎉**
- ✅ Fixed 116 of 117 issues (99% reduction)
- ✅ ALL bugs and security issues resolved
- ✅ Eliminated 330+ minutes of technical debt
- ✅ Code modernized with ES2015+ patterns
- ✅ 1 remaining issue: async IIFE (style preference only, requires ES module conversion)

**Commits:**
- Phase 5: `54f4199` - Fixed 24 issues
- Phase 6: `13c89b3` - Fixed 6 issues
- Phase 7: `d285246` - Fixed 4 issues
- Phase 8: `fa4385b` - Fixed 2 issues

**Code Coverage**
- ✅ Multi-language coverage implemented (JS, C++, Python)
- ✅ GitHub Actions workflows passing
- ✅ Codecov reporting configured

---

## 🚀 Next Tasks (Priority Order)

### Priority 1: window_spider_trigger Tests (0% → 80%)

**Status:** NOT STARTED
**Effort:** 2-3 hours
**Impact:** HIGH - Critical gap in coverage

**What to do:**
1. Create test files in `window_spider_trigger/`:
   - `server.test.js` - Test Express server, Socket.IO
   - `serial.test.js` - Test Arduino serial communication (mocked)
   - `integration.test.js` - Test end-to-end trigger flow

2. Install test dependencies:
   ```bash
   cd window_spider_trigger
   npm install --save-dev supertest socket.io-client
   # jest is already configured
   ```

3. Write tests covering:
   - HTTP endpoints (GET /, static files)
   - Socket.IO connection and events
   - Serial port communication (mocked with jest)
   - Trigger signal handling
   - Error scenarios

4. Run tests and check coverage:
   ```bash
   pixi run test
   pixi run coverage
   # Target: 80%+
   ```

**See:** `COVERAGE_ISSUES.md` section "Priority 1: window_spider_trigger" for detailed requirements

---

### Priority 2: Measure hatching_egg C++ Coverage

**Status:** NOT STARTED
**Effort:** 30 minutes
**Impact:** MEDIUM - Verification needed

**What to do:**
1. Coverage already runs but percentage not extracted
2. Extract percentage from report:
   ```bash
   cd hatching_egg
   pixi run coverage
   grep -A 2 "headerCovTableEntry" coverage-cpp/index.html | grep -oP '\d+\.\d+%' | head -1
   ```

3. Add to documentation if ≥80%
4. If <80%, identify gaps and add tests

---

### Priority 3: twitching_body Refactoring (0% → 80%)

**Status:** NOT STARTED
**Effort:** 4-6 hours
**Impact:** MEDIUM - Complex refactoring

**What to do:**
1. Extract state machine logic from `twitching_servos.ino`
2. Create separate header files for testable logic
3. Mock Adafruit_PWMServoDriver library
4. Write unit tests similar to hatching_egg pattern
5. Target: 80% coverage on testable logic

**Note:** This is a large refactoring task. Recommend doing after window_spider_trigger tests.

**See:** `COVERAGE_ISSUES.md` section "Priority 4: twitching_body"

---

### Priority 4 (Optional): Async IIFE Style Fix

**Status:** NOT STARTED
**Effort:** 30 minutes
**Impact:** LOW - Style preference only
**SonarCloud Issue:** javascript:S7785

**File:** `hatching_egg/animation-behaviors.js:7`

**What to do:**
1. Convert file to ES module
2. Add `type="module"` to script tag in HTML
3. Replace async IIFE with top-level await
4. Test in browser to ensure no regressions

**Note:** This is purely a style preference. Skip if ES module conversion is not desired.

---

## 📊 Current Coverage Status

### JavaScript
- ✅ **spider_crawl_projection:** 97.55% (10 tests passing)
- ✅ **hatching_egg:** 92.12% (41 tests passing)
- ❌ **window_spider_trigger:** 0% (NO TESTS - PRIORITY 1)

### C++
- ⏳ **hatching_egg:** 171 tests passing (percentage unknown - PRIORITY 2)
- ❌ **twitching_body:** 0% (Arduino-only, needs refactoring - PRIORITY 3)

### Python
- ✅ **hatching_egg:** Config validation tests passing

### Overall Goal
**Target:** 80%+ coverage across all projects
**Current:** 2 of 4 projects at 80%+ (50%)
**Next:** Get window_spider_trigger to 80% → 75% complete

---

## 📁 Key Files

### Documentation
- `SONARCLOUD_ISSUES.md` - Final status (1 remaining issue)
- `COVERAGE_ISSUES.md` - Complete coverage improvement plan
- `COVERAGE.md` - Full multi-language coverage documentation
- `.claude/coverage-guide.md` - Quick reference

### Coverage Reports
- `hatching_egg/coverage-js/` - JavaScript coverage
- `hatching_egg/coverage-cpp/` - C++ coverage
- `spider_crawl_projection/coverage/` - JavaScript coverage
- `window_spider_trigger/coverage/` - (empty, needs tests)

### CI/CD
- `.github/workflows/coverage.yml` - Coverage workflow
- `.github/workflows/unit-tests.yml` - Unit test workflow

---

## 🎯 Recommended Approach

### If you have 2-3 hours:
1. **Do Priority 1:** window_spider_trigger tests (2-3 hours)
   - This is the biggest gap and highest priority
   - Gets coverage from 50% to 75% project completion
   - See detailed test requirements in `COVERAGE_ISSUES.md`

### If you have 1 hour:
1. **Do Priority 2:** Measure C++ coverage (30 min)
2. **Start Priority 1:** Begin window_spider_trigger tests (30 min setup)

### If you have 30 minutes:
1. **Do Priority 2:** Measure C++ coverage (30 min)

---

## 🔗 Quick Commands

```bash
# Run all coverage
./scripts/run-coverage.sh

# View individual coverage reports
cd hatching_egg && pixi run view-coverage
cd spider_crawl_projection && pixi run view-coverage
cd window_spider_trigger && pixi run view-coverage

# Check SonarCloud status (should show 1 issue)
curl -s "https://sonarcloud.io/api/issues/search?componentKeys=griswaldbrooks_halloween&resolved=false&ps=10" | python3 -m json.tool

# Run specific project tests
cd window_spider_trigger && pixi run test
cd hatching_egg && pixi run test
cd spider_crawl_projection && pixi run test

# Check GitHub Actions status
gh run list --limit 5
```

---

## 📝 Notes

**Code Quality Improvements (ALL COMPLETE!):**
- ✅ All shell scripts use safer `[[` conditionals
- ✅ All HTML files have proper `lang` attributes
- ✅ JavaScript uses modern ES2015+ patterns throughout
- ✅ Python functions refactored for lower complexity
- ✅ CSS meets WCAG accessibility contrast requirements
- ✅ All string duplication eliminated
- ✅ Optimal array operations throughout
- ✅ Optional chaining used where appropriate
- ✅ SonarCloud integrated and passing (1 style issue remaining)
- ✅ CI/CD pipeline passing all checks

**Focus:** window_spider_trigger testing is now the #1 priority!

---

**Last Updated:** 2025-11-08
