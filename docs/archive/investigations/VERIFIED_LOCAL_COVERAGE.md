# Verified Local Coverage Status
Last Updated: 2025-11-11
Last Verified By: Tool verification + local test runs

## Verification Method

Coverage is verified through:
1. Local test execution: `pixi run test` and `pixi run coverage`
2. SonarCloud API queries: `python tools/sonarcloud_verify.py`
3. Direct inspection of lcov.info files

## Current Verified State

### hatching_egg

**Python:**
- Coverage: 92% (verified local + SonarCloud)
- Files: generate_arduino_config.py
- Tests: 45 unit tests in test_generate_arduino_config.py
- Command: `cd hatching_egg && pixi run test-python-coverage`
- SonarCloud: ✅ Verified via tool (92.0%)

**JavaScript:**
- Coverage: 90.6% (verified local + SonarCloud)
- Files: leg-kinematics.js
- Tests: 31 tests in test_leg_kinematics.js
- Command: `cd hatching_egg && pixi run test`
- SonarCloud: ✅ Verified via tool (90.6%)

**C++:**
- Coverage: 85.9% (verified local only)
- Files: servo_mapping.h, servo_tester_logic.h, servo_sweep_test_logic.h
- Tests: 171 GoogleTest tests (44 + 34 + 93)
- Command: `cd hatching_egg && pixi run test-cpp-coverage`
- View: `cd hatching_egg && pixi run view-coverage-cpp`
- SonarCloud: ⚠️ Not displaying (investigating)

**Overall:** 89% average across all languages

### window_spider_trigger

**JavaScript/Node.js:**
- Coverage: 98.62% local, 96.6% SonarCloud (verified)
- Files: server.js (90.7%), SerialPortManager.js (99.0%), SocketIOHandler.js (100.0%)
- Tests: 91 Jest tests
- Command: `cd window_spider_trigger && pixi run test-coverage`
- SonarCloud: ✅ Verified via tool (96.6% average)

### spider_crawl_projection

**JavaScript:**
- Coverage: 97.48% (verified local + SonarCloud)
- Files: 14 library files with 86-97% coverage each
- Tests: 11 test suites + 2 regression suites (15 tests total)
- Command: `cd spider_crawl_projection && pixi run coverage`
- SonarCloud: ✅ Verified via tool (93.1% average)

### twitching_body

**All Languages:**
- Coverage: 0% (untested)
- Status: ❌ Needs refactoring and testing
- Priority: High (next project to refactor)

## Verification Commands

### Verify Local Coverage

```bash
# All projects
cd <project> && pixi run coverage && pixi run view-coverage

# Specific examples
cd hatching_egg && pixi run coverage-all
cd window_spider_trigger && pixi run test-coverage
cd spider_crawl_projection && pixi run coverage
```

### Verify SonarCloud State

```bash
# Specific component
python tools/sonarcloud_verify.py --component hatching_egg

# Compare with local
python tools/sonarcloud_verify.py --component hatching_egg --compare-local hatching_egg/coverage-js/lcov.info

# Whole project
python tools/sonarcloud_verify.py --project griswaldbrooks_halloween
```

## What Is NOT Verified

- Browser-only code (animation-behaviors.js, preview-app.js) - excluded as untestable in Node.js
- .ino files - untestable without hardware, logic extracted to headers
- Hardware integration - requires actual devices, tested manually pre-deployment

## Coverage Targets

- **Core logic:** 80%+ ✅ (All projects meet or exceed)
- **Application logic:** 70%+ ✅ (All projects meet or exceed)
- **Overall:** 80%+ ✅ (hatching_egg: 89%, window_spider_trigger: 98.62%, spider_crawl_projection: 97.48%)

## Known Discrepancies

1. **hatching_egg C++ in SonarCloud:** Local 85.9%, SonarCloud not displaying
   - Status: Under investigation
   - Workaround: Use local coverage reports

2. **Browser-only files:** Excluded from coverage metrics
   - Reason: Cannot be tested in Node.js environment
   - Alternative: Manual testing

## To Update This Document

When coverage changes:
1. Run tests locally and capture output
2. Run SonarCloud verification tool
3. Update this document with new numbers
4. Update "Last Updated" date
5. Commit changes
