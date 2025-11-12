# Production Embedded Systems Testing Guide

## Context

This Halloween animatronics project requires production-quality embedded systems:
- **Safety-critical:** Runs around people for hours
- **Reliability-critical:** Must work consistently during events
- **Multi-year maintenance:** Code extended and modified annually
- **Multi-platform:** Support various MCUs (Arduino, ESP32, Pico)
- **Headless operation:** Must work without monitor or intervention

## Architecture Pattern: Hardware Abstraction Layer

### The Problem

Traditional Arduino code mixes hardware I/O with business logic:

```cpp
// ❌ Untestable, platform-specific, hard to maintain
void loop() {
  // Direct hardware access mixed with logic
  int sensor = analogRead(A0);
  if (sensor > 500) {
    pwm.setPWM(0, 0, map(sensor, 0, 1023, 150, 600));
  }
  delay(100);
}
```

**Problems:**
- Cannot unit test without hardware
- Platform-specific (analogRead, pwm are Arduino-only)
- Hard to debug (no way to inject test values)
- Cannot port to other platforms easily

### The Solution: Layered Architecture

```cpp
// Layer 1: Hardware Interface (portable contract)
class ISensorReader {
  virtual int readValue() = 0;
};

class IServoController {
  virtual void setPosition(int servo, int angle) = 0;
  virtual int getPosition(int servo) = 0;
};

// Layer 2: Business Logic (pure, testable, portable)
class AnimationController {
  ISensorReader& sensor;
  IServoController& servos;

  AnimationController(ISensorReader& s, IServoController& sc)
    : sensor(s), servos(sc) {}

  void update() {
    int sensorValue = sensor.readValue();
    if (sensorValue > 500) {
      int angle = calculateAngle(sensorValue);
      servos.setPosition(0, angle);
    }
  }

  int calculateAngle(int sensorValue) {
    // Pure function - easily tested
    return map(sensorValue, 0, 1023, 0, 180);
  }
};

// Layer 3: Platform Implementation (Arduino)
class ArduinoAnalogSensor : public ISensorReader {
  int pin;
public:
  ArduinoAnalogSensor(int p) : pin(p) {}
  int readValue() override { return analogRead(pin); }
};

class PCA9685Controller : public IServoController {
  Adafruit_PWMServoDriver pwm;
public:
  void setPosition(int servo, int angle) override {
    int pulse = map(angle, 0, 180, 150, 600);
    pwm.setPWM(servo, 0, pulse);
  }
  int getPosition(int servo) override {
    // Implementation details
  }
};

// Layer 4: Mock Implementation (for testing)
class MockSensor : public ISensorReader {
  int value;
public:
  void setValue(int v) { value = v; }
  int readValue() override { return value; }
};

class MockServoController : public IServoController {
  std::map<int, int> positions;
public:
  void setPosition(int servo, int angle) override {
    positions[servo] = angle;
  }
  int getPosition(int servo) override {
    return positions.count(servo) ? positions[servo] : 0;
  }
  // Test helper
  int getCallCount() { return positions.size(); }
};

// Layer 5: Glue Code (.ino file - < 100 lines)
ArduinoAnalogSensor sensor(A0);
PCA9685Controller servos;
AnimationController controller(sensor, servos);

void setup() {
  // Hardware initialization only
  servos.begin();
  sensor.begin();
}

void loop() {
  // Just call business logic
  controller.update();
  delay(100);
}
```

### Benefits

✅ **Testable:** Unit tests use MockSensor and MockServoController
✅ **Portable:** Same logic works on ESP32, Pico, etc. (just implement interfaces)
✅ **Maintainable:** Business logic separate from hardware details
✅ **Debuggable:** Can inject test values, log state changes
✅ **Reliable:** High test coverage ensures correct behavior

## Test Pyramid for Embedded Systems

```
        ┌─────────────┐
        │   Manual    │  <- Actual hardware, pre-deployment
        │   Tests     │     Physical behavior, multi-hour runtime
        └─────────────┘     Frequency: Before events
       ┌───────────────┐
       │  Integration  │  <- Mock hardware, full workflows
       │     Tests     │     Animation sequences, error recovery
       └───────────────┘     Coverage Target: 70%+
      ┌─────────────────┐
      │   Unit Tests    │  <- Pure logic, no hardware
      │  (80% target)   │     Calculations, state machines
      └─────────────────┘     Fast, run on every commit
```

### Unit Tests (80% coverage target)

**What to test:**
- Pure logic functions (calculateAngle, etc.)
- State machine transitions
- Configuration parsing
- Timing calculations
- Error handling logic

**Example:**
```cpp
// test/test_animation_controller.cpp
TEST(AnimationController, CalculatesAngleCorrectly) {
  MockSensor sensor;
  MockServoController servos;
  AnimationController controller(sensor, servos);

  sensor.setValue(500);
  controller.update();

  EXPECT_EQ(servos.getPosition(0), 88); // map(500, 0, 1023, 0, 180)
}

TEST(AnimationController, HandlesLowSensorValue) {
  MockSensor sensor;
  MockServoController servos;
  AnimationController controller(sensor, servos);

  sensor.setValue(100);
  controller.update();

  // Should not move servo when sensor < 500
  EXPECT_EQ(servos.getCallCount(), 0);
}
```

### Integration Tests (70% coverage target)

**What to test:**
- Full animation sequences
- Multi-component interactions
- Error recovery workflows
- Timing and synchronization

**Example:**
```cpp
// test/test_animation_sequence.cpp
TEST(AnimationSequence, PlaysFullSequence) {
  MockServoController servos;
  AnimationSequence seq(servos);

  seq.play("spider_emerge");

  // Verify sequence of servo movements
  std::vector<int> positions = servos.getHistory();
  EXPECT_EQ(positions.size(), 5); // 5 keyframes
  EXPECT_EQ(positions[0], 0);     // Start position
  EXPECT_EQ(positions[4], 180);   // End position
}
```

### Manual Tests (pre-deployment only)

**What to test:**
- Physical servo movements are smooth
- Sensors read correctly in environment
- Timing is accurate over hours
- Power consumption acceptable
- Thermal behavior safe
- Multiple units don't interfere

**Test before:**
- First deployment
- After hardware changes
- After significant code changes

## Coverage Targets

| Layer | Target | Why |
|-------|--------|-----|
| Core logic (calculations, state machines) | 80%+ | Safety-critical, must be correct |
| Application logic (workflows, sequences) | 70%+ | Important but less critical |
| Hardware wrappers (thin I/O) | Integration tests | Simple enough to test via integration |
| .ino files (glue code) | Manual tests | Too thin to unit test meaningfully |

## Real-World Example: hatching_egg

### Current State (Good)

**Testable logic extracted to headers:**
- `arduino/servo_mapping.h` - 98% coverage, 44 tests
- `arduino/servo_tester_logic.h` - 34 tests
- `arduino/servo_sweep_test_logic.h` - 93 tests

**Result:** 85.9% C++ coverage, 171 tests, no hardware required

### What Made This Possible

1. **Logic separated from I/O:**
   ```cpp
   // Pure logic in header
   int calculatePulseWidth(int angle, int minPulse, int maxPulse) {
     return map(angle, 0, 180, minPulse, maxPulse);
   }

   // Thin wrapper in .ino
   void setServoAngle(int servo, int angle) {
     int pulse = calculatePulseWidth(angle, 150, 600);
     pwm.setPWM(servo, 0, pulse);
   }
   ```

2. **Mock hardware for tests:**
   ```cpp
   class MockPWM {
     std::vector<int> pulses;
   public:
     void setPWM(int ch, int on, int off) {
       pulses.push_back(off);
     }
     std::vector<int> getPulses() { return pulses; }
   };
   ```

3. **Comprehensive test cases:**
   - Boundary conditions (0°, 180°)
   - Edge cases (negative angles, > 180°)
   - Timing tests (debounce, delays)
   - Error conditions

## Portability Across Platforms

### Platform-Specific Files

```
project/
├── src/
│   ├── AnimationController.h    # Pure logic (all platforms)
│   └── AnimationController.cpp
├── platform/
│   ├── arduino/
│   │   ├── ArduinoServo.h       # Arduino implementation
│   │   └── main.ino             # Arduino glue
│   ├── esp32/
│   │   ├── ESP32Servo.h         # ESP32 implementation
│   │   └── main.cpp             # ESP32 glue
│   └── pico/
│       ├── PicoServo.h          # Pico implementation
│       └── main.cpp             # Pico glue
└── test/
    ├── MockServo.h               # Mock for all platforms
    └── test_animation.cpp        # Tests use mock
```

### Same Logic, Different Platforms

```cpp
// Same business logic everywhere
class AnimationController {
  IServoController& servos;
public:
  void playAnimation() {
    servos.setPosition(0, 90);
    // ... logic
  }
};

// Arduino platform
class ArduinoServo : public IServoController {
  Servo servo;
  void setPosition(int s, int angle) override {
    servo.write(angle);
  }
};

// ESP32 platform
class ESP32Servo : public IServoController {
  ESP32PWM pwm;
  void setPosition(int s, int angle) override {
    pwm.write(s, angleToPulse(angle));
  }
};

// Pico platform
class PicoServo : public IServoController {
  void setPosition(int s, int angle) override {
    pwm_set_gpio_level(s, angleToPulse(angle));
  }
};
```

## Best Practices

### DO ✅

- Extract all logic to headers (.h files)
- Use interface classes for hardware
- Write unit tests for all logic
- Keep .ino files < 100 lines
- Test without hardware first
- Target 80% coverage for core logic
- Document platform requirements

### DON'T ❌

- Mix hardware calls with business logic
- Write logic directly in .ino files
- Use platform-specific APIs in core logic
- Skip tests because "it's just embedded"
- Assume code works without testing
- Hardcode platform-specific values

## Tools and Commands

### Run Tests

```bash
# Unit tests (fast, no hardware)
cd hatching_egg && pixi run test-cpp

# With coverage
cd hatching_egg && pixi run test-cpp-coverage

# View coverage report
cd hatching_egg && pixi run view-coverage-cpp
```

### Verify Coverage

```bash
# Local verification
pixi run coverage
pixi run view-coverage

# SonarCloud verification
python tools/sonarcloud_verify.py --component hatching_egg
```

## Next Steps: Refactoring twitching_body

Currently 0% coverage. To bring to production quality:

1. **Extract logic** from .ino file to headers
2. **Create interfaces** for hardware (servos, sensors)
3. **Write unit tests** for extracted logic (target: 80%)
4. **Create mocks** for testing
5. **Add integration tests** for workflows
6. **Document** platform requirements
7. **Verify** with tools

Estimated effort: 8-12 hours for full refactoring to production standards.

## References

- Real example: hatching_egg (85.9% coverage, 171 tests)
- Testing guide: `CLAUDE.md` sections on testing
- Coverage verification: `VERIFIED_LOCAL_COVERAGE.md`
- Tools: `tools/sonarcloud_verify.py`
