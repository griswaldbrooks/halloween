# Next Agent Tasks - Code Coverage Improvement

## Current Status

Multi-language code coverage has been implemented:
- **JavaScript:** c8/Istanbul coverage working
- **C++:** lcov/gcov coverage working
- **Python:** coverage.py working

## Goal: 80%+ Code Coverage

**Target:** All JavaScript and C++ code should be at or above 80% code coverage.

### Current Coverage Status

**JavaScript:**
- window_spider_trigger: 0% (no tests yet - NEEDS WORK)
- spider_crawl_projection: 97.55% ✅
- hatching_egg: 92.12% ✅

**C++:**
- hatching_egg: 171 unit tests (MEASURE ACTUAL % - likely high but needs verification)
- twitching_body: NO COVERAGE (Arduino-only, hardware-dependent)

### Required Work

1. **window_spider_trigger (JavaScript)**
   - Currently has 0% coverage (no tests)
   - Need to add unit tests for:
     - server.js (Express server, Socket.IO)
     - Arduino serial communication
     - Video trigger logic
   - Use supertest for HTTP endpoint testing
   - Mock serialport for serial communication tests

2. **C++ Code Refactoring**
   - Some C++ code may need refactoring to reach 80% coverage
   - See `hatching_egg` for example of well-tested C++ code
   - Pattern: Extract testable logic from hardware-dependent code
   - Create mocks for Arduino-specific functions
   - Separate business logic from I/O operations

3. **twitching_body (C++)**
   - Currently Arduino-only (no unit tests)
   - Status: PRODUCTION-READY but needs tests
   - To add coverage:
     - Extract animation/state machine logic into separate C++ files
     - Create unit tests similar to hatching_egg pattern
     - Mock Arduino libraries (Adafruit_PWMServoDriver, Wire, etc.)
     - Test state machine logic independent of hardware
     - Goal: 80% coverage on testable logic

### SonarCloud Issues

Once SonarCloud is configured and running:
1. Review quality gate status
2. Address code smells
3. Fix security hotspots
4. Improve code coverage gaps
5. Refactor duplicated code

### Commands

```bash
# Run coverage for all projects
./scripts/run-coverage.sh

# View reports
cd hatching_egg && pixi run view-coverage
cd spider_crawl_projection && pixi run view-coverage
cd window_spider_trigger && pixi run view-coverage

# Check current coverage percentages
cat hatching_egg/coverage-cpp/index.html | grep -A 2 "headerCovTableEntry"
cat spider_crawl_projection/coverage/index.html | grep -A 2 "total"
```

### References

- COVERAGE.md - Full coverage documentation
- .claude/coverage-guide.md - Quick reference for agents
- hatching_egg/pixi.toml - Example of multi-language coverage setup

## Priority Order

1. Set up SonarCloud and review quality issues
2. Add tests to window_spider_trigger (0% → 80%)
3. Measure actual C++ coverage in hatching_egg
4. Refactor C++ if needed to reach 80%
5. Consider twitching_body refactoring (if time permits)

---

**Last Updated:** 2025-11-08
