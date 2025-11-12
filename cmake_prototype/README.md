# CMake-Based Arduino Library with GoogleTest

This prototype demonstrates the industry-standard approach to structuring Arduino projects with:
- Shared library code (no duplication)
- C++ unit tests with GoogleTest
- Code coverage with gcovr
- SonarCloud integration
- Arduino-cli compatibility

## Quick Start

```bash
# Navigate to prototype
cd cmake_prototype

# Install dependencies (one-time setup)
pixi install

# Run tests
pixi run test

# Generate coverage
pixi run coverage

# View coverage in browser
pixi run view-coverage
```

## Project Structure

```
cmake_prototype/
├── lib/                          # Shared library (single source of truth)
│   ├── servo_logic.h            # Header with function declarations
│   ├── servo_logic.cpp          # Implementation
│   └── CMakeLists.txt           # Library build configuration
├── test/                         # GoogleTest unit tests
│   ├── test_servo_logic.cpp     # Test suite (29 tests, 100% coverage)
│   └── CMakeLists.txt           # Test build configuration
├── arduino_sketch/               # Arduino sketches using library
│   └── example_sketch/
│       └── example_sketch.ino   # Example sketch (includes via ../../lib/)
├── build/                        # CMake build directory (gitignored)
├── coverage/                     # HTML coverage reports (gitignored)
├── CMakeLists.txt               # Root CMake configuration
├── pixi.toml                    # Build tasks and dependencies
├── sonar-project.properties     # SonarCloud configuration
└── .github/
    └── workflows/
        └── test-and-coverage.yml # CI/CD workflow
```

## Key Features

### 1. Zero Code Duplication
- Library code lives in `lib/` (single source of truth)
- Tests reference library via CMake linking
- Arduino sketches reference library via `#include "../../lib/header.h"`
- No copy/paste, no duplicate files

### 2. Industry-Standard CMake Structure
- Root CMakeLists.txt coordinates everything
- Subdirectories have their own CMakeLists.txt
- Clean separation of library, tests, and applications
- Scales to multiple libraries and sketches

### 3. Full Test Coverage
- GoogleTest unit tests with 100% coverage capability
- Coverage measured with gcov/gcovr (industry standard)
- Both XML (for SonarCloud) and HTML (for humans) reports
- Automatic coverage threshold checking in CI

### 4. Arduino Compatible
- Sketches work with arduino-cli
- Library included via relative path (no Arduino library installation needed)
- Compatible with Arduino IDE (with proper include paths)
- Hardware-agnostic library code

### 5. SonarCloud Ready
- Coverage reports in SonarQube XML format
- Automatic upload in CI/CD
- Quality gate enforcement
- Code quality analysis

## How It Works

### For Tests (CMake)

1. **CMake builds library** as static library (`lib/CMakeLists.txt`)
2. **Tests link against library** (`test/CMakeLists.txt`)
3. **Coverage enabled** via `--coverage` flags
4. **Tests run** and generate `.gcda` files
5. **gcovr processes** `.gcda` files into reports

### For Arduino (arduino-cli)

1. **Sketch includes** library headers via relative path: `#include "../../lib/servo_logic.h"`
2. **arduino-cli compiles** sketch + library together
3. **No library installation** needed (source is referenced directly)
4. **Works with any board** (Leonardo, Uno, ESP32, etc.)

## Usage

### Running Tests

```bash
# Run all tests
pixi run test

# Run tests quietly (less output)
pixi run test-quiet

# Rebuild everything and test
pixi run rebuild
pixi run test
```

### Generating Coverage

```bash
# Generate all coverage reports (XML + HTML + terminal)
pixi run coverage

# View HTML report in browser
pixi run view-coverage

# Terminal output shows:
# TOTAL: 100% coverage
```

### Arduino Compilation

```bash
# Compile Arduino sketch (requires arduino-cli)
pixi run arduino-compile

# Upload to Arduino (requires hardware connected)
pixi run arduino-upload
```

### Development Workflow

```bash
# 1. Make changes to lib/servo_logic.cpp
# 2. Update tests in test/test_servo_logic.cpp
# 3. Run tests
pixi run test

# 4. Generate coverage
pixi run coverage

# 5. View coverage
pixi run view-coverage

# 6. Test with Arduino sketch
pixi run arduino-compile
```

## Advantages Over Current Approach

### Current hatching_egg structure:
```
hatching_egg/
├── arduino/
│   ├── hatching_egg.ino      # Uses servo_kinematics.h
│   └── servo_kinematics.h
├── test/
│   ├── servo_kinematics.h    # DUPLICATE! Must be kept in sync
│   └── test_servo_kinematics.cpp
```

Problems:
- Duplicate header files (source in arduino/, copy in test/)
- Must manually keep files in sync
- Changes in arduino/ must be copied to test/
- Easy to get out of sync
- More files to manage

### CMake prototype structure:
```
cmake_prototype/
├── lib/
│   ├── servo_logic.h         # SINGLE SOURCE OF TRUTH
│   └── servo_logic.cpp
├── test/
│   └── test_servo_logic.cpp  # References lib/ via CMake
├── arduino_sketch/
    └── example_sketch.ino    # References lib/ via #include
```

Benefits:
- ✅ No duplicate files
- ✅ Single source of truth
- ✅ CMake handles dependencies automatically
- ✅ Clear separation of concerns
- ✅ Industry-standard structure
- ✅ Scales to multiple sketches
- ✅ Better IDE support (autocomplete, jump to definition)
- ✅ Easier to maintain

## Coverage Reports

### Terminal Output
```
GCC Code Coverage Report
Directory: ..
------------------------------------------------------------------------------
File                             Lines    Exec  Cover   Missing
------------------------------------------------------------------------------
lib/servo_logic.cpp                 30      30  100%
------------------------------------------------------------------------------
TOTAL                               30      30  100%
```

### HTML Report
- Open `coverage/index.html` in browser
- Shows line-by-line coverage
- Green = covered, Red = not covered
- Click files to see details

### SonarCloud
- Coverage uploaded automatically in CI
- Visible in SonarCloud dashboard
- Quality gate checks coverage threshold
- Historical tracking

## Testing Philosophy

### What We Test (lib/)
- Pure logic functions (angleToPWM, constrainAngle, interpolate)
- Timing calculations (isIntervalElapsed)
- Edge cases (negative angles, overflow, etc.)
- All code paths

### What We Don't Test (arduino_sketch/)
- Hardware I/O (servo.write, Serial.print)
- Arduino runtime (millis(), delay())
- Physical behavior (servo actually moves)

### Why This Works
- Library contains testable logic (pure functions)
- Arduino sketch contains hardware glue (thin layer)
- Separation enables 100% test coverage of logic
- Hardware tested manually or with integration tests

## CI/CD Integration

GitHub Actions workflow (`test-and-coverage.yml`) automatically:
1. Builds project with CMake
2. Runs all GoogleTest tests
3. Generates coverage reports (XML + HTML)
4. Uploads coverage to SonarCloud
5. Checks coverage threshold (fails if < 80%)
6. Uploads HTML report as artifact

## Migration Path

To migrate your hatching_egg project to this structure:

1. **Create lib/ directory**
   ```bash
   mkdir -p hatching_egg/lib
   ```

2. **Move headers to lib/**
   ```bash
   mv hatching_egg/arduino/servo_kinematics.h hatching_egg/lib/
   # Keep only .ino file in arduino/
   ```

3. **Update Arduino sketch includes**
   ```cpp
   // Change from:
   #include "servo_kinematics.h"

   // To:
   #include "../../lib/servo_kinematics.h"
   ```

4. **Create CMakeLists.txt files** (based on this prototype)

5. **Update tests to use CMake** (instead of raw g++)

6. **Update pixi.toml** to use CMake tasks

7. **Delete duplicate headers** in test/ directory

See [MIGRATION.md](docs/MIGRATION.md) for detailed step-by-step instructions.

## Adding More Libraries

To add another library (e.g., animation_controller):

1. **Create lib/animation_controller/**
   ```bash
   mkdir lib/animation_controller
   touch lib/animation_controller/animation_controller.h
   touch lib/animation_controller/animation_controller.cpp
   touch lib/animation_controller/CMakeLists.txt
   ```

2. **Update lib/animation_controller/CMakeLists.txt**
   ```cmake
   add_library(animation_controller STATIC
       animation_controller.cpp
   )
   target_include_directories(animation_controller PUBLIC
       ${CMAKE_CURRENT_SOURCE_DIR}
   )
   ```

3. **Update root CMakeLists.txt**
   ```cmake
   add_subdirectory(lib/servo_logic)
   add_subdirectory(lib/animation_controller)
   ```

4. **Create tests**
   ```bash
   touch test/test_animation_controller.cpp
   ```

5. **Update test/CMakeLists.txt**
   ```cmake
   target_link_libraries(tests
       servo_logic
       animation_controller
       GTest::gtest
       GTest::gtest_main
   )
   ```

## Troubleshooting

### Tests fail to build
- Ensure pixi environment is activated: `pixi install`
- Check CMake configuration: `pixi run configure`
- Verify GoogleTest is installed: `gtest --version`

### Coverage not generated
- Ensure tests ran successfully first
- Check build type is Debug: `CMAKE_BUILD_TYPE=Debug`
- Verify coverage flags in test/CMakeLists.txt

### Arduino sketch won't compile
- Check include path: `#include "../../lib/servo_logic.h"`
- Verify arduino-cli is installed: `arduino-cli version`
- Install Arduino platform: `arduino-cli core install arduino:avr`

### SonarCloud not showing coverage
- Verify coverage.xml was generated: `ls -la coverage.xml`
- Check sonar-project.properties has correct path
- Ensure SonarCloud token is set in GitHub secrets

## Resources

- [CMake Documentation](https://cmake.org/documentation/)
- [GoogleTest User's Guide](https://google.github.io/googletest/)
- [gcovr Documentation](https://gcovr.com/)
- [Arduino CLI Documentation](https://arduino.github.io/arduino-cli/)
- [SonarCloud Documentation](https://sonarcloud.io/documentation)

## License

This prototype is part of the Halloween animatronics project.

## Next Steps

1. Review this prototype
2. Understand the structure
3. Test it locally (`pixi run test`)
4. View coverage (`pixi run view-coverage`)
5. Decide if you want to migrate hatching_egg
6. Follow docs/MIGRATION.md if proceeding

---

**Key Takeaway:** This structure eliminates code duplication while maintaining Arduino compatibility and enabling 100% test coverage with industry-standard tools.
