# Halloween Haunted House - Project Conventions

This document outlines the conventions, standards, and workflows for the Halloween animatronics project. All agents working on this codebase should follow these guidelines.

## Project Overview

This is a Halloween haunted house animatronics project featuring reusable Arduino-based components and effects. The project emphasizes:
- **Reliability**: Code must work consistently during Halloween events
- **Testability**: All projects target 80%+ test coverage
- **Reusability**: Components designed to be reused across multiple years
- **Maintainability**: Clear code structure and comprehensive documentation

## Project Structure

```
halloween/
├── hatching_egg/              # Arduino spider egg animatronic
│   ├── arduino/               # Arduino C++ source
│   ├── test/                  # GoogleTest C++ unit tests
│   └── pixi.toml             # Environment and task definitions
├── spider_crawl_projection/   # Browser-based spider animation
│   ├── src/                   # JavaScript animation logic
│   ├── test/                  # Jest tests
│   └── pixi.toml
├── window_spider_trigger/     # Node.js server with Arduino trigger
│   ├── server.js              # Express + Socket.IO server
│   ├── server.test.js         # Jest tests
│   └── pixi.toml
├── twitching_body/            # Arduino twitching victim animatronic
│   ├── arduino/               # Arduino C++ source
│   └── pixi.toml
└── 2025/                      # Year-specific materials
```

## Technology Stack

### Languages & Frameworks
- **Arduino C++**: Embedded code for animatronics (DFRobot Beetle, PCA9685 servo drivers)
- **Node.js**: Express servers, Socket.IO for real-time communication
- **JavaScript**: Browser-based animations, Jest testing
- **Python**: Configuration and build scripts

### Hardware
- **DFRobot Beetle** (Leonardo): Arduino-compatible microcontroller
- **PCA9685**: 16-channel PWM servo driver
- **Servos**: HS-322HD, DS-3225MG, HS-755MG (depending on project)
- **Sensors**: Momentary switches, motion sensors

### Development Tools
- **Pixi**: Environment management (replaces Docker/conda)
- **PlatformIO**: Arduino compilation and upload
- **Jest**: JavaScript/Node.js testing framework
- **GoogleTest**: C++ unit testing framework
- **c8/Istanbul**: JavaScript coverage analysis
- **lcov/gcov**: C++ coverage analysis

## Code Standards

### Arduino C++ (Embedded)

**Best Practices:**
- Minimize dynamic memory allocation (use stack allocation when possible)
- Use `const` for configuration values and constants
- Keep timing-sensitive code in main loop, avoid interrupts
- Document hardware dependencies (pins, I2C addresses, servo ranges)
- Extract testable logic into separate header files

**Testability Pattern (see hatching_egg for reference):**
```cpp
// arduino/logic.h - Pure logic, no hardware I/O
namespace Logic {
  int calculateServoAngle(int position, int min, int max);
  bool shouldTransition(unsigned long currentTime, unsigned long lastTime);
}

// arduino/project_name.ino - Hardware I/O only
#include "logic.h"
PCA9685 pwm;
void loop() {
  int angle = Logic::calculateServoAngle(pos, 0, 180);
  pwm.setServoPulse(0, angle);
}

// test/mock_pwm.h - Mock hardware for testing
class MockPWM {
  std::vector<int> calls;
  void setServoPulse(int channel, int pulse) { calls.push_back(pulse); }
};

// test/test_logic.cpp - Unit tests
TEST(Logic, CalculateServoAngle) {
  EXPECT_EQ(Logic::calculateServoAngle(50, 0, 180), 90);
}
```

### JavaScript/Node.js

**Best Practices:**
- Use modern ES6+ syntax (const/let, arrow functions, async/await)
- Prefer async/await over raw promises
- Use try/catch for error handling
- Mock external dependencies in tests (serialport, Socket.IO)
- Use descriptive variable names

**CRITICAL - Browser Compatibility:**
- **ALWAYS use `typeof window !== 'undefined'` for browser detection**
- **NEVER use `globalThis.window !== undefined` or similar patterns**
- The `typeof` operator is REQUIRED for safe browser/Node.js dual compatibility
- Changing this pattern WILL break browser functionality (classes won't export)
- See spider_crawl_projection regression (Nov 2025) where globalThis changes broke browser exports

**Correct browser export pattern:**
```javascript
// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MyClass };
}

// Browser export - MUST use typeof for safety
if (typeof window !== 'undefined') {
    window.MyClass = MyClass;
}
```

**WRONG patterns that will break browser:**
```javascript
// ❌ WRONG - Will fail in browser
if (globalThis.window !== undefined) {
    globalThis.MyClass = MyClass;
}

// ❌ WRONG - May cause reference errors
if (window !== undefined) {
    window.MyClass = MyClass;
}
```

**Testing Pattern:**
```javascript
// Mock external dependencies
jest.mock('serialport');
const { SerialPort } = require('serialport');

describe('Server', () => {
  let mockPort;

  beforeEach(() => {
    mockPort = {
      write: jest.fn(),
      on: jest.fn(),
    };
    SerialPort.mockImplementation(() => mockPort);
  });

  test('should handle serial data', () => {
    // Test implementation
  });
});
```

### Python

**Best Practices:**
- Use type hints for function signatures
- Follow PEP 8 style guidelines
- Use descriptive variable names
- Document complex logic with docstrings

## Testing Standards

### Coverage Target: 80%+

All projects should maintain at least 80% test coverage. Current status:
- ✅ hatching_egg: 92.12% JS, 85.9% C++ (241 tests)
- ✅ spider_crawl_projection: 97.55% (11 test suites + 2 regression prevention suites with 15 tests)
- ⚠️ window_spider_trigger: 65.28% (33 tests) - **Priority 1**
- ❌ twitching_body: 0% - **Priority 2** (needs refactoring)

### Test Organization

**JavaScript (Jest):**
- Test files: `*.test.js` or `*.spec.js`
- Place tests next to source files or in `test/` directory
- Use descriptive test names: `test('should handle serial port error', ...)`
- Mock hardware: serialport, Socket.IO, file system
- Run: `pixi run test`
- Coverage: `pixi run coverage`

**C++ (GoogleTest):**
- Test files: `test/test_*.cpp`
- Separate testable logic from hardware I/O
- Create mock interfaces for hardware (PWM, Serial, etc.)
- Run: `pixi run test-cpp`
- Coverage: `pixi run test-cpp-coverage`

### What to Test

**Priority:**
1. **Happy paths**: Normal operation with typical inputs
2. **Error conditions**: Network failures, serial port errors, invalid inputs
3. **Edge cases**: Empty inputs, boundary values, null/undefined
4. **Event handlers**: Socket.IO events, serial port events, user interactions
5. **State management**: Transitions, timing, animation sequences

**Mock Hardware:**
- Serial ports (Arduino communication)
- Servo drivers (PCA9685)
- Socket.IO connections
- File system operations
- Timer/setTimeout functions

## Pixi Workflow

All tasks run through Pixi, which manages environments automatically:

```bash
# Navigate to project
cd <project-name>

# Run tests
pixi run test

# Run tests with coverage
pixi run coverage

# View coverage report
pixi run view-coverage

# For Arduino projects
pixi run upload    # Upload to Arduino
pixi run monitor   # Serial monitor
```

**Important:** Never run tests or builds outside of Pixi. Pixi ensures consistent environments across machines.

## Documentation Standards

### README Files
Each project should have:
- Quick start guide
- Hardware requirements
- Testing instructions
- Current test coverage status

### Code Documentation
- Explain **WHY**, not WHAT (code should be self-documenting for WHAT)
- Document non-obvious algorithms or timing requirements
- Note hardware dependencies (pins, I2C addresses, servo ranges)
- Reference external sources when porting code

### Project Documentation
- **CLAUDE.md** (this file): Project conventions and standards
- **NEXT_AGENT_COVERAGE.md**: Quick-start guide for coverage improvement
- **COVERAGE_ISSUES.md**: Detailed implementation guides for coverage work
- **COVERAGE.md**: How to run coverage locally

## Git Workflow

### Commit Messages
- Use descriptive, present-tense messages
- Format: "Add serial port error handling to window_spider_trigger"
- Not: "Added stuff" or "Fix bug"

### What to Commit
- ✅ Source code changes
- ✅ Test additions/improvements
- ✅ Documentation updates
- ✅ Configuration files (pixi.toml, package.json)
- ❌ Coverage reports (generated files)
- ❌ node_modules or build artifacts
- ❌ .env files or secrets

## Common Patterns

### Hardware Abstraction for Testing

```cpp
// Define interface
class IPWMDriver {
  virtual void setServoPulse(int channel, int pulse) = 0;
};

// Real implementation
class RealPWMDriver : public IPWMDriver {
  PCA9685 pwm;
  void setServoPulse(int channel, int pulse) override {
    pwm.setServoPulse(channel, pulse);
  }
};

// Mock for testing
class MockPWMDriver : public IPWMDriver {
  std::vector<std::pair<int, int>> calls;
  void setServoPulse(int channel, int pulse) override {
    calls.push_back({channel, pulse});
  }
};
```

### Serial Port Mocking (Jest)

```javascript
jest.mock('serialport');
const { SerialPort } = require('serialport');

beforeEach(() => {
  // Create mock with controllable behavior
  mockPort = {
    write: jest.fn((data, callback) => callback && callback()),
    on: jest.fn(),
    close: jest.fn(),
  };
  SerialPort.mockImplementation(() => mockPort);
});

test('should handle serial events', () => {
  // Trigger events manually
  const openHandler = mockPort.on.mock.calls.find(
    call => call[0] === 'open'
  )[1];
  openHandler();
  // Assert expected behavior
});
```

## Reference Implementations

- **hatching_egg**: Excellent example of Arduino C++ testing with 85.9% coverage
  - Shows hardware abstraction pattern
  - Mock PWM driver implementation
  - Comprehensive GoogleTest suite

- **spider_crawl_projection**: Clean JavaScript testing with 97.55% coverage
  - Good example of Jest testing patterns
  - Proper mocking of browser APIs
  - **Regression prevention tests** (2025-11-09):
    - Static analysis with test-method-calls.js (11 tests)
    - Browser simulation with jsdom in test-browser-exports.js (4 tests)
    - Catches missing methods, broken export patterns, race conditions
    - Prevents globalThis vs window export bugs

## Troubleshooting

### Tests Not Running
1. Check you're in correct directory: `pwd`
2. Verify pixi.toml exists: `ls pixi.toml`
3. Run: `pixi install` to ensure environment is set up
4. Check for typos in test filenames (must match `*.test.js` or `test_*.cpp`)

### Coverage Not Generated
1. Verify coverage task exists: `pixi task list | grep coverage`
2. For JS: Check package.json has jest coverage config
3. For C++: Check CMakeLists.txt has coverage flags

### Arduino Upload Fails
1. Check USB connection
2. Verify correct board in platformio.ini
3. Check serial port permissions: `ls -l /dev/ttyUSB*`

## Resources

- **hatching_egg/README.md**: Hardware setup, animation sequences
- **NEXT_AGENT_COVERAGE.md**: Coverage improvement priorities
- **COVERAGE_ISSUES.md**: Detailed test implementation guides
- GitHub Actions: CI/CD runs all tests automatically

## Success Criteria

Before marking work complete:
- ✅ All tests pass (`pixi run test`)
- ✅ Coverage meets 80%+ target
- ✅ No linter warnings
- ✅ Documentation updated
- ✅ For animatronics: hardware tested and working
- ✅ Code reviewed by another agent or human

---

**Last Updated:** 2025-11-09
**Target:** Achieve 80%+ coverage across all projects
