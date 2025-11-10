# Phases 5-6 Implementation Guide

**Created:** 2025-11-09
**Purpose:** Step-by-step guide for completing spider_crawl_projection refactoring Phases 5-6
**Current Status:** Phase 4 complete (94.65% coverage), ready for Phase 5

---

## Quick Status

- ✅ **Phase 1 Complete:** config-defaults.js, foot-positions.js (31.9% coverage)
- ✅ **Phase 2 Complete:** animation-math.js (41.1% coverage)
- ✅ **Phase 3 Complete:** gait-state-machine.js, hopping-logic.js (94.92% coverage)
- ✅ **Phase 4 Complete:** config-validators.js (94.65% coverage)
- ⏳ **Phase 5 Pending:** 6 sub-phases (5A-5F) - Advanced extractions
- ⏳ **Phase 6 Pending:** Integration tests with jsdom

**Coverage Goal:** 80% (ALREADY EXCEEDED at 94.65%)
**Remaining Work:** Code quality improvements (optional)

---

## Phase 5A: Leg State Calculator (HIGHEST PRIORITY)

### What to Extract
**File:** `leg-state-calculator.js` (72 lines from spider-animation.js)
**Source:** Lines 360-431 in spider-animation.js (`updateLegHopping` method)
**Complexity:** MEDIUM-HIGH
**Value:** HIGH - Complex hopping logic worth isolating

### Functions to Create

```javascript
// leg-state-calculator.js

/**
 * Calculate target leg position during hopping based on phase
 * Returns multiplier and smoothing factor for each hop phase
 */
function calculateLegHopState(hopPhase, legIndex, relativePos, bodyX, bodyY, bodySize) {
    const scale = bodySize / 100;
    const isBackLeg = legIndex >= 4;

    // Phase configurations
    const phaseConfigs = {
        0: { backFactor: 0.8, frontFactor: 0.8, smoothing: 0.3 },     // CROUCH
        1: { backFactor: 1.2, frontFactor: 0.5, smoothing: 0.5 },     // TAKEOFF
        2: { backFactor: 0.4, frontFactor: 0.4, smoothing: 1.0 },     // FLIGHT
        3: { backFactor: 0.9, frontFactor: 1.1, smoothing: isBackLeg ? 0.4 : 0.6 }, // LANDING
        4: { backFactor: 1.0, frontFactor: 1.0, smoothing: 0.2 }      // PAUSE
    };

    const config = phaseConfigs[hopPhase] || phaseConfigs[4];
    const factor = isBackLeg ? config.backFactor : config.frontFactor;

    return {
        targetX: bodyX + relativePos.x * scale * factor,
        targetY: bodyY + relativePos.y * scale * factor,
        smoothing: config.smoothing,
        isBackLeg,
        phase: hopPhase
    };
}

/**
 * Apply smoothing to leg position transitions
 */
function applyLegSmoothing(currentX, currentY, targetX, targetY, smoothing) {
    return {
        x: currentX + (targetX - currentX) * smoothing,
        y: currentY + (targetY - currentY) * smoothing
    };
}

/**
 * Get all hop phase configurations
 */
function getHopPhaseConfig(hopPhase) {
    const configs = {
        0: { name: 'CROUCH', backFactor: 0.8, frontFactor: 0.8, smoothing: 0.3 },
        1: { name: 'TAKEOFF', backFactor: 1.2, frontFactor: 0.5, smoothing: 0.5 },
        2: { name: 'FLIGHT', backFactor: 0.4, frontFactor: 0.4, smoothing: 1.0 },
        3: { name: 'LANDING', backFactor: 0.9, frontFactor: 1.1, smoothing: 0.6 },
        4: { name: 'PAUSE', backFactor: 1.0, frontFactor: 1.0, smoothing: 0.2 }
    };
    return configs[hopPhase] || configs[4];
}

// Browser export pattern (same as Phases 1-4)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateLegHopState, applyLegSmoothing, getHopPhaseConfig };
}

if (typeof window !== 'undefined') {
    window.LegStateCalculator = { calculateLegHopState, applyLegSmoothing, getHopPhaseConfig };
}
```

### Tests to Create (20 tests)

```javascript
// test-leg-state-calculator.js

describe('LegStateCalculator - calculateLegHopState', () => {
    test('CROUCH phase: legs draw in (0.8x)');
    test('CROUCH phase: front and back legs same');
    test('CROUCH phase: smoothing is 0.3');

    test('TAKEOFF phase: back legs extend (1.2x)');
    test('TAKEOFF phase: front legs retract (0.5x)');
    test('TAKEOFF phase: smoothing is 0.5');

    test('FLIGHT phase: all legs tucked (0.4x)');
    test('FLIGHT phase: instant smoothing (1.0)');

    test('LANDING phase: front extend (1.1x)');
    test('LANDING phase: back prepare (0.9x)');
    test('LANDING phase: back legs smooth 0.4, front smooth 0.6');

    test('PAUSE phase: normal stance (1.0x)');
    test('PAUSE phase: smoothing is 0.2');

    test('calculates correct target position');
    test('scales with body size correctly');
    test('identifies back legs (index >= 4)');
    test('identifies front legs (index < 4)');
    test('handles invalid hop phase gracefully');
});

describe('LegStateCalculator - applyLegSmoothing', () => {
    test('interpolates from current to target');
    test('respects smoothing factor');
});
```

### Integration Steps
1. Create leg-state-calculator.js
2. Create test-leg-state-calculator.js with 20+ tests
3. Run tests: `pixi run test`
4. Add to run-all-tests.sh
5. Update spider-animation.js line 360-431 to use `window.LegStateCalculator.calculateLegHopState()`
6. Add browser export test in test-browser-exports.js
7. Verify browser animation works
8. Run coverage: `pixi run coverage`

---

## Phase 5B: Boundary Utils (LOWER PRIORITY)

**File:** `boundary-utils.js` (25 lines)
**Source:** Lines 181-205 in spider-animation.js
**Value:** MEDIUM - Simple utility functions

### Functions
- `handleVerticalBoundary(y, vy, canvasHeight)` - Bounce at top/bottom
- `handleHorizontalWrap(x, canvasWidth, threshold)` - Wrap at right edge
- `randomYPosition(canvasHeight)` - Random Y coordinate

### Tests (~12)
- Vertical bounce at top/bottom
- No bounce when in bounds
- Horizontal wrap when past edge
- No wrap when in bounds
- Random Y in valid range

---

## Phase 5C: Spider Factory (HIGH PRIORITY)

**File:** `spider-factory.js` (71 lines from Spider.reset method)
**Source:** Lines 95-165 in spider-animation.js
**Value:** HIGH - Complex initialization logic

### Functions
- `calculateSpeedMultiplier(baseSpeed, speedVariation)`
- `calculateBodySize(sizeMin, sizeMax, sizeVariation)`
- `assignLegGroups(legCount)`
- `getElbowBiasPattern(legCount)`
- `createInitialSpiderState(index, config, canvasHeight)`

### Tests (~25)
- Speed multiplier with 0 variation = base
- Speed multiplier with 1.0 variation spans range
- Body size calculations
- Leg group assignments (A/B for tetrapod)
- Elbow bias pattern
- Initial state creation

---

## Phase 5D: Position Utils (LOWER PRIORITY)

**File:** `position-utils.js` (13 lines)
**Source:** Lines 167-179 in spider-animation.js
**Value:** LOW - Simple utility

### Function
- `initializeLegWorldPositions(spiderX, spiderY, bodySize, legCount)`

### Tests (~8)
- Initializes 8 positions
- Scales correctly
- Positions relative to spider X/Y

---

## Phase 5E: Mode Controller (LOWER PRIORITY)

**File:** `mode-controller.js` (13 lines)
**Source:** Lines 652-664 in spider-animation.js
**Value:** LOW - Simple UI logic

### Functions
- `shouldShowHoppingControls(animationMode)`
- `getAvailableModes()`
- `validateMode(mode)`

### Tests (~6)
- Shows controls in hopping mode
- Lists available modes
- Validates modes

---

## Phase 5F: Keyboard Controller (LOWER PRIORITY)

**File:** `keyboard-controller.js` (19 lines)
**Source:** Lines 711-729 in spider-animation.js
**Value:** LOW - Simple mapping

### Functions
- `KEYBOARD_ACTIONS` constant
- `getKeyboardAction(key)`
- `getAllShortcuts()`

### Tests (~8)
- Maps keys to actions
- Case insensitive
- Lists all shortcuts

---

## Phase 6: Integration Tests (OPTIONAL)

**File:** `test-spider-animation-integration.js`
**Purpose:** Test DOM/canvas integration with jsdom mocks
**Value:** MEDIUM - Catches integration bugs

### Tests to Add (~15)
- Canvas resizing updates dimensions
- resetSpiders creates correct count
- toggleControls toggles CSS class
- Spider.draw calls canvas methods
- Spider.drawLeg draws two segments
- FPS tracking updates
- Animation loop structure

### Implementation
```javascript
const { JSDOM } = require('jsdom');

class MockCanvasContext {
    constructor() {
        this.calls = [];
    }
    save() { this.calls.push(['save']); }
    restore() { this.calls.push(['restore']); }
    translate(x, y) { this.calls.push(['translate', x, y]); }
    // ... more canvas methods
}

describe('Spider Animation Integration', () => {
    test('resizeCanvas updates canvas dimensions');
    test('resetSpiders creates spiders array');
    // ... more tests
});
```

---

## Recommended Implementation Order

### Option 1: Quality-Focused (Full Implementation)
1. **Phase 5A** - leg-state-calculator.js (high value, complex logic)
2. **Phase 5C** - spider-factory.js (high value, initialization)
3. **Phase 5B** - boundary-utils.js (quick win)
4. **Phase 5F** - keyboard-controller.js (quick win)
5. **Phase 5D** - position-utils.js (quick win)
6. **Phase 5E** - mode-controller.js (quick win)
7. **Phase 6** - integration tests (if time allows)

**Estimated Time:** 14-18 hours
**Expected Coverage:** 95-96%

### Option 2: Balanced (High-Value Items Only)
1. **Phase 5A** - leg-state-calculator.js
2. **Phase 5C** - spider-factory.js
3. **Skip:** 5B, 5D, 5E, 5F, Phase 6

**Estimated Time:** 6-8 hours
**Expected Coverage:** 95%

### Option 3: Coverage-Focused (STOP HERE)
- **No further work needed** - 94.65% already exceeds 80% goal by 14.65 points
- Move to window_spider_trigger (Priority 1, currently 65.28%)

**Estimated Time:** 0 hours
**Current Coverage:** 94.65%

---

## Browser Export Template

**CRITICAL:** Every new library MUST follow this pattern:

```javascript
// library-name.js
//
// BROWSER COMPATIBILITY PATTERN:
// - NO ES6 'export' keywords (breaks in browser <script> tags)
// - Define with 'const' and 'function' normally
// - Conditional exports at bottom for both Node.js and browser
//
// CRITICAL: Do NOT use 'export const' or 'export function' syntax!

function myFunction() {
    // Implementation
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { myFunction };
}

// Export for browser (make available globally)
if (typeof window !== 'undefined') {
    window.LibraryName = { myFunction };
}
```

**Browser usage in spider-animation.js:**
```javascript
// ALWAYS use window. prefix
const result = window.LibraryName.myFunction();
```

**Browser export test:**
```javascript
// test-browser-exports.js

test('LibraryName exports to window object', () => {
    const window = createBrowserEnvironment();
    loadScript(window, path.join(__dirname, 'library-name.js'));

    if (typeof window.LibraryName === 'undefined') {
        throw new Error('window.LibraryName not defined');
    }

    if (typeof window.LibraryName.myFunction !== 'function') {
        throw new Error('window.LibraryName.myFunction is not a function');
    }

    // Test functionality
    const result = window.LibraryName.myFunction();
    if (result !== expectedValue) {
        throw new Error('myFunction did not work correctly');
    }
});
```

---

## Testing Workflow

### For Each Phase
1. **Create library file** with browser export pattern
2. **Create test file** with simple test framework (see existing tests)
3. **Add to run-all-tests.sh**
4. **Run tests:** `pixi run test`
5. **Update spider-animation.js** to use new library
6. **Add to test-browser-exports.js**
7. **Run tests again:** `pixi run test`
8. **Test in browser:**
   ```bash
   pixi run serve &
   pixi run open
   ```
9. **Run coverage:** `pixi run coverage`
10. **Commit changes:** `git add . && git commit -m "Phase 5X: Extract library-name.js"`

### Verification Checklist
- [ ] All tests pass (17+ test suites)
- [ ] Coverage remains 94%+
- [ ] Browser animation works
- [ ] No console errors in browser
- [ ] FPS remains at 60
- [ ] Both procedural and hopping modes work

---

## Common Pitfalls to Avoid

### 1. ES6 Export Syntax
❌ **DON'T:**
```javascript
export function myFunction() { ... }
export const MY_CONSTANT = { ... };
```

✅ **DO:**
```javascript
function myFunction() { ... }
const MY_CONSTANT = { ... };

// At bottom:
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { myFunction, MY_CONSTANT };
}
```

### 2. Missing window. Prefix
❌ **DON'T:**
```javascript
// In spider-animation.js
const result = LibraryName.myFunction();
```

✅ **DO:**
```javascript
// In spider-animation.js
const result = window.LibraryName.myFunction();
```

### 3. Skipping Browser Export Tests
Every new library MUST have a browser export test added to test-browser-exports.js. This caught bugs in Phase 1 that unit tests missed!

### 4. Over-Extraction
Don't extract code that's tightly coupled to DOM/canvas. Integration code is OK to leave in spider-animation.js.

### 5. Breaking Functionality for Coverage
Prioritize working code over coverage metrics. If extraction breaks animation, REVERT and document why.

---

## Success Criteria

### Per-Phase Success
- [ ] All tests pass
- [ ] Coverage maintained or improved
- [ ] Browser animation works identically
- [ ] No performance regression (60 FPS)
- [ ] Browser export test added
- [ ] Documentation updated

### Overall Phases 5-6 Success
- [ ] 20+ test suites passing
- [ ] 95-96% overall coverage
- [ ] spider-animation.js reduced to ~300-400 lines
- [ ] All complex logic extracted to testable libraries
- [ ] Comprehensive documentation
- [ ] PHASES_5_6_COMPLETE.md written

---

## Next Agent Quick Start

```bash
# Check current status
cd /home/griswald/personal/halloween/spider_crawl_projection
pixi run test          # Should show 17/17 passing
pixi run coverage      # Should show 94.65%

# Read documentation
cat PHASE4_COMPLETE.md
cat COMPREHENSIVE_COVERAGE_PLAN.md

# Start Phase 5A
# 1. Copy leg-state-calculator.js code from this document
# 2. Create test-leg-state-calculator.js
# 3. Follow testing workflow above
```

---

**Document Created:** 2025-11-09
**Purpose:** Guide for completing Phases 5-6
**Status:** Ready for next agent or future work
**Recommendation:** Prioritize Phase 5A and 5C, skip rest unless time permits
