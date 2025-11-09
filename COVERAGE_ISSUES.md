# Coverage Issues & Action Items

**Last Updated:** 2025-11-08 (post SonarCloud cleanup)
**Status:** Active work items for 80% coverage goal

---

## ✅ Resolved Issues

### 1. SonarCloud Integration
**Status:** ✅ **FIXED** (2025-11-08)
**Actions Completed:**
- Token configured and working
- GitHub Action updated to v6
- Automatic Analysis disabled
- CI/CD pipeline passing
- Dashboard: https://sonarcloud.io/dashboard?id=griswaldbrooks_halloween

### 2. SonarCloud Code Quality
**Status:** ✅ **COMPLETE** (2025-11-08)
**Issues Fixed:** 116 of 117 (99%)
**Technical Debt Eliminated:** 330+ minutes

**Commits:**
- Phase 5: `54f4199` - Fixed 24 issues
- Phase 6: `13c89b3` - Fixed 6 issues
- Phase 7: `d285246` - Fixed 4 issues
- Phase 8: `fa4385b` - Fixed 2 issues

**Remaining:** 1 issue (async IIFE - style preference only)

See `SONARCLOUD_ISSUES.md` for complete details.

---

## 📊 Coverage Status

### Current Coverage by Project

| Project | Language | Coverage | Tests | Status |
|---------|----------|----------|-------|--------|
| hatching_egg | JavaScript | 92.12% | 41 | ✅ |
| hatching_egg | C++ | Unknown* | 171 | ⚠️ Needs measurement |
| hatching_egg | Python | ✅ | Config tests | ✅ |
| spider_crawl_projection | JavaScript | 97.55% | 10 | ✅ |
| **window_spider_trigger** | **JavaScript** | **0%** | **0** | **🔴 PRIORITY** |
| **twitching_body** | **C++** | **0%** | **0** | **🔴 NEEDS REFACTORING** |

\* C++ coverage runs but percentage not extracted/reported yet

---

## 🎯 Priority Work Items

### Priority 1: window_spider_trigger (0% → 80%)
**Effort:** Medium (2-3 hours)
**Complexity:** Moderate (need mocking)

**Files to test:**
- `server.js` - Express server, Socket.IO, Arduino serial communication

**Test requirements:**
1. **HTTP endpoint tests** (use `supertest`)
   - GET / returns index.html
   - Static files served from /public
   - Server starts on correct port

2. **Socket.IO tests** (use `socket.io-client`)
   - Client connects successfully
   - Trigger event emitted to clients
   - Multiple clients receive broadcasts

3. **Serial communication tests** (mock `serialport`)
   - Serial port opens on correct device
   - Reads trigger signals from Arduino
   - Handles serial errors gracefully
   - Reconnects on disconnect

4. **Integration tests**
   - Arduino trigger → Socket.IO broadcast → All clients notified
   - Server handles no Arduino connected
   - Server handles multiple rapid triggers

**Test structure:**
```
window_spider_trigger/
├── server.test.js          # Main server tests
├── socket.test.js          # Socket.IO tests
└── serial.test.js          # Serial communication tests
```

**Dependencies needed:**
- `supertest` - HTTP endpoint testing
- `socket.io-client` - Socket.IO client for tests
- Already has `jest` configured

---

### Priority 2: Fix SonarCloud Integration
**Effort:** Low (15 minutes)
**Complexity:** Low (just configuration)

**Steps:**
1. Set up SonarCloud project (see Critical Issue #1 above)
2. Update GitHub Action to use new version
3. Verify workflow passes

---

### Priority 3: Measure C++ Coverage for hatching_egg
**Effort:** Low (30 minutes)
**Complexity:** Low (coverage already runs)

**Action Required:**
- Coverage reports already generated at `hatching_egg/coverage-cpp/index.html`
- Extract percentage from report
- Add to documentation
- Verify it's ≥80%

**Script to extract percentage:**
```bash
cd hatching_egg
pixi run coverage
grep -A 2 "headerCovTableEntry" coverage-cpp/index.html | grep -oP '\d+\.\d+%' | head -1
```

---

### Priority 4: twitching_body Refactoring (0% → 80%)
**Effort:** High (4-6 hours)
**Complexity:** High (requires refactoring)

**Current state:**
- All code in `arduino/twitching_servos/twitching_servos.ino`
- Hardware-dependent (PCA9685, Wire library)
- No testable separation

**Refactoring approach:**
Follow `hatching_egg` pattern:
1. Extract state machine logic to separate header files
2. Create mock implementations for hardware
3. Write unit tests using gtest
4. Test movement algorithms independent of hardware

**Files to create:**
```
twitching_body/
├── arduino/
│   └── movement_logic.h        # Testable state machine
├── test/
│   ├── test_movement.cpp       # gtest unit tests
│   └── mock_pwm.h              # Mock PCA9685
└── pixi.toml                   # Add test tasks
```

**Example testable logic:**
- State machine transitions (still → slow → jerk → still)
- Movement target calculations
- Timing/duration logic
- Servo angle calculations

---

## 📋 Implementation Order

**Current Phase: Coverage Testing**
1. ✅ SonarCloud integration fixed
2. ✅ SonarCloud issues resolved (116/117)
3. 🔄 Measure hatching_egg C++ coverage (30 min)
4. 🔄 Add tests for window_spider_trigger (2-3 hours)
   - HTTP endpoint tests + Socket.IO tests
   - Serial communication mocking + integration tests
   - Reach 80% coverage
5. 🔄 Refactor twitching_body for testability (4-6 hours)
   - Extract state machine logic
   - Write unit tests
   - Achieve 80% coverage

**Future Priority:**
6. Optional: Fix async IIFE style issue (ES module conversion)
7. Optional: Add C++ analysis to SonarCloud
   - Generate compilation database for Arduino projects
   - Configure build-wrapper for C++ analysis
   - See: https://docs.sonarsource.com/sonarcloud/advanced-setup/languages/c-family/

---

## 🎯 Success Criteria

**Coverage Goal:** All projects at ≥80% coverage

**Metrics:**
- ✅ hatching_egg JavaScript: 92.12% (already passing)
- ⏳ hatching_egg C++: TBD (measure)
- ✅ spider_crawl_projection: 97.55% (already passing)
- ⏳ window_spider_trigger: 0% → 80%
- ⏳ twitching_body: 0% → 80%

**Quality Gates:**
- ✅ All tests passing
- ✅ SonarCloud scan passing
- ✅ Codecov reporting correctly
- ✅ No critical bugs/vulnerabilities
- ✅ Code smells addressed

---

## 📚 Resources

**Documentation:**
- `.claude/NEXT_AGENT.md` - Detailed coverage improvement guide
- `COVERAGE.md` - Complete coverage documentation
- `.claude/coverage-guide.md` - Quick reference

**Examples:**
- `hatching_egg/` - Best example of multi-language testing
  - C++ testing with gtest and mocks
  - JavaScript testing with comprehensive coverage
  - Python config validation

**Tools:**
- SonarCloud: https://sonarcloud.io/project/overview?id=griswaldbrooks_halloween
- Codecov: https://codecov.io/gh/griswaldbrooks/halloween
- Local: `./scripts/run-coverage.sh`

---

## ✅ Completed Steps

1. ✅ **SonarCloud Integration** (2025-11-08)
   - Token configured
   - GitHub Action updated to v6
   - Automatic Analysis disabled
   - Workflow passing successfully

2. ✅ **SonarCloud Issues Fixed** (2025-11-08)
   - Fixed 116 of 117 issues (99% reduction)
   - Eliminated 330+ minutes of technical debt
   - ALL bugs and security issues resolved
   - ALL code quality issues addressed
   - Only 1 remaining issue (async IIFE style preference)

## 🎯 Next Steps for Coverage

**Priority 1: window_spider_trigger (0% → 80%)**
- **Status:** NOT STARTED
- **Effort:** 2-3 hours
- **Impact:** HIGH - Critical for coverage goal
- **See:** Priority Work Items section above

**Priority 2: Measure hatching_egg C++ coverage**
- **Status:** Coverage runs but percentage not extracted
- **Effort:** 30 minutes
- **Impact:** MEDIUM - Need to verify ≥80%
- **Action:** Extract percentage from `hatching_egg/coverage-cpp/index.html`

**Priority 3: twitching_body refactoring**
- **Status:** NOT STARTED
- **Effort:** 4-6 hours (requires refactoring)
- **Impact:** MEDIUM - Complex, do after Priority 1 & 2

**SonarCloud is DONE!** Focus on coverage testing now.

**Last Updated:** 2025-11-08
