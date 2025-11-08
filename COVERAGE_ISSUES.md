# Coverage Issues & Action Items

**Generated:** 2025-11-08
**Status:** Active work items for 80% coverage goal

---

## 🔴 Critical Issues

### 1. SonarCloud Integration Broken
**Status:** ❌ Failing on all pushes
**Error:** `Project not found. Please check the 'sonar.projectKey' and 'sonar.organization' properties, the 'SONAR_TOKEN' environment variable`

**Root Cause:**
- `SONAR_TOKEN` secret is missing or invalid in GitHub repository secrets
- Project may not exist in SonarCloud yet

**Action Required:**
1. Go to https://sonarcloud.io/ and sign in with GitHub
2. Create organization `griswaldbrooks` if it doesn't exist
3. Import the `halloween` repository
4. Generate a new token from Account → Security
5. Add `SONAR_TOKEN` to GitHub Secrets:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `SONAR_TOKEN`
   - Value: (paste token from SonarCloud)

**Files:**
- `.github/workflows/coverage.yml` - Workflow file
- `sonar-project.properties` - Configuration

---

### 2. Deprecated GitHub Action
**Status:** ⚠️ Warning on every run
**Error:** `This action is deprecated and will be removed in a future release. Please use the sonarqube-scan-action action instead.`

**Root Cause:**
- Using old action: `SonarSource/sonarcloud-github-action@master`
- Should use: `SonarSource/sonarqube-scan-action@v5`

**Action Required:**
Update `.github/workflows/coverage.yml` line 56:
```yaml
# OLD:
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master

# NEW:
- name: SonarCloud Scan
  uses: SonarSource/sonarqube-scan-action@v5
```

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

**Week 1:**
1. ✅ Update twitching_body status to "needs tests"
2. 🔄 Fix SonarCloud integration (Priority 2)
3. 🔄 Update to new GitHub Action
4. 🔄 Measure hatching_egg C++ coverage (Priority 3)

**Week 2:**
5. Add tests for window_spider_trigger (Priority 1)
   - Day 1: HTTP endpoint tests + Socket.IO tests
   - Day 2: Serial communication mocking + integration tests
   - Day 3: Fix any coverage gaps, reach 80%

**Week 3:**
6. Refactor twitching_body for testability (Priority 4)
   - Day 1-2: Extract state machine logic
   - Day 3-4: Write unit tests
   - Day 5: Achieve 80% coverage

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

## Next Steps

**Immediate (today):**
1. Set up SonarCloud token
2. Update GitHub Action
3. Verify workflow passes

**This week:**
1. Write window_spider_trigger tests
2. Achieve 80% coverage goal

**Documented:** 2025-11-08
