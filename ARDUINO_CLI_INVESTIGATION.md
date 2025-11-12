# Arduino CLI Investigation - Parent Directory Includes

**Date:** 2025-11-12
**Status:** COMPLETE

## User Requirement

User wants to use **arduino-cli EXCLUSIVELY** (not PlatformIO).

## Key Questions Answered

### 1. What Build System Is Actually Used?

**Answer:** ✅ **arduino-cli ONLY**

**Evidence:**
- pixi.toml line 79: `upload = { cmd = "bash scripts/upload.sh", depends-on = ["test-before-upload", "generate-config"] }`
- All upload scripts use: `$ARDUINO_CLI compile --fqbn arduino:avr:leonardo`
- No platformio.ini found
- No PlatformIO references in any build scripts

**Conclusion:** Project is already using arduino-cli exclusively. CLAUDE.md reference to PlatformIO was outdated.

---

### 2. Can arduino-cli Use Parent Directory Includes (`#include "../header.h"`)?

**Answer:** ⚠️ **NO - But with a critical exception**

**General Rule:**
Arduino build system (including arduino-cli) does NOT support parent directory includes because:
- Arduino copies all sketch files to a temporary build directory
- This breaks `../` relative path references
- This is documented behavior across Arduino forums and Stack Overflow

**However:**
The compilation currently **SUCCEEDS** because of duplicate files.

---

### 3. What's Actually Happening?

**Current Structure:**
```
arduino/
├── servo_mapping.h                          # Parent version
├── servo_sweep_test_logic.h                 # Parent version (has #include "../servo_mapping.h")
├── servo_tester_logic.h                     # Parent version
├── servo_sweep_test/
│   ├── servo_sweep_test.ino
│   ├── servo_mapping.h                      # DUPLICATE - identical to parent
│   └── servo_sweep_test_logic.h             # DUPLICATE - local includes only
├── servo_tester/
│   ├── servo_tester.ino
│   ├── servo_mapping.h                      # DUPLICATE - DIFFERENT from parent!
│   └── servo_tester_logic.h                 # DUPLICATE
└── hatching_egg/
    └── (similar structure)
```

**What arduino-cli Actually Does:**

1. **Copies all files from sketch folder to temp directory:**
   ```
   /home/griswald/.cache/arduino/sketches/[HASH]/sketch/
   ├── servo_sweep_test.ino.cpp
   ├── servo_mapping.h                    # From servo_sweep_test/ folder
   └── servo_sweep_test_logic.h           # From servo_sweep_test/ folder
   ```

2. **Uses LOCAL copies, ignoring parent directory:**
   - Confirmed via `#line 1 "/home/griswald/personal/halloween/hatching_egg/arduino/servo_sweep_test/servo_mapping.h"` in cached file
   - The `#include "../servo_mapping.h"` in parent-level servo_sweep_test_logic.h is NEVER executed
   - Arduino uses the SKETCH-LOCAL servo_sweep_test_logic.h which has `#include "servo_mapping.h"`

3. **Result:** Compilation succeeds because each sketch folder has complete copies of all needed headers.

---

### 4. Are Duplicates NECESSARY for arduino-cli?

**Answer:** ✅ **YES - Duplicates are REQUIRED**

**Why:**
- arduino-cli ONLY processes files in the sketch folder
- Parent directory includes (`../`) do NOT work
- Each sketch must be self-contained
- Without duplicates, compilation would FAIL

**Evidence:**
- servo_sweep_test_logic.h (parent) has `#ifdef ARDUINO` with `#include "../servo_mapping.h"`
- servo_sweep_test_logic.h (sketch) has `#include "servo_mapping.h"`
- arduino-cli uses the SKETCH version, not the parent version

---

### 5. Duplicate Synchronization Status

**Critical Finding:** ⚠️ **DUPLICATES ARE OUT OF SYNC**

**Test:**
```bash
$ cmp arduino/servo_mapping.h arduino/servo_sweep_test/servo_mapping.h
Files are IDENTICAL ✅

$ cmp arduino/servo_mapping.h arduino/servo_tester/servo_mapping.h
Files DIFFER ❌ (differ at byte 30, line 2)
```

**Risk:**
- servo_tester/servo_mapping.h is using an OUTDATED version
- This could cause incorrect servo behavior
- Changes to parent version don't automatically propagate

---

## Recommendations

### Option A: Keep Duplicates (Arduino-CLI Compatible) ✅ RECOMMENDED

**Pros:**
- Works with arduino-cli (current system)
- Sketches are self-contained
- No special build configuration needed

**Cons:**
- File duplication (maintenance burden)
- Must keep copies synchronized

**Implementation:**
1. Keep duplicates in each sketch folder
2. Create sync script to update copies:
   ```bash
   #!/bin/bash
   # sync_headers.sh
   cp arduino/servo_mapping.h arduino/servo_sweep_test/
   cp arduino/servo_mapping.h arduino/servo_tester/
   cp arduino/servo_sweep_test_logic.h arduino/servo_sweep_test/
   cp arduino/servo_tester_logic.h arduino/servo_tester/
   ```
3. Run sync script before upload
4. Add SonarCloud exclusions:
   ```properties
   # Exclude sketch-local duplicates (source of truth is parent directory)
   sonar.exclusions=**/arduino/servo_sweep_test/servo_mapping.h,\
                    **/arduino/servo_tester/servo_mapping.h,\
                    **/arduino/servo_sweep_test/servo_sweep_test_logic.h,\
                    **/arduino/servo_tester/servo_tester_logic.h
   ```

### Option B: Arduino Library Structure

Convert shared headers to proper Arduino library:

**Structure:**
```
libraries/
└── HatchingEggLibrary/
    ├── src/
    │   ├── servo_mapping.h
    │   ├── servo_sweep_test_logic.h
    │   └── servo_tester_logic.h
    └── library.properties
```

**Pros:**
- Standard Arduino approach
- arduino-cli finds libraries automatically
- No duplicates needed

**Cons:**
- Requires restructuring
- More setup for new developers
- Library must be installed in Arduino libraries folder

### Option C: Symbolic Links (Linux Only)

**Not Recommended:**
- Breaks on Windows
- arduino-cli may not follow symlinks
- Adds complexity

---

## Current State: What Needs Fixing

### Immediate Actions Required:

1. **Synchronize duplicates:**
   ```bash
   cd /home/griswald/personal/halloween/hatching_egg
   # servo_tester/servo_mapping.h is OUTDATED
   cp arduino/servo_mapping.h arduino/servo_tester/servo_mapping.h
   ```

2. **Document which files are source of truth:**
   - Parent directory versions are canonical
   - Sketch-local versions are copies for arduino-cli

3. **Update CLAUDE.md:**
   - Remove PlatformIO references
   - Document arduino-cli exclusive usage
   - Explain duplicate file requirement
   - Add sync process

4. **Add SonarCloud exclusions:**
   - Exclude sketch-local duplicates from analysis
   - Keep only parent versions in SonarCloud metrics

5. **Create sync mechanism:**
   - Add sync script or pixi task
   - Run before upload
   - Verify files match

---

## Technical Details: Why Parent Includes Don't Work

### Arduino Build Process:

1. **Sketch Copy Phase:**
   ```
   Source:  arduino/servo_sweep_test/servo_sweep_test.ino
   Dest:    ~/.cache/arduino/sketches/[HASH]/sketch/servo_sweep_test.ino.cpp
   ```

2. **File Discovery:**
   - arduino-cli finds ALL .h and .cpp files in sketch folder
   - Copies them to temp directory
   - Sets include path to temp directory ONLY

3. **Include Resolution:**
   ```cpp
   #include "servo_mapping.h"      // Works - in same temp directory
   #include "../servo_mapping.h"   // Fails - parent not in temp directory
   ```

4. **Result:**
   - Only files in sketch folder are available
   - Parent directory does not exist in temp build location
   - `../` references fail to resolve

### Workaround Used:

The parent-level servo_sweep_test_logic.h has:
```cpp
#ifdef ARDUINO
#include "../servo_mapping.h"  // Would fail if used
#else
#include "servo_mapping.h"     // Used for local C++ tests
#endif
```

But arduino-cli uses the SKETCH-LOCAL servo_sweep_test_logic.h which just has:
```cpp
#include "servo_mapping.h"  // Works - both files in same sketch folder
```

---

## Verification Commands

```bash
# Check which build system is used
grep -E "platformio|arduino-cli" hatching_egg/pixi.toml

# Test arduino-cli compilation
cd hatching_egg
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo --config-file .arduino15/arduino-cli.yaml arduino/servo_sweep_test

# Check duplicate synchronization
cmp arduino/servo_mapping.h arduino/servo_sweep_test/servo_mapping.h
cmp arduino/servo_mapping.h arduino/servo_tester/servo_mapping.h

# See which files arduino-cli uses (check cached build)
ls -la ~/.cache/arduino/sketches/[HASH]/sketch/
```

---

## Conclusion

**For User:**

1. ✅ You ARE using arduino-cli exclusively (good news!)
2. ⚠️ Duplicates ARE necessary for arduino-cli to work
3. ❌ Parent directory includes (`../`) do NOT work with arduino-cli
4. 🔧 Duplicates are currently OUT OF SYNC and need fixing
5. 📋 Solution: Keep duplicates, add sync mechanism, exclude from SonarCloud

**Next Steps:**
1. Sync outdated servo_tester/servo_mapping.h
2. Add sync script to project
3. Update SonarCloud exclusions
4. Update CLAUDE.md documentation
5. Consider Arduino library structure for future

---

**References:**
- Arduino Forum: "include path to a parent folder" - NOT SUPPORTED
- arduino-cli GitHub Issues #3005 - Path resolution problems
- Stack Overflow: "Define a relative path to .h file" - Temp directory breaks paths
