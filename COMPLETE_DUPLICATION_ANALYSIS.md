# Complete Duplication Analysis: hatching_egg Project

**Date:** 2025-11-12
**Project:** /home/griswald/personal/halloween/hatching_egg

---

## 📊 DUPLICATION INVENTORY

### Duplicate Files Found

| Source of Truth | Duplicate Location | Status | MD5 Match |
|----------------|-------------------|---------|-----------|
| `arduino/servo_mapping.h` | `arduino/servo_tester/servo_mapping.h` | ✅ Identical | Yes |
| `arduino/servo_mapping.h` | `arduino/servo_sweep_test/servo_mapping.h` | ✅ Identical | Yes |
| `arduino/servo_tester_logic.h` | `arduino/servo_tester/servo_tester_logic.h` | ✅ Identical | Yes |
| `arduino/servo_sweep_test_logic.h` | `arduino/servo_sweep_test/servo_sweep_test_logic.h` | ⚠️ **DIFFERENT** | **No** |
| `arduino/animation_tester/animation_config.h` | `arduino/hatching_egg/animation_config.h` | ✅ Identical | Yes |

**Total Files:** 9 header files
**Duplicates:** 4 pairs (5 duplicate files)
**Problem Files:** 1 pair has diverged

---

## ⚠️ CRITICAL FINDING: Divergent Files

### servo_sweep_test_logic.h - DIFFERENT VERSIONS

**MD5 Checksums:**
```
d7ad54f98d1fd31ba8ef5d87b49a1541  arduino/servo_sweep_test_logic.h
0066e0d5107a2625bd2b72f138af07fa  arduino/servo_sweep_test/servo_sweep_test_logic.h
```

**Problem:** The two versions have diverged. This is exactly the maintenance issue that duplication causes!

**Impact:**
- ⚠️ Tests may be testing different code than what's deployed
- ⚠️ Bug fixes may be in one file but not the other
- ⚠️ SonarCloud sees both versions

**Action Required:**
1. Determine which version is correct
2. Diff the files to understand differences
3. Reconcile before creating symlinks

---

## 📋 DUPLICATION DETAILS

### Group 1: servo_mapping.h (3 copies)

**Source of Truth:** `arduino/servo_mapping.h` (3727 bytes)

**Duplicates:**
1. `arduino/servo_tester/servo_mapping.h` - ✅ Identical copy
2. `arduino/servo_sweep_test/servo_mapping.h` - ✅ Identical copy

**Used By:**
- Sketch: `arduino/servo_tester/servo_tester.ino`
- Sketch: `arduino/servo_sweep_test/servo_sweep_test.ino`
- Tests: `test_servo_mapping.cpp`
- Tests: `test_servo_tester.cpp`
- Tests: `test_servo_sweep.cpp`

**Symlink Plan:** ✅ Ready to implement

---

### Group 2: servo_tester_logic.h (2 copies)

**Source of Truth:** `arduino/servo_tester_logic.h`

**Duplicates:**
1. `arduino/servo_tester/servo_tester_logic.h` - ✅ Identical copy

**Used By:**
- Sketch: `arduino/servo_tester/servo_tester.ino`
- Tests: `test_servo_tester.cpp`

**Symlink Plan:** ✅ Ready to implement

---

### Group 3: servo_sweep_test_logic.h (2 copies) ⚠️

**Source of Truth:** `arduino/servo_sweep_test_logic.h` (?)

**Duplicates:**
1. `arduino/servo_sweep_test/servo_sweep_test_logic.h` - ⚠️ **DIFFERENT VERSION**

**Used By:**
- Sketch: `arduino/servo_sweep_test/servo_sweep_test.ino`
- Tests: `test_servo_sweep.cpp`

**Symlink Plan:** ⚠️ **BLOCKED** - Must reconcile differences first

**Next Steps:**
1. Run: `diff -u arduino/servo_sweep_test_logic.h arduino/servo_sweep_test/servo_sweep_test_logic.h`
2. Determine which version is correct (or merge changes)
3. Update source of truth
4. Then create symlink

---

### Group 4: animation_config.h (2 copies)

**Source of Truth:** `arduino/animation_tester/animation_config.h` (?)
OR `arduino/hatching_egg/animation_config.h` (?)

**Duplicates:**
1. Both are identical - need to determine which is canonical

**Used By:**
- Sketch: `arduino/animation_tester/animation_tester.ino`
- Sketch: `arduino/hatching_egg/hatching_egg.ino`
- Tests: (unknown - need to check)

**Question:** Which is the source of truth?
- Option A: `arduino/animation_config.h` (create new at top level)
- Option B: `arduino/animation_tester/animation_config.h` (use tester as source)
- Option C: `arduino/hatching_egg/animation_config.h` (use production as source)

**Symlink Plan:** ⏳ Need to decide on source of truth location

---

## 🎯 RECOMMENDED SYMLINK STRUCTURE

### Proposed Final Structure

```
hatching_egg/arduino/
├── servo_mapping.h                    # Source of truth (keep here)
├── servo_tester_logic.h               # Source of truth (keep here)
├── servo_sweep_test_logic.h           # Source of truth (reconcile first!)
├── animation_config.h                 # Source of truth (move here)
│
├── servo_tester/
│   ├── servo_tester.ino
│   ├── servo_mapping.h → ../servo_mapping.h  # Symlink
│   └── servo_tester_logic.h → ../servo_tester_logic.h  # Symlink
│
├── servo_sweep_test/
│   ├── servo_sweep_test.ino
│   ├── servo_mapping.h → ../servo_mapping.h  # Symlink
│   └── servo_sweep_test_logic.h → ../servo_sweep_test_logic.h  # Symlink
│
├── servo_tester/
│   ├── servo_tester.ino
│   └── animation_config.h → ../animation_config.h  # Symlink
│
└── hatching_egg/
    ├── hatching_egg.ino
    └── animation_config.h → ../animation_config.h  # Symlink
```

---

## 📝 IMPLEMENTATION CHECKLIST

### Pre-Implementation Tasks

- [ ] **CRITICAL:** Reconcile servo_sweep_test_logic.h differences
  - [ ] Diff the two versions
  - [ ] Determine correct version
  - [ ] Update source of truth
  - [ ] Run tests to verify

- [ ] Decide animation_config.h source of truth location
  - [ ] Check which sketches use it
  - [ ] Check if tests use it
  - [ ] Choose canonical location
  - [ ] Move file if needed

### Implementation Tasks (Order Matters)

#### Phase 1: servo_mapping.h (READY)
- [ ] Backup: `cp arduino/servo_tester/servo_mapping.h /tmp/backup1`
- [ ] Backup: `cp arduino/servo_sweep_test/servo_mapping.h /tmp/backup2`
- [ ] Create symlink: `cd arduino/servo_tester && rm servo_mapping.h && ln -s ../servo_mapping.h servo_mapping.h`
- [ ] Create symlink: `cd arduino/servo_sweep_test && rm servo_mapping.h && ln -s ../servo_mapping.h servo_mapping.h`
- [ ] Test: `pixi run test-servo-tester`
- [ ] Test: `pixi run test-servo-sweep`
- [ ] Compile: `arduino-cli compile arduino/servo_tester`
- [ ] Compile: `arduino-cli compile arduino/servo_sweep_test`
- [ ] Commit: "Replace servo_mapping.h duplicates with symlinks"

#### Phase 2: servo_tester_logic.h (READY)
- [ ] Backup: `cp arduino/servo_tester/servo_tester_logic.h /tmp/backup3`
- [ ] Create symlink: `cd arduino/servo_tester && rm servo_tester_logic.h && ln -s ../servo_tester_logic.h servo_tester_logic.h`
- [ ] Test: `pixi run test-servo-tester`
- [ ] Compile: `arduino-cli compile arduino/servo_tester`
- [ ] Commit: "Replace servo_tester_logic.h duplicate with symlink"

#### Phase 3: servo_sweep_test_logic.h (BLOCKED - FIX FIRST)
- [ ] **STOP:** Reconcile differences first!
- [ ] Review diff output
- [ ] Fix divergence
- [ ] Then proceed with symlink

#### Phase 4: animation_config.h (DECIDE FIRST)
- [ ] Determine source of truth location
- [ ] Create parent-level file if needed
- [ ] Create symlinks
- [ ] Test all affected sketches
- [ ] Commit changes

### Post-Implementation Tasks
- [ ] Update README.md with symlink documentation
- [ ] Run full test suite: `pixi run test`
- [ ] Run full coverage: `pixi run coverage`
- [ ] Verify SonarCloud analysis (after push)
- [ ] Document in CLAUDE.md

---

## 🔍 VERIFICATION COMMANDS

### Check Symlinks Created
```bash
cd /home/griswald/personal/halloween/hatching_egg
find arduino -type l -ls
```

### Verify Symlink Targets
```bash
cd /home/griswald/personal/halloween/hatching_egg
for link in $(find arduino -type l); do
    echo "Link: $link -> $(readlink $link)"
done
```

### Test All After Symlinks
```bash
pixi run test              # All 232 tests
pixi run coverage          # All coverage reports
```

### Verify Compilation
```bash
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/servo_tester
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/servo_sweep_test
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/animation_tester
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/hatching_egg
```

---

## 📊 IMPACT ANALYSIS

### Before Symlinks
- **Total header files:** 9
- **Unique headers:** 4
- **Duplicate files:** 5
- **Duplication ratio:** 56%
- **Maintenance risk:** HIGH (files already diverged)
- **SonarCloud issues:** Duplication warnings expected

### After Symlinks
- **Total header files:** 9 (4 real + 5 symlinks)
- **Unique headers:** 4
- **Duplicate files:** 0
- **Duplication ratio:** 0%
- **Maintenance risk:** NONE (single source of truth)
- **SonarCloud issues:** Should resolve

### Lines of Code Saved
- servo_mapping.h: ~110 lines × 2 duplicates = 220 lines
- servo_tester_logic.h: ~120 lines × 1 duplicate = 120 lines
- servo_sweep_test_logic.h: ~150 lines × 1 duplicate = 150 lines
- animation_config.h: ~50 lines × 1 duplicate = 50 lines

**Total duplicate code eliminated:** ~540 lines

---

## ⚠️ RISKS AND MITIGATIONS

### Risk 1: servo_sweep_test_logic.h Divergence
**Problem:** Files have different content
**Mitigation:**
- Diff and analyze before proceeding
- Determine correct version
- Run all tests after reconciliation

### Risk 2: animation_config.h Location
**Problem:** Unclear which file is canonical
**Mitigation:**
- Check git history to see which was modified more recently
- Check test files to see which they reference
- Document decision

### Risk 3: Windows Compatibility
**Problem:** Symlinks may not work on Windows without setup
**Mitigation:**
- GitHub Actions uses Linux (works fine)
- Document Windows Developer Mode requirement
- WSL2 as alternative for Windows developers

### Risk 4: Breaking Tests
**Problem:** Symlinks might break include paths
**Mitigation:**
- We already tested and verified this works
- Test after each symlink creation
- Keep backups until verified

---

## 🚀 NEXT ACTIONS

### Immediate (Before Symlinks)
1. **Analyze servo_sweep_test_logic.h differences** (CRITICAL)
   ```bash
   diff -u arduino/servo_sweep_test_logic.h arduino/servo_sweep_test/servo_sweep_test_logic.h
   ```

2. **Decide animation_config.h source of truth**
   ```bash
   git log --follow -- arduino/animation_tester/animation_config.h
   git log --follow -- arduino/hatching_egg/animation_config.h
   ```

### After Resolution
3. **Implement symlinks** (following checklist above)
4. **Test thoroughly**
5. **Commit changes**
6. **Update documentation**

---

## 📚 REFERENCES

- **Research Document:** `/home/griswald/personal/halloween/RESEARCH_NO_DUPLICATION_SOLUTIONS.md`
- **Quick Summary:** `/home/griswald/personal/halloween/SOLUTION_SUMMARY.md`
- **Test Results:** Verified 2025-11-12 - Symlinks work with arduino-cli and gtests

---

**Status:** Analysis complete - Ready for implementation after reconciliation
**Date:** 2025-11-12
**Analyst:** Project Manager AI
