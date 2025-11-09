# Next Agent Tasks - Code Coverage & Quality

**Last Updated:** 2025-11-09

---

## 🎯 Current Status

### ✅ Completed Work

**SonarCloud Integration (2025-11-08)**
- ✅ Token configured and working
- ✅ GitHub Action updated to v6
- ✅ Automatic Analysis disabled
- ✅ CI/CD pipeline passing
- ✅ Dashboard: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween

**SonarCloud Issues (2025-11-09)**
- ✅ Fixed 93 of 117 issues (79% reduction)
- ✅ All MAJOR bugs and security issues resolved
- ✅ Eliminated 250 minutes of technical debt
- ✅ Code modernized with ES2015+ patterns
- ⏳ 24 minor issues remaining (see `SONARCLOUD_ISSUES.md`)

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

### Priority 2: Fix Quick SonarCloud Wins (15 min)

**Status:** NOT STARTED
**Effort:** 15 minutes
**Impact:** MEDIUM - Easy fixes

**Quick fixes (6 issues):**
1. Fix remaining `parseInt` → `Number.parseInt` (1 issue)
2. Fix number formatting `.0` (1 issue)
3. Fix `Math.hypot` (1 issue)
4. Fix unused variable 'cephEnd' (2 issues)
5. Fix shell return statement (1 issue)

**Commands:**
```bash
# Search for these patterns:
grep -r "parseInt(" --include="*.js" | grep -v "Number.parseInt"
grep -r "\.0[^0-9]" --include="*.js"
grep -r "Math.sqrt" --include="*.js"
grep -r "cephEnd" --include="*.js"
```

**See:** `SONARCLOUD_ISSUES.md` section "Quick Wins"

---

### Priority 3: Measure hatching_egg C++ Coverage

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

### Priority 4 (Optional): Medium SonarCloud Issues (25 min)

**Status:** NOT STARTED
**Effort:** 25 minutes
**Impact:** LOW - Nice to have

**Medium priority fixes (5 issues):**
1. CSS color contrast (2 issues, 10 min) - Accessibility
2. Shell script string constants (2 issues, 6 min)
3. Array optimizations (2 issues, 5 min)
4. Node import prefix (2 issues, 4 min)

**See:** `SONARCLOUD_ISSUES.md` section "Medium Priority"

---

### Priority 5 (Low): twitching_body Refactoring

**Status:** NOT STARTED
**Effort:** 4-6 hours
**Impact:** LOW - Complex, low priority

**What to do:**
1. Extract state machine logic from `twitching_servos.ino`
2. Create separate header files for testable logic
3. Mock Adafruit_PWMServoDriver library
4. Write unit tests similar to hatching_egg pattern
5. Target: 80% coverage on testable logic

**Note:** This is a large refactoring task. Recommend doing after window_spider_trigger tests.

**See:** `COVERAGE_ISSUES.md` section "Priority 4: twitching_body"

---

## 📊 Current Coverage Status

### JavaScript
- ✅ **spider_crawl_projection:** 97.55% (10 tests passing)
- ✅ **hatching_egg:** 92.12% (41 tests passing)
- ❌ **window_spider_trigger:** 0% (NO TESTS - PRIORITY 1)

### C++
- ⏳ **hatching_egg:** 171 tests passing (percentage unknown - PRIORITY 3)
- ❌ **twitching_body:** 0% (Arduino-only, needs refactoring - PRIORITY 5)

### Python
- ✅ **hatching_egg:** Config validation tests passing

### Overall Goal
**Target:** 80%+ coverage across all projects
**Current:** 2 of 4 projects at 80%+ (50%)
**Next:** Get window_spider_trigger to 80% → 75% complete

---

## 📁 Key Files

### Documentation
- `SONARCLOUD_ISSUES.md` - Detailed breakdown of 24 remaining issues
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
1. **Do Priority 2:** Quick SonarCloud wins (15 min)
2. **Do Priority 3:** Measure C++ coverage (30 min)
3. **Start Priority 1:** Begin window_spider_trigger tests (15 min setup)

### If you have 30 minutes:
1. **Do Priority 2:** Quick SonarCloud wins (15 min)
2. **Do Priority 3:** Measure C++ coverage (15 min)

---

## 🔗 Quick Commands

```bash
# Run all coverage
./scripts/run-coverage.sh

# View individual coverage reports
cd hatching_egg && pixi run view-coverage
cd spider_crawl_projection && pixi run view-coverage
cd window_spider_trigger && pixi run view-coverage

# Check SonarCloud issues
curl -s "https://sonarcloud.io/api/issues/search?componentKeys=griswaldbrooks_halloween&resolved=false&ps=1" | grep total

# Run specific project tests
cd window_spider_trigger && pixi run test
cd hatching_egg && pixi run test
cd spider_crawl_projection && pixi run test

# Check GitHub Actions status
gh run list --limit 5
```

---

## 📝 Notes

- All shell scripts now use safer `[[` conditionals
- All HTML files have proper `lang` attributes
- JavaScript uses modern ES2015+ patterns throughout
- SonarCloud integrated and working
- CI/CD pipeline passing all checks

**Focus:** window_spider_trigger testing is the #1 priority for coverage goal!

---

**Last Updated:** 2025-11-09
