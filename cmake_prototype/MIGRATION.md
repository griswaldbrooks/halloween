# Migration Guide: hatching_egg to CMake Structure

This guide shows step-by-step how to migrate the hatching_egg project from the current structure (with duplicate headers) to the new CMake-based structure (single source of truth).

## Current vs Target Structure

### Current Structure (hatching_egg)
```
hatching_egg/
├── arduino/
│   ├── hatching_egg.ino
│   ├── servo_kinematics.h           # ORIGINAL
│   ├── servo_constraints.h
│   └── ... other hardware files
├── test/
│   ├── servo_kinematics.h           # DUPLICATE (must be kept in sync)
│   ├── test_servo_kinematics.cpp
│   └── ... other test files
└── pixi.toml                        # Uses raw g++ for tests
```

### Target Structure (with CMake)
```
hatching_egg/
├── lib/                             # NEW: Single source of truth
│   ├── servo_kinematics/
│   │   ├── servo_kinematics.h      # MOVED from arduino/
│   │   ├── servo_kinematics.cpp    # NEW (extracted from .ino if needed)
│   │   └── CMakeLists.txt          # NEW
│   └── servo_constraints/
│       ├── servo_constraints.h
│       └── CMakeLists.txt
├── test/
│   ├── test_servo_kinematics.cpp   # Updated to use CMake linking
│   └── CMakeLists.txt              # NEW (replaces raw g++)
├── arduino/
│   └── hatching_egg.ino            # Updated includes: ../../lib/
├── CMakeLists.txt                   # NEW: Root configuration
└── pixi.toml                        # Updated to use CMake tasks
```

## Migration Steps

### Phase 1: Preparation (5 minutes)

1. **Backup current state**
   ```bash
   cd hatching_egg
   git checkout -b cmake-migration
   git add -A
   git commit -m "Backup before CMake migration"
   ```

2. **Verify current tests work**
   ```bash
   pixi run test-cpp
   # All tests should pass before migration
   ```

3. **Document current coverage**
   ```bash
   pixi run test-cpp-coverage
   # Note: Current coverage is 85.9%
   ```

### Phase 2: Create Library Structure (10 minutes)

1. **Create lib/ directory structure**
   ```bash
   cd hatching_egg
   mkdir -p lib/servo_kinematics
   mkdir -p lib/servo_constraints
   ```

2. **Move header files from arduino/ to lib/**
   ```bash
   # Move servo_kinematics
   cp arduino/servo_kinematics.h lib/servo_kinematics/

   # Move servo_constraints
   cp arduino/servo_constraints.h lib/servo_constraints/

   # Note: Keep original files for now (we'll delete after verification)
   ```

3. **Extract implementation if needed**

   If functions in headers have implementations, consider extracting to .cpp:

   ```bash
   # Example: If servo_kinematics.h has function implementations
   touch lib/servo_kinematics/servo_kinematics.cpp
   ```

   Then manually move implementations from .h to .cpp:
   ```cpp
   // lib/servo_kinematics/servo_kinematics.h
   #ifndef SERVO_KINEMATICS_H
   #define SERVO_KINEMATICS_H

   int calculateAngle(int position);  // Declaration only

   #endif
   ```

   ```cpp
   // lib/servo_kinematics/servo_kinematics.cpp
   #include "servo_kinematics.h"

   int calculateAngle(int position) {  // Implementation
       return position * 2;
   }
   ```

   **Note:** For header-only libraries (common in embedded), you can skip .cpp files.

### Phase 3: Create CMake Configuration (15 minutes)

1. **Create lib/servo_kinematics/CMakeLists.txt**
   ```cmake
   # Library CMakeLists.txt
   add_library(servo_kinematics INTERFACE)

   # For header-only library
   target_include_directories(servo_kinematics INTERFACE
       ${CMAKE_CURRENT_SOURCE_DIR}
   )

   # If you created .cpp file, use this instead:
   # add_library(servo_kinematics STATIC
   #     servo_kinematics.cpp
   # )
   # target_include_directories(servo_kinematics PUBLIC
   #     ${CMAKE_CURRENT_SOURCE_DIR}
   # )
   ```

2. **Create lib/servo_constraints/CMakeLists.txt**
   ```cmake
   add_library(servo_constraints INTERFACE)

   target_include_directories(servo_constraints INTERFACE
       ${CMAKE_CURRENT_SOURCE_DIR}
   )
   ```

3. **Create root CMakeLists.txt**
   ```cmake
   cmake_minimum_required(VERSION 3.14)
   project(HatchingEgg VERSION 1.0.0 LANGUAGES CXX)

   set(CMAKE_CXX_STANDARD 17)
   set(CMAKE_CXX_STANDARD_REQUIRED ON)

   option(BUILD_TESTS "Build tests" ON)

   # Add libraries
   add_subdirectory(lib/servo_kinematics)
   add_subdirectory(lib/servo_constraints)

   # Add tests
   if(BUILD_TESTS)
       enable_testing()
       add_subdirectory(test)
   endif()
   ```

4. **Create test/CMakeLists.txt**
   ```cmake
   find_package(GTest REQUIRED)

   # Collect all test files
   file(GLOB TEST_SOURCES test_*.cpp)

   # Create test executable
   add_executable(hatching_egg_tests ${TEST_SOURCES})

   # Link libraries
   target_link_libraries(hatching_egg_tests
       servo_kinematics
       servo_constraints
       GTest::gtest
       GTest::gtest_main
       gcov
   )

   # Enable coverage
   target_compile_options(hatching_egg_tests PRIVATE
       --coverage
       -fprofile-arcs
       -ftest-coverage
       -O0
       -g
   )

   target_link_options(hatching_egg_tests PRIVATE
       --coverage
   )

   # Register tests
   enable_testing()
   add_test(NAME hatching_egg_tests COMMAND hatching_egg_tests)
   ```

### Phase 4: Update Tests (10 minutes)

1. **Update test includes**

   In `test/test_servo_kinematics.cpp`:
   ```cpp
   // OLD:
   #include "servo_kinematics.h"

   // NEW (CMake handles this automatically via linking):
   #include "servo_kinematics.h"  // CMake finds it via target_include_directories
   ```

   **Note:** No path change needed! CMake handles include paths automatically when you link libraries.

2. **Remove duplicate headers in test/**
   ```bash
   # After verifying CMake tests work
   rm test/servo_kinematics.h
   rm test/servo_constraints.h
   ```

### Phase 5: Update Arduino Sketch (5 minutes)

1. **Update hatching_egg.ino includes**
   ```cpp
   // OLD:
   #include "servo_kinematics.h"
   #include "servo_constraints.h"

   // NEW:
   #include "../../lib/servo_kinematics/servo_kinematics.h"
   #include "../../lib/servo_constraints/servo_constraints.h"
   ```

2. **Test Arduino compilation**
   ```bash
   # If you have arduino-cli installed
   arduino-cli compile --fqbn arduino:avr:leonardo arduino/hatching_egg.ino

   # Or use PlatformIO (current method)
   pixi run upload  # Will fail if includes are wrong
   ```

### Phase 6: Update Pixi Tasks (10 minutes)

1. **Update pixi.toml**

   Replace the current test tasks with CMake-based ones:

   ```toml
   [tasks]
   # OLD (remove these):
   # test-cpp = "bash run_tests.sh"
   # test-cpp-coverage = "bash run_coverage.sh"

   # NEW (add these):
   configure = "cmake -B build -S . -DCMAKE_BUILD_TYPE=Debug"
   build = { cmd = "cmake --build build", depends-on = ["configure"] }
   test = { cmd = "cd build && ctest --output-on-failure", depends-on = ["build"] }

   coverage-xml = { cmd = "cd build && gcovr --sonarqube ../coverage.xml --root .. --filter '../lib/.*'", depends-on = ["test"] }
   coverage-html = { cmd = "cd build && gcovr --html-details ../coverage/index.html --root .. --filter '../lib/.*'", depends-on = ["test"] }
   coverage = { depends-on = ["coverage-xml", "coverage-html"] }
   view-coverage = "xdg-open coverage/index.html"

   clean = "rm -rf build coverage coverage.xml"
   ```

2. **Add CMake to dependencies**
   ```toml
   [dependencies]
   cmake = ">=3.14"
   gtest = "*"
   gcovr = "*"
   ninja = "*"
   # ... keep existing dependencies
   ```

### Phase 7: Test Everything (15 minutes)

1. **Install updated dependencies**
   ```bash
   pixi install
   ```

2. **Run CMake tests**
   ```bash
   pixi run test
   # Should see: All tests passed
   ```

3. **Generate coverage**
   ```bash
   pixi run coverage
   pixi run view-coverage
   # Should see: Same or better coverage than before (85.9%+)
   ```

4. **Test Arduino compilation**
   ```bash
   pixi run upload
   # Should compile and upload successfully
   ```

5. **Compare with original**
   ```bash
   # Old way (if scripts still exist)
   bash run_tests.sh

   # New way
   pixi run test

   # Both should show same test results
   ```

### Phase 8: Cleanup and Finalize (5 minutes)

1. **Remove duplicate files**
   ```bash
   # Delete test/ duplicates (already done in Phase 4)
   # Delete old scripts (optional)
   # rm run_tests.sh run_coverage.sh
   ```

2. **Remove original headers from arduino/ (if appropriate)**

   **IMPORTANT:** Only do this if:
   - Headers are pure logic (no Arduino-specific code)
   - You're comfortable with the new structure

   If keeping backward compatibility, you can create symlinks:
   ```bash
   cd arduino
   ln -s ../lib/servo_kinematics/servo_kinematics.h servo_kinematics.h
   ```

3. **Update .gitignore**
   ```bash
   echo "build/" >> .gitignore
   echo "coverage/" >> .gitignore
   echo "coverage.xml" >> .gitignore
   ```

4. **Update documentation**
   - Update README.md with new build instructions
   - Update CLAUDE.md with CMake approach
   - Note coverage is now CMake-based

### Phase 9: Update CI/CD (10 minutes)

1. **Update .github/workflows/test.yml** (or similar)

   Replace the test steps with:
   ```yaml
   - name: Run tests
     run: |
       cd hatching_egg
       pixi run test

   - name: Generate coverage
     run: |
       cd hatching_egg
       pixi run coverage

   - name: Upload to SonarCloud
     # ... existing SonarCloud step ...
   ```

2. **Update sonar-project.properties**
   ```properties
   # Update source locations
   sonar.sources=lib

   # Update coverage path
   sonar.coverageReportPaths=coverage.xml

   # Update exclusions
   sonar.exclusions=build/**,arduino/**
   ```

### Phase 10: Commit and Verify (5 minutes)

1. **Commit migration**
   ```bash
   git add -A
   git commit -m "Migrate to CMake structure: eliminate duplicate headers

   - Move headers to lib/ (single source of truth)
   - Add CMakeLists.txt for library and tests
   - Update pixi tasks to use CMake
   - Update Arduino sketch includes
   - Remove duplicate test/ headers
   - Coverage: 85.9% (maintained)
   "
   ```

2. **Push and verify CI**
   ```bash
   git push origin cmake-migration
   # Watch GitHub Actions - should pass
   ```

3. **Verify SonarCloud**
   - Check SonarCloud dashboard
   - Coverage should still show 85.9%+
   - No duplicate code warnings

## Rollback Plan

If something goes wrong:

```bash
# Return to original state
git checkout main
git branch -D cmake-migration

# Or fix issues and continue
git checkout cmake-migration
# Fix issues...
git add -A
git commit -m "Fix: [describe fix]"
```

## Verification Checklist

After migration, verify:

- ✅ All GoogleTest tests pass
- ✅ Coverage is same or better (85.9%+)
- ✅ Arduino sketch compiles
- ✅ Arduino sketch uploads to hardware
- ✅ Hardware functions correctly
- ✅ No duplicate files remain
- ✅ CI/CD passes
- ✅ SonarCloud shows coverage

## Common Issues and Solutions

### Issue: Tests don't find headers
**Solution:** Check CMakeLists.txt has `target_include_directories` and tests link the library

### Issue: Arduino sketch won't compile
**Solution:** Check include paths are correct: `../../lib/library_name/header.h`

### Issue: Coverage is lower than before
**Solution:** Check gcovr filter paths in pixi.toml: `--filter '../lib/.*'`

### Issue: CMake can't find GoogleTest
**Solution:** Ensure pixi environment is active: `pixi install`

### Issue: Old test scripts still being called
**Solution:** Update pixi.toml to use new tasks, remove old script files

## Post-Migration Benefits

After migration, you'll have:

1. ✅ **No duplicate files** - Single source of truth in lib/
2. ✅ **Industry-standard structure** - CMake is widely used
3. ✅ **Better IDE support** - Autocomplete, go-to-definition works
4. ✅ **Easier to maintain** - Changes in one place only
5. ✅ **Scales better** - Easy to add more libraries
6. ✅ **Same coverage** - No loss of test quality
7. ✅ **Same functionality** - Arduino sketch still works

## Timeline

Total estimated time: **90 minutes** (with testing and verification)

- Phase 1: Preparation (5 min)
- Phase 2: Create library structure (10 min)
- Phase 3: Create CMake files (15 min)
- Phase 4: Update tests (10 min)
- Phase 5: Update Arduino sketch (5 min)
- Phase 6: Update Pixi tasks (10 min)
- Phase 7: Test everything (15 min)
- Phase 8: Cleanup (5 min)
- Phase 9: Update CI/CD (10 min)
- Phase 10: Commit and verify (5 min)

## Questions?

If you encounter issues during migration:

1. Check the cmake_prototype/ for reference implementation
2. Review error messages carefully (CMake errors are usually clear)
3. Test incrementally (don't change everything at once)
4. Keep the original branch until fully verified

---

**Remember:** The goal is to eliminate duplicate headers while maintaining all functionality and test coverage. Take your time and verify each phase before proceeding.
