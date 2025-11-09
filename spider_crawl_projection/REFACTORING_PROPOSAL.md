# Refactoring Proposal: Extract Testable Logic from spider-animation.js

**Created:** 2025-11-09
**Status:** Proposed
**Goal:** Increase test coverage by extracting pure logic from 722-line integration file

---

## Executive Summary

### Current State
- **Total project lines:** ~961 lines
- **Testable libraries:** 239 lines (leg-kinematics.js + spider-model.js)
- **Integration code:** 722 lines (spider-animation.js)
- **Current coverage:** 97.48% of testable code (239 lines)
- **Overall coverage:** ~24.9% of total codebase (239/961)

### Problem
spider-animation.js contains significant amounts of **pure logic** mixed with browser-specific rendering code. This pure logic (gait timing, state machines, animation calculations) could be extracted into testable libraries.

### Proposed State
- **New testable libraries:** ~200-250 lines of extracted logic
- **Reduced integration code:** ~470-520 lines remaining in spider-animation.js
- **Expected coverage:** 97%+ of 450-490 testable lines
- **Overall coverage:** ~47-51% of total codebase (significant improvement)

### Benefits
1. **Testable gait logic:** State machine transitions, timing calculations
2. **Testable animation math:** Interpolation, easing, position calculations
3. **Testable configuration:** Validation, range enforcement
4. **Regression prevention:** Critical algorithms protected by unit tests
5. **Code clarity:** Separation of concerns (logic vs rendering)

---

## Code Analysis by Testability

### Category 1: Pure Logic (Extractable, Unit Testable) ✅

**Estimated:** ~200-250 lines

#### A. Gait State Machine Logic (~60 lines)
**Location:** Lines 206-234, 269-353
**Functions:**
- Phase transition logic (6-phase cycle)
- Timer management
- Step progress calculation
- Hopping state transitions (crouch → takeoff → flight → landing → crawl)

**Extraction Target:** `gait-state-machine.js`

**Example extraction:**
```javascript
// gait-state-machine.js
export class GaitStateMachine {
  constructor(phaseDurations = [200, 150, 100, 200, 150, 100]) {
    this.phaseDurations = phaseDurations;
    this.currentPhase = 0;
    this.timer = 0;
  }

  update(dt, speedMultiplier) {
    this.timer += dt * speedMultiplier;

    if (this.timer >= this.phaseDurations[this.currentPhase]) {
      this.timer = 0;
      this.currentPhase = (this.currentPhase + 1) % 6;
      return { phaseChanged: true, newPhase: this.currentPhase };
    }

    const progress = this.timer / this.phaseDurations[this.currentPhase];
    return { phaseChanged: false, progress };
  }

  shouldLurch() {
    return this.currentPhase === 1 || this.currentPhase === 4;
  }

  shouldSwing(legGroup) {
    return (this.currentPhase === 0 && legGroup === 'A') ||
           (this.currentPhase === 3 && legGroup === 'B');
  }
}
```

**Unit Tests:**
- Phase transitions at correct timings
- Timer reset on phase change
- Progress calculation (0.0 to 1.0)
- Speed multiplier effect
- Lurch phase detection
- Swing phase detection for both leg groups

**Coverage gain:** ~60 lines (currently untested)

---

#### B. Hopping Logic (~100 lines)
**Location:** Lines 269-353, 355-426
**Functions:**
- Hop phase management (crouch, takeoff, flight, landing)
- Crawl cycle counting
- Hop distance calculation
- Leg position multipliers during hop phases

**Extraction Target:** `hopping-logic.js`

**Example extraction:**
```javascript
// hopping-logic.js
export class HoppingController {
  constructor(config) {
    this.hopPhaseDurations = [100, 200, config.hopFlightDuration, 200];
    this.crawlPhaseDurations = [200, 150, 100, 200, 150, 100];
    this.hopPhase = 0;
    this.hopTimer = 0;
    this.crawlPhase = 0;
    this.crawlTimer = 0;
    this.crawlCyclesRemaining = this.randomCrawlCycles(config);
    this.hopStartX = 0;
    this.hopTargetX = 0;
    this.config = config;
  }

  randomCrawlCycles(config) {
    const range = config.hopFrequencyMax - config.hopFrequencyMin;
    return Math.floor(Math.random() * range) + config.hopFrequencyMin;
  }

  updateCrawl(dt, speedMultiplier) {
    this.crawlTimer += dt * speedMultiplier;

    if (this.crawlTimer >= this.crawlPhaseDurations[this.crawlPhase]) {
      this.crawlTimer = 0;
      this.crawlPhase = (this.crawlPhase + 1) % 6;

      if (this.crawlPhase === 0) {
        this.crawlCyclesRemaining--;
        if (this.crawlCyclesRemaining <= 0) {
          return { switchToHop: true, newCrawlCycles: this.randomCrawlCycles(this.config) };
        }
      }
    }

    return {
      switchToHop: false,
      crawlPhase: this.crawlPhase,
      progress: this.crawlTimer / this.crawlPhaseDurations[this.crawlPhase]
    };
  }

  updateHop(dt, speedMultiplier, currentX, bodySize) {
    this.hopTimer += dt * speedMultiplier;

    if (this.hopTimer >= this.hopPhaseDurations[this.hopPhase]) {
      this.hopTimer = 0;
      this.hopPhase = (this.hopPhase + 1) % 4;

      // Initialize hop at takeoff
      if (this.hopPhase === 1) {
        this.hopStartX = currentX;
        const distanceRange = this.config.hopDistanceMax - this.config.hopDistanceMin;
        const hopMultiplier = this.config.hopDistanceMin + Math.random() * distanceRange;
        this.hopTargetX = currentX + (bodySize * hopMultiplier);
      }

      // Switch to crawl after landing
      if (this.hopPhase === 0) {
        return { switchToCrawl: true };
      }
    }

    return {
      switchToCrawl: false,
      hopPhase: this.hopPhase,
      progress: this.hopTimer / this.hopPhaseDurations[this.hopPhase],
      hopStartX: this.hopStartX,
      hopTargetX: this.hopTargetX
    };
  }

  getLegMultiplier(hopPhase, isBackLeg) {
    const multipliers = {
      0: { back: 0.8, front: 0.8 },    // CROUCH
      1: { back: 1.2, front: 0.5 },    // TAKEOFF
      2: { back: 0.4, front: 0.4 },    // FLIGHT
      3: { back: 0.9, front: 1.1 },    // LANDING
      4: { back: 1.0, front: 1.0 }     // PAUSE
    };

    const phase = multipliers[hopPhase] || multipliers[4];
    return isBackLeg ? phase.back : phase.front;
  }
}
```

**Unit Tests:**
- Crawl phase transitions
- Crawl cycle counting
- Switch to hop after N cycles
- Hop phase transitions
- Hop distance calculation within config range
- Leg multipliers for each hop phase
- Back vs front leg behavior
- Switch to crawl after landing

**Coverage gain:** ~100 lines (currently untested)

---

#### C. Animation Math & Interpolation (~40 lines)
**Location:** Lines 236-267, 428-460
**Functions:**
- Swing target calculation
- Interpolation (lerp) between positions
- Future body position prediction
- Lurch distance calculation

**Extraction Target:** `animation-math.js`

**Example extraction:**
```javascript
// animation-math.js

export function calculateSwingTarget(currentBodyX, bodyY, relativeFootPosition, lurchDistance, scale) {
  const futureBodyX = currentBodyX + lurchDistance;
  return {
    x: futureBodyX + relativeFootPosition.x * scale,
    y: bodyY + relativeFootPosition.y * scale
  };
}

export function interpolatePosition(startPos, targetPos, progress) {
  return {
    x: startPos.x + (targetPos.x - startPos.x) * progress,
    y: startPos.y + (targetPos.y - startPos.y) * progress
  };
}

export function calculateLurchDistance(bodySize, lurchFactor = 0.4) {
  return bodySize * lurchFactor;
}

export function calculateLurchSpeed(bodySize, phaseDuration, lurchFactor = 0.4) {
  return (bodySize * lurchFactor) / phaseDuration;
}

export function scaledFootPosition(relativePosition, bodySize, baseSize = 100) {
  const scale = bodySize / baseSize;
  return {
    x: relativePosition.x * scale,
    y: relativePosition.y * scale
  };
}

export function smoothTransition(current, target, smoothFactor) {
  return current + (target - current) * smoothFactor;
}
```

**Unit Tests:**
- Swing target calculation with various inputs
- Interpolation at progress 0.0, 0.5, 1.0
- Lurch distance scales with body size
- Lurch speed calculation
- Foot position scaling
- Smooth transition convergence

**Coverage gain:** ~40 lines (currently untested)

---

#### D. Configuration Management (~30 lines)
**Location:** Lines 596-701 (update functions)
**Functions:**
- Range validation (min/max enforcement)
- Config value parsing and validation
- Spider count/speed/size management

**Extraction Target:** `config-manager.js`

**Example extraction:**
```javascript
// config-manager.js

export class ConfigManager {
  constructor(defaults) {
    this.config = { ...defaults };
  }

  updateValue(key, value, validator = null) {
    const parsed = this.parseValue(value);
    if (validator && !validator(parsed)) {
      throw new Error(`Invalid value for ${key}: ${value}`);
    }
    this.config[key] = parsed;
    return parsed;
  }

  updateRange(minKey, maxKey, newMin, newMax) {
    // Ensure min <= max
    if (newMin !== undefined && newMax !== undefined) {
      if (newMin > newMax) {
        [newMin, newMax] = [newMax, newMin];
      }
    } else if (newMin !== undefined) {
      newMin = Math.min(newMin, this.config[maxKey]);
    } else if (newMax !== undefined) {
      newMax = Math.max(newMax, this.config[minKey]);
    }

    if (newMin !== undefined) this.config[minKey] = newMin;
    if (newMax !== undefined) this.config[maxKey] = newMax;

    return { min: this.config[minKey], max: this.config[maxKey] };
  }

  parseValue(value) {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (!isNaN(num)) return num;
      const int = parseInt(value);
      if (!isNaN(int)) return int;
    }
    return value;
  }

  getRandomInRange(minKey, maxKey) {
    const min = this.config[minKey];
    const max = this.config[maxKey];
    return Math.random() * (max - min) + min;
  }
}
```

**Unit Tests:**
- Value parsing (string to number)
- Range validation (min/max enforcement)
- Range swap when min > max
- Random value generation within range
- Invalid value rejection

**Coverage gain:** ~30 lines (currently untested)

---

### Category 2: Testable with Mocking (~50 lines)

**Estimated:** ~50 lines

#### E. Spider State Management
**Location:** Lines 93-177 (reset, initialization)
**Functions:**
- Spider position initialization
- Speed/size variation calculation
- Leg group assignment
- Initial state setup

**Complexity:** These functions depend on `canvas` (global) and `SpiderBody` (external class), but can be tested with mocks.

**Extraction Target:** `spider-factory.js`

**Example extraction:**
```javascript
// spider-factory.js
export function createSpiderState(index, config, canvasWidth, canvasHeight) {
  // Calculate individual speed
  const speedRange = config.speedVariation;
  const baseSpeed = config.spiderSpeed;
  const speedMultiplier = baseSpeed * (1 - speedRange * 0.5 + Math.random() * speedRange);

  // Calculate individual size
  const sizeRange = config.sizeVariation;
  const avgSize = (config.spiderSizeMin + config.spiderSizeMax) / 2;
  const sizeSpread = (config.spiderSizeMax - config.spiderSizeMin) / 2;
  const bodySize = (8 + Math.random() * 8) * (avgSize + (Math.random() * 2 - 1) * sizeSpread * sizeRange);

  return {
    index,
    x: -50,
    y: Math.random() * canvasHeight,
    vy: (Math.random() - 0.5) * 0.3,
    speedMultiplier,
    bodySize,
    gaitPhase: 0,
    gaitTimer: 0,
    stepProgress: 0,
    hopPhase: Math.floor(Math.random() * 5),
    hopTimer: Math.random() * 200,
    crawlPhase: 0,
    crawlTimer: 0
  };
}

export function assignLegGroups(legCount = 8) {
  const groupA = [1, 2, 5, 6];
  const groups = [];
  for (let i = 0; i < legCount; i++) {
    groups.push(groupA.includes(i) ? 'A' : 'B');
  }
  return groups;
}
```

**Unit Tests (with mocks):**
- Speed multiplier within expected range
- Size calculation respects min/max config
- Position initialization (x, y, vy)
- Leg group assignment (A vs B)
- Variation=0 produces identical values
- Variation=1 produces full range

**Coverage gain:** ~50 lines (currently untested)

---

### Category 3: True Integration Code (Cannot Unit Test) ❌

**Estimated:** ~470-520 lines (will remain in spider-animation.js)

#### F. Browser-Specific Code (Cannot Extract)
**Lines:** 2-4, 25-38, 67-72, 463-527, 543-581, 584-720

**Why untestable:**
- `document.getElementById()` - requires real DOM
- `canvas.getContext('2d')` - requires real canvas API
- `ctx.fillRect()`, `ctx.ellipse()`, `ctx.stroke()` - canvas rendering
- `requestAnimationFrame()` - browser animation API
- `window.addEventListener()` - browser events
- `document.addEventListener()` - keyboard events
- `document.fullscreenElement` - fullscreen API

**Functions:**
- Script loading and dependency management
- Canvas resizing
- Drawing legs (ctx operations)
- Drawing body (ctx operations)
- Animation loop (requestAnimationFrame)
- Event handlers (keyboard, resize)
- UI updates (DOM manipulation)

**Lines that must stay:**
- Lines 1-38: Script loading, canvas setup
- Lines 67-72: Canvas resize
- Lines 463-527: Drawing functions (all ctx.* calls)
- Lines 543-581: Animation loop, FPS tracking
- Lines 584-720: Event handlers, UI updates

**Total:** ~470-520 lines (unavoidable integration code)

---

## Proposed Library Structure

### New Testable Libraries (4 files, ~230 lines)

1. **gait-state-machine.js** (~60 lines)
   - `GaitStateMachine` class
   - Phase transitions, timer management
   - Lurch/swing detection

2. **hopping-logic.js** (~100 lines)
   - `HoppingController` class
   - Hop phase management
   - Crawl cycle counting
   - Leg multiplier calculations

3. **animation-math.js** (~40 lines)
   - Pure functions for calculations
   - Interpolation, lerp
   - Distance calculations
   - Position scaling

4. **config-manager.js** (~30 lines)
   - `ConfigManager` class
   - Value parsing and validation
   - Range enforcement
   - Random generation

### Refactored Integration Layer

**spider-animation.js** (~490 lines, down from 722)
- Script loading (38 lines)
- Canvas management (10 lines)
- Spider class using extracted libraries (~150 lines)
- Drawing functions (~60 lines)
- Animation loop (~30 lines)
- Event handlers and UI (~200 lines)

---

## Coverage Impact Analysis

### Before Refactoring
| Component | Lines | Covered | Coverage |
|-----------|-------|---------|----------|
| leg-kinematics.js | 154 | 150 | 97.40% |
| spider-model.js | 85 | 83 | 97.65% |
| spider-animation.js | 722 | 0 | 0.00% |
| **Total** | **961** | **233** | **24.2%** |

### After Refactoring
| Component | Lines | Covered | Coverage |
|-----------|-------|---------|----------|
| leg-kinematics.js | 154 | 150 | 97.40% |
| spider-model.js | 85 | 83 | 97.65% |
| gait-state-machine.js | 60 | 58 | 96.67% |
| hopping-logic.js | 100 | 97 | 97.00% |
| animation-math.js | 40 | 39 | 97.50% |
| config-manager.js | 30 | 29 | 96.67% |
| spider-animation.js | 492 | 0 | 0.00% |
| **Total** | **961** | **456** | **47.5%** |

**Improvement:** From 24.2% to 47.5% overall coverage (+23.3 percentage points)

---

## Implementation Plan

### Phase 1: Extract Animation Math (Low Risk)
**Effort:** 2-3 hours
**Files:** Create `animation-math.js`, update `spider-animation.js`
**Tests:** ~15 unit tests

**Steps:**
1. Create `animation-math.js` with pure functions
2. Write comprehensive unit tests
3. Update `spider-animation.js` to import and use functions
4. Verify existing animation still works identically
5. Run regression tests

**Why first:** Smallest, lowest risk, no state management

---

### Phase 2: Extract Gait State Machine (Medium Risk)
**Effort:** 3-4 hours
**Files:** Create `gait-state-machine.js`, update `spider-animation.js`
**Tests:** ~20 unit tests

**Steps:**
1. Create `GaitStateMachine` class
2. Write unit tests for all phase transitions
3. Update `Spider.updateProcedural()` to use state machine
4. Test procedural animation works identically
5. Run all tests

**Why second:** Self-contained state machine, clear boundaries

---

### Phase 3: Extract Hopping Logic (Medium-High Risk)
**Effort:** 4-5 hours
**Files:** Create `hopping-logic.js`, update `spider-animation.js`
**Tests:** ~25 unit tests

**Steps:**
1. Create `HoppingController` class
2. Write unit tests for hop and crawl phases
3. Update `Spider.updateHopping()` to use controller
4. Test hopping animation works identically
5. Run all tests

**Why third:** More complex state, but isolated from procedural mode

---

### Phase 4: Extract Config Manager (Low-Medium Risk)
**Effort:** 2-3 hours
**Files:** Create `config-manager.js`, update `spider-animation.js`
**Tests:** ~15 unit tests

**Steps:**
1. Create `ConfigManager` class
2. Write unit tests for value parsing and validation
3. Update UI handlers to use `ConfigManager`
4. Test all UI controls work correctly
5. Run all tests

**Why last:** Touches many UI handlers, easier to test after other refactoring

---

### Total Effort Estimate
**Total:** 11-15 hours
**Breakdown:**
- Extraction: 6-8 hours
- Testing: 3-4 hours
- Integration & debugging: 2-3 hours

---

## Risks and Mitigations

### Risk 1: Breaking Existing Animation
**Likelihood:** Medium
**Impact:** High
**Mitigation:**
- Extract one library at a time
- Extensive manual testing after each extraction
- Keep old code commented until verification complete
- Use version control to easily revert

### Risk 2: Introducing Timing Bugs
**Likelihood:** Low
**Impact:** Medium
**Mitigation:**
- Unit tests verify timing calculations
- Side-by-side comparison of old vs new animation
- Test with multiple speed multipliers
- Verify FPS remains stable

### Risk 3: Test Complexity
**Likelihood:** Low
**Impact:** Low
**Mitigation:**
- Pure functions are easy to test
- State machines have clear inputs/outputs
- Use existing test patterns from leg-kinematics.js
- Document test expectations clearly

### Risk 4: Integration Testing Gaps
**Likelihood:** Medium
**Impact:** Low
**Mitigation:**
- Keep integration tests (existing manual testing)
- Add browser automation tests if needed (Playwright/Puppeteer)
- Document manual test procedures
- Use visual regression testing tools

---

## Success Criteria

### Functional Requirements
- [ ] All animations work identically to current implementation
- [ ] No performance degradation (FPS stable)
- [ ] No visual differences in spider movement
- [ ] All UI controls function correctly
- [ ] Keyboard shortcuts still work

### Testing Requirements
- [ ] All extracted code has 95%+ unit test coverage
- [ ] All unit tests pass
- [ ] All existing tests still pass
- [ ] No new console errors or warnings

### Code Quality Requirements
- [ ] Clear separation of concerns (logic vs rendering)
- [ ] Consistent naming conventions
- [ ] JSDoc comments for all exported functions
- [ ] No code duplication
- [ ] Libraries are independent (no circular dependencies)

### Documentation Requirements
- [ ] README.md updated with new architecture
- [ ] AGENT_HANDOFF.md describes new structure
- [ ] Each library has clear purpose statement
- [ ] Test coverage metrics updated
- [ ] This proposal marked as "IMPLEMENTED"

---

## Alternative Approaches Considered

### Alternative 1: Extract Everything (Including Integration)
**Rejected because:** Cannot unit test canvas/DOM APIs without heavy mocking that provides little value.

### Alternative 2: Don't Refactor (Keep as Integration Code)
**Rejected because:** Misses opportunity to test critical gait logic, timing calculations, and state management.

### Alternative 3: Browser Automation Testing (Playwright)
**Deferred because:** Higher setup cost, slower test execution. Can be added later as complement to unit tests.

### Alternative 4: Test with jsdom (Mock Canvas)
**Rejected because:** jsdom canvas mocking is complex, brittle, and doesn't test actual rendering behavior.

---

## Recommendations

### For Next Agent

**If implementing this proposal:**

1. **Start with Phase 1 (animation-math.js)**
   - Lowest risk, immediate coverage gain
   - Builds confidence in extraction process
   - Tests serve as examples for later phases

2. **Use TDD approach**
   - Write tests first for extracted functions
   - Ensures testability from the start
   - Provides regression protection during extraction

3. **Commit after each phase**
   - Don't attempt all 4 phases in one commit
   - Easier to debug and revert if needed
   - Clear progress tracking

4. **Manual testing checklist:**
   - Procedural mode: Smooth walking, no leg intersections
   - Hopping mode: Clean hops, crawl cycles work
   - All sliders function correctly
   - Keyboard shortcuts work
   - Fullscreen works
   - FPS stable at 60fps with 10 spiders

5. **Reference implementations:**
   - leg-kinematics.js: Good example of testable library
   - test-kinematics.js: Testing patterns to follow
   - spider-model.js: Clean class design

**If NOT implementing:**

- Document why (e.g., Halloween event passed, project archived)
- Keep proposal for future similar projects
- Consider partial implementation (just animation-math.js)

---

## Conclusion

This refactoring proposal offers a **significant improvement** in test coverage (24% → 47%) by extracting ~230 lines of pure logic that is currently untested. The extracted code represents critical animation algorithms (gait timing, state machines, interpolation) that would benefit from regression protection via unit tests.

The phased approach minimizes risk by tackling small, independent pieces incrementally. Total effort is estimated at 11-15 hours, which is reasonable for the coverage and code quality gains.

**Recommendation:** Implement Phase 1 (animation-math.js) as a proof of concept. If successful and time permits, continue with remaining phases.

---

**Document Status:** Proposed
**Next Review:** After Phase 1 implementation (if approved)
**Maintained By:** Project agents working on spider_crawl_projection
