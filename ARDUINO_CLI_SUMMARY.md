# Arduino CLI Investigation - Executive Summary

**Date:** 2025-11-12
**Investigator:** PM Agent

---

## Bottom Line

✅ **You ARE using arduino-cli exclusively** (no PlatformIO)
⚠️ **Duplicates ARE necessary** for arduino-cli to work
❌ **Parent directory includes (`../`) do NOT work** with arduino-cli
🔧 **2 files are OUT OF SYNC** and need fixing

---

## What I Found

### 1. Build System: arduino-cli Only ✅

Your project uses arduino-cli exclusively:
- `pixi.toml` uses arduino-cli for all uploads
- No platformio.ini exists
- CLAUDE.md had outdated PlatformIO reference (oversight)

**Action:** None needed - already correct

---

### 2. Parent Includes: Don't Work ❌

Arduino-cli (and all Arduino build systems) **CANNOT** use parent directory includes like `#include "../header.h"`.

**Why:**
- arduino-cli copies sketch files to temporary build directory
- Parent directory doesn't exist in temp location
- `../` references fail to resolve

**Evidence:**
- Build cache shows: `/home/griswald/.cache/arduino/sketches/[HASH]/sketch/`
- Only sketch-local files are copied
- Confirmed by `#line` directives pointing to sketch folder, not parent

**Sources:**
- Arduino Forum: "include path to a parent folder" - NOT SUPPORTED
- Stack Overflow: Multiple confirmations this doesn't work
- arduino-cli GitHub issues about path resolution

---

### 3. Why Compilation Works: Hidden Duplicates ✅

Compilation succeeds because each sketch folder has COMPLETE COPIES of all headers:

```
arduino/
├── servo_mapping.h                    # Source of truth (parent)
├── servo_sweep_test_logic.h           # Source of truth (parent)
├── servo_tester_logic.h               # Source of truth (parent)
├── servo_sweep_test/
│   ├── servo_mapping.h                # Copy for arduino-cli
│   └── servo_sweep_test_logic.h       # Copy for arduino-cli
├── servo_tester/
│   ├── servo_mapping.h                # Copy for arduino-cli
│   └── servo_tester_logic.h           # Copy for arduino-cli
└── hatching_egg/
    └── animation_config.h             # (doesn't need servo headers)
```

**What arduino-cli sees:**
- Only files IN the sketch folder
- Uses local copies, ignores parent
- No `../` includes needed because everything is local

---

### 4. Synchronization Status: BROKEN ❌

**Current State:**

| File | servo_tester | servo_sweep_test | hatching_egg |
|------|--------------|------------------|--------------|
| servo_mapping.h | ❌ OUT OF SYNC | ✅ Synced | N/A |
| servo_tester_logic.h | ✅ Synced | N/A | N/A |
| servo_sweep_test_logic.h | N/A | ❌ OUT OF SYNC | N/A |

**Critical Issue:**
- `servo_tester/servo_mapping.h` is using OLD version (0-180° range)
- Parent version has NEW calibrated per-servo ranges (0-90°)
- This is a **functional bug** - servo_tester will use wrong PWM ranges

**Differences:**
```diff
Old (servo_tester):
- Simple 0-180° range
- Single PWM range for all servos
- Generic mapping

New (parent):
- Per-servo calibrated ranges (0-90°)
- Each servo has unique PWM min/max
- Supports inverted servos (left leg)
- Hardware-tested safe ranges
```

---

## Required Actions

### IMMEDIATE: Fix Out-of-Sync Files

⚠️ **IMPORTANT FINDING:** Only `servo_mapping.h` needs syncing!

**Discovery:**
- Parent `servo_sweep_test_logic.h` has `#ifdef ARDUINO` with `#include "../servo_mapping.h"` (for local C++ tests)
- Sketch `servo_sweep_test_logic.h` has plain `#include "servo_mapping.h"` (for arduino-cli)
- These are INTENTIONALLY DIFFERENT - parent is for testing, sketch is for hardware
- Sync script should NOT copy logic headers (they're architecture-specific)

**Only sync data headers:**

```bash
cd /home/griswald/personal/halloween/hatching_egg

# Fix servo_tester (CRITICAL - functional bug)
cp arduino/servo_mapping.h arduino/servo_tester/servo_mapping.h
cp arduino/servo_mapping.h arduino/servo_sweep_test/servo_mapping.h
```

---

### RECOMMENDED: Add Sync Mechanism

**Create sync script:** `hatching_egg/scripts/sync_headers.sh`

```bash
#!/bin/bash
# Sync shared headers to sketch folders for arduino-cli

set -e

echo "Syncing shared headers..."

# servo_mapping.h
cp arduino/servo_mapping.h arduino/servo_tester/servo_mapping.h
cp arduino/servo_mapping.h arduino/servo_sweep_test/servo_mapping.h

# servo_tester_logic.h
cp arduino/servo_tester_logic.h arduino/servo_tester/servo_tester_logic.h

# servo_sweep_test_logic.h
cp arduino/servo_sweep_test_logic.h arduino/servo_sweep_test/servo_sweep_test_logic.h

echo "✅ Headers synced"
```

**Add to pixi.toml:**
```toml
sync-headers = "bash scripts/sync_headers.sh"
upload = { cmd = "bash scripts/upload.sh", depends-on = ["test-before-upload", "generate-config", "sync-headers"] }
```

---

### RECOMMENDED: SonarCloud Exclusions

Add to `sonar-project.properties`:

```properties
# Exclude sketch-local header copies (source of truth is parent directory)
# These are required for arduino-cli but shouldn't be analyzed by SonarCloud
sonar.exclusions=**/arduino/servo_tester/servo_mapping.h,\
                 **/arduino/servo_tester/servo_tester_logic.h,\
                 **/arduino/servo_sweep_test/servo_mapping.h,\
                 **/arduino/servo_sweep_test/servo_sweep_test_logic.h
```

**Why:**
- Prevents duplicate code detection
- Keeps coverage metrics accurate
- Only analyzes parent versions (source of truth)

---

### RECOMMENDED: Update Documentation

**CLAUDE.md changes:**

1. Remove PlatformIO references
2. Add section on arduino-cli requirements:
   ```markdown
   ## Arduino CLI Constraints

   **Parent includes don't work:** Arduino sketches CANNOT use `#include "../header.h"`

   **Solution:** Each sketch folder contains copies of shared headers.

   **Source of truth:** Parent `arduino/` directory versions

   **Sync process:** Run `pixi run sync-headers` before upload
   ```

3. Document which files are duplicated and why

---

## Alternative: Arduino Library Structure

**If you want to eliminate duplicates entirely**, convert to Arduino library:

```
libraries/
└── HatchingEggLibrary/
    ├── library.properties
    └── src/
        ├── servo_mapping.h
        ├── servo_tester_logic.h
        └── servo_sweep_test_logic.h
```

**Pros:**
- No duplicates
- Standard Arduino pattern
- arduino-cli finds automatically

**Cons:**
- Requires restructuring
- Library must be installed
- More complex setup

**Recommendation:** Keep current approach with sync mechanism. It works well and is simpler.

---

## Why This Matters

### Without Sync:

1. Developer updates `arduino/servo_mapping.h`
2. Forgets to copy to sketches
3. arduino-cli uses OLD cached copy
4. Hardware gets wrong PWM values
5. Servo collisions or erratic behavior

### With Sync:

1. Developer updates `arduino/servo_mapping.h`
2. `pixi run upload` auto-syncs before compile
3. arduino-cli uses current version
4. Hardware works correctly

---

## Technical Deep Dive

See `/home/griswald/personal/halloween/ARDUINO_CLI_INVESTIGATION.md` for:
- Complete technical analysis
- arduino-cli build process details
- Build cache inspection results
- Web research findings
- Alternative solutions comparison

---

## Summary

| Question | Answer |
|----------|--------|
| Using arduino-cli? | ✅ Yes, exclusively |
| Parent includes work? | ❌ No, never will |
| Duplicates necessary? | ✅ Yes, required |
| Duplicates in sync? | ❌ No, 2 files outdated |
| Fix complexity? | ✅ Simple: copy files + add sync |
| Alternative? | Arduino library (more complex) |

**Next Steps:**
1. ✅ Sync outdated files (CRITICAL)
2. ✅ Add sync script
3. ✅ Update pixi.toml to run sync before upload
4. ✅ Add SonarCloud exclusions
5. ✅ Update CLAUDE.md

---

**Files Generated:**
- `/home/griswald/personal/halloween/ARDUINO_CLI_SUMMARY.md` (this file)
- `/home/griswald/personal/halloween/ARDUINO_CLI_INVESTIGATION.md` (technical details)
