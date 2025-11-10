# Remaining Work: Phases 5D-5F and Phase 6

## Status: Phase 5D COMPLETE, 5E-5F and 6 Pending

### Completed So Far
- ✓ Phase 5A: leg-state-calculator.js (18 test suites, 92.75% coverage)
- ✓ Phase 5B: boundary-utils.js (41 tests, 91.83% coverage)
- ✓ Phase 5C: spider-factory.js (68 tests, 94.11% coverage)
- ✓ Phase 5D: position-utils.js (19 tests, coverage pending)

### Current Status
- **Test Suites:** 21/25 complete
- **Coverage:** 94.4% (target: 95%+)
- **spider-animation.js:** 669 lines (will reduce after full integration)

---

## Phase 5E: Mode Controller (SIMPLE - 30 minutes)

### File to Create: mode-controller.js

**Location in spider-animation.js:** Lines related to animation mode switching

**Functions to Extract:**
```javascript
/**
 * Check if hopping controls should be visible
 */
function shouldShowHoppingControls(animationMode) {
    return animationMode === 'hopping';
}

/**
 * Get list of available animation modes
 */
function getAvailableModes() {
    return ['procedural', 'hopping'];
}

/**
 * Validate animation mode
 */
function validateMode(mode) {
    const availableModes = getAvailableModes();
    return availableModes.includes(mode);
}
```

### Tests Needed (6 tests in test-mode-controller.js):
1. shouldShowHoppingControls returns true for 'hopping'
2. shouldShowHoppingControls returns false for 'procedural'
3. getAvailableModes returns array with 2 modes
4. getAvailableModes includes 'procedural'
5. getAvailableModes includes 'hopping'
6. validateMode returns true for valid modes, false for invalid

### Browser Export Test:
Add Test 14 to test-browser-exports.js:
- Verify window.ModeController exists
- Test shouldShowHoppingControls('hopping') === true
- Test getAvailableModes().length === 2
- Test validateMode('procedural') === true
- Test validateMode('invalid') === false

### Update run-all-tests.sh:
Add after Phase 5D:
```bash
# Phase 5E Library Tests
run_test "Mode Controller" "test-mode-controller.js"
```

---

## Phase 5F: Keyboard Controller (SIMPLE - 30 minutes)

### File to Create: keyboard-controller.js

**Location in spider-animation.js:** Lines 651-667

**Functions to Extract:**
```javascript
/**
 * Keyboard action mapping
 */
const KEYBOARD_ACTIONS = {
    'h': 'toggleControls',
    'f': 'toggleFullscreen',
    'r': 'resetSpiders',
    ' ': 'togglePause'
};

/**
 * Get keyboard action for a key
 */
function getKeyboardAction(key) {
    const normalizedKey = key.toLowerCase();
    return KEYBOARD_ACTIONS[normalizedKey] || null;
}

/**
 * Get all keyboard shortcuts
 */
function getAllShortcuts() {
    return Object.entries(KEYBOARD_ACTIONS).map(([key, action]) => ({
        key,
        action,
        display: key === ' ' ? 'Space' : key.toUpperCase()
    }));
}
```

### Tests Needed (8 tests in test-keyboard-controller.js):
1. getKeyboardAction('h') returns 'toggleControls'
2. getKeyboardAction('f') returns 'toggleFullscreen'
3. getKeyboardAction('r') returns 'resetSpiders'
4. getKeyboardAction(' ') returns 'togglePause'
5. getKeyboardAction('x') returns null (unknown key)
6. getKeyboardAction('H') returns 'toggleControls' (case insensitive)
7. getAllShortcuts returns array of 4 shortcuts
8. getAllShortcuts includes correct display names

### Browser Export Test:
Add Test 15 to test-browser-exports.js:
- Verify window.KeyboardController exists
- Test getKeyboardAction('h') === 'toggleControls'
- Test getKeyboardAction('x') === null
- Test getAllShortcuts().length === 4

### Update run-all-tests.sh:
Add after Phase 5E:
```bash
# Phase 5F Library Tests
run_test "Keyboard Controller" "test-keyboard-controller.js"
```

---

## Phase 6: Integration Testing (MEDIUM - 2 hours)

### File to Create: test-spider-animation-integration.js

**Purpose:** Test DOM/canvas integration that cannot be unit tested

### Setup Code:
```javascript
const { JSDOM } = require('jsdom');

class MockCanvasContext {
    constructor() {
        this.calls = [];
    }

    save() { this.calls.push(['save']); }
    restore() { this.calls.push(['restore']); }
    translate(x, y) { this.calls.push(['translate', x, y]); }
    beginPath() { this.calls.push(['beginPath']); }
    moveTo(x, y) { this.calls.push(['moveTo', x, y]); }
    lineTo(x, y) { this.calls.push(['lineTo', x, y]); }
    stroke() { this.calls.push(['stroke']); }
    fill() { this.calls.push(['fill']); }
    ellipse(...args) { this.calls.push(['ellipse', ...args]); }
    arc(...args) { this.calls.push(['arc', ...args]); }

    set fillStyle(value) { this.calls.push(['fillStyle', value]); }
    set strokeStyle(value) { this.calls.push(['strokeStyle', value]); }
    set lineWidth(value) { this.calls.push(['lineWidth', value]); }
}
```

### Tests Needed (15+ tests):

1. **Canvas Initialization**
   - Canvas element exists in DOM
   - Canvas has correct initial dimensions
   - Context is 2D

2. **Spider Creation**
   - resetSpiders creates correct number of spiders
   - Each spider has unique properties
   - Spiders start at x = -50

3. **Drawing Tests**
   - Spider.draw calls canvas save/restore
   - Spider.draw calls translate for positioning
   - Spider body is drawn as ellipse
   - Legs are drawn with moveTo/lineTo

4. **UI Integration**
   - toggleControls changes CSS class
   - Slider changes update config
   - Mode selector changes animation mode
   - Stats display updates with current values

5. **Event Handling**
   - Keyboard events trigger correct actions
   - Mouse events work on buttons
   - Config changes propagate to spiders

6. **Animation Loop**
   - requestAnimationFrame is called
   - FPS calculation works
   - Pause stops animation
   - Resume restarts animation

### Update run-all-tests.sh:
Add before Regression Prevention Tests:
```bash
# Phase 6 Integration Tests
run_test "Spider Animation Integration" "test-spider-animation-integration.js"
```

---

## Final Steps

### 1. Update COMPREHENSIVE_COVERAGE_PLAN.md
Mark Phases 5B-5F and Phase 6 as COMPLETE

### 2. Create PHASE5_COMPLETE.md
Comprehensive report covering:
- All Phase 5 extractions (A-F)
- Total libraries created: 6
- Total tests added: ~160
- Coverage improvement
- spider-animation.js line count reduction

### 3. Create PHASE6_COMPLETE.md
Integration testing report:
- Tests created
- DOM/canvas integration verified
- UI functionality confirmed

### 4. Final Coverage Check
```bash
pixi run coverage
```
Expected: 95-96% overall coverage

### 5. Manual Browser Test
1. Open spider-animation.html in browser
2. Verify animations work smoothly
3. Test all keyboard shortcuts (h, f, r, space)
4. Switch between procedural and hopping modes
5. Adjust sliders and verify changes
6. Confirm 60 FPS performance

### 6. Update NEXT_AGENT_COVERAGE.md
Update with Phase 5-6 completion status

### 7. Commit Final Changes
```bash
git add spider_crawl_projection/*
git commit -m "Complete spider_crawl_projection Phases 5D-5F and Phase 6"
```

---

## Expected Final Metrics

### Test Suites
- **Total:** 24-25 test suites
- **All passing:** ✓

### Coverage
- **Overall:** 95-96%
- **spider-animation.js:** 95%+ (after full integration)

### Code Organization
- **Libraries extracted:** 6 (leg-state-calculator, boundary-utils, spider-factory, position-utils, mode-controller, keyboard-controller)
- **Total tests:** ~200+
- **spider-animation.js:** Reduced from 669 to ~400-450 lines (after full integration)

### Quality Gates
- [x] All unit tests passing
- [x] All browser export tests passing
- [x] Coverage above 95%
- [x] No regressions
- [ ] Manual browser test complete
- [ ] Documentation updated

---

## Time Estimates

- Phase 5E: 30 minutes
- Phase 5F: 30 minutes
- Phase 6: 2 hours
- Documentation: 30 minutes
- Manual testing: 30 minutes
- **Total: 4 hours**

---

## Notes

- Phases 5E and 5F are very simple extractions (13-19 lines each)
- Phase 6 is the most complex but follows established patterns
- All browser export patterns are already established
- Integration tests follow MockCanvasContext pattern
- Manual browser testing is critical - don't skip it!

---

## Success Criteria

Before marking work complete:
- [ ] All 24-25 test suites passing
- [ ] Coverage 95%+ overall
- [ ] All browser export tests passing
- [ ] Manual browser test successful (60 FPS, all features working)
- [ ] Documentation complete (PHASE5_COMPLETE.md, PHASE6_COMPLETE.md)
- [ ] Code committed to git
- [ ] NEXT_AGENT_COVERAGE.md updated

