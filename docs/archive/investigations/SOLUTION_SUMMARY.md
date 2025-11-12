# Quick Solution Summary: Eliminate Code Duplication

**Problem:** Duplicate headers (servo_mapping.h) in 3 locations
**Goal:** Single source of truth, keep gtests, use arduino-cli, fix SonarCloud

---

## 🏆 TOP 3 RECOMMENDATIONS

### 🥇 #1: SYMLINKS (50/50 points) - ⭐ RECOMMENDED

**What:** Replace duplicate files with symbolic links

```bash
cd arduino/servo_tester
rm servo_mapping.h
ln -s ../servo_mapping.h servo_mapping.h
```

**Why this wins:**
- ✅ **TESTED AND VERIFIED** - Works with arduino-cli and gtests
- ✅ Zero code changes needed
- ✅ Zero maintenance burden
- ✅ Fixes SonarCloud duplication
- ✅ 10-minute implementation

**Status:** Proven working on 2025-11-12

---

### 🥈 #2: CMAKE-BASED TESTS (44/50 points)

**What:** Use CMake for test builds, arduino-cli for hardware

**Why consider:**
- ✅ Industry standard
- ✅ Better for large projects
- ✅ Clean separation

**Why not first choice:**
- ⚠️ Adds complexity (2 build systems)
- ⚠️ More changes required
- ⚠️ Team needs CMake knowledge

---

### 🥉 #3: ARDUINO LIBRARY STRUCTURE (40/50 points)

**What:** Convert to formal Arduino library

```
libraries/HatchingEggCommon/
  library.properties
  src/servo_mapping.h
```

**Why consider:**
- ✅ Proper Arduino convention
- ✅ Reusable across projects
- ✅ Clean structure

**Why not first choice:**
- ⚠️ Requires code changes (.ino files, tests)
- ⚠️ More complex setup
- ⚠️ library.properties maintenance

---

## ❌ NOT RECOMMENDED

- **Build-time copying** (32/50) - Doesn't fix SonarCloud
- **Preprocessor tricks** (34/50) - Too complex
- **--build-property flags** (22/50) - Doesn't solve problem
- **sketch.yaml config** - Not supported by Arduino

---

## 📊 SCORING BREAKDOWN

| Approach | No Dup | Gtests | arduino-cli | SonarCloud | Maintenance | **Total** |
|----------|--------|--------|-------------|------------|-------------|-----------|
| **Symlinks** | 10 | 10 | 10 | 10 | 10 | **50** ⭐ |
| CMake | 10 | 9 | 10 | 9 | 6 | **44** |
| Library | 10 | 7 | 9 | 8 | 6 | **40** |
| Build-time | 3 | 10 | 10 | 2 | 7 | **32** |
| Preprocessor | 10 | 6 | 6 | 9 | 3 | **34** |
| --build-property | 2 | 8 | 6 | 2 | 4 | **22** |

---

## ✅ IMPLEMENTATION: Symlinks (10 minutes)

### Step 1: Create symlinks (3 min)
```bash
cd /home/griswald/personal/halloween/hatching_egg

# servo_tester
cd arduino/servo_tester
rm servo_mapping.h
ln -s ../servo_mapping.h servo_mapping.h

# servo_sweep_test
cd ../servo_sweep_test
rm servo_mapping.h
ln -s ../servo_mapping.h servo_mapping.h

# Verify
cd ..
ls -la */servo_mapping.h
```

### Step 2: Test (5 min)
```bash
# Tests
pixi run test-servo-tester  # Should see: [PASSED] 34 tests
pixi run test-servo-sweep   # Should see: [PASSED] 93 tests

# Compilation
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/servo_tester
.pixi/bin/arduino-cli compile --fqbn arduino:avr:leonardo arduino/servo_sweep_test
```

### Step 3: Commit (2 min)
```bash
git add arduino/servo_tester/servo_mapping.h
git add arduino/servo_sweep_test/servo_mapping.h
git commit -m "Replace duplicate servo_mapping.h with symlinks

- Eliminates code duplication
- Single source of truth: arduino/servo_mapping.h
- Tests verified: All pass
- Compilation verified: Both sketches compile
- Fixes SonarCloud duplication warnings"
```

---

## 🔬 TEST EVIDENCE

**Date:** 2025-11-12

**Arduino Compilation:**
```
✅ Sketch uses 10714 bytes (37%) of program storage space
✅ Global variables use 454 bytes (17%) of dynamic memory
```

**GoogleTest:**
```
✅ [==========] 34 tests from 8 test suites ran.
✅ [  PASSED  ] 34 tests.
```

**Both work perfectly with symlinks.**

---

## 🌐 CROSS-PLATFORM NOTES

- **Linux:** ✅ Full support
- **macOS:** ✅ Full support
- **Windows:** ⚠️ Requires Developer Mode or WSL2
- **GitHub Actions:** ✅ Full support (Ubuntu runners)

---

## 📚 SEE ALSO

- **Full Research:** `/home/griswald/personal/halloween/RESEARCH_NO_DUPLICATION_SOLUTIONS.md`
- **10 approaches analyzed**
- **Test results included**
- **Implementation guides**

---

**Recommendation:** Use symlinks. It's proven, simple, and solves all requirements.
