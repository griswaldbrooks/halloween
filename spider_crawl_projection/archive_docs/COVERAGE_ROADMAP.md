# Coverage Roadmap: 24% → 80%

**Quick Reference Guide for Achieving 80% Test Coverage**

---

## Current Status

```
┌─────────────────────────────────────────────────────────┐
│ CURRENT COVERAGE: 24.9% (239/961 lines)                │
├─────────────────────────────────────────────────────────┤
│ ✅ leg-kinematics.js    154 lines @ 97.4%   = 150 ✓    │
│ ✅ spider-model.js       85 lines @ 98.3%   =  83 ✓    │
│ ❌ spider-animation.js  722 lines @  0.0%   =   0 ✓    │
└─────────────────────────────────────────────────────────┘
```

## Target State

```
┌─────────────────────────────────────────────────────────┐
│ TARGET COVERAGE: 80.0% (769/961 lines)                 │
├─────────────────────────────────────────────────────────┤
│ GAP: 530 lines needed                                   │
│ STRATEGY: Extract 547 lines into testable libraries    │
└─────────────────────────────────────────────────────────┘
```

---

## 6-Phase Implementation Plan

### Phase 1: Simple Extractions (3-4 hrs) → 27.4%
```
📦 config-defaults.js     (17 lines)  - Config object + validation
📦 foot-positions.js      (13 lines)  - Foot position data + utils
                          ─────────
                          +30 lines
```

### Phase 2: Animation Math (3-4 hrs) → 35.0%
```
📦 animation-math.js      (73 lines)  - Interpolation, swing, lerp
                          ─────────
                          +73 lines (includes merging procedural logic)
```

### Phase 3: State Machines (7-8 hrs) → 51.6%
```
📦 gait-state-machine.js  (60 lines)  - 6-phase tetrapod gait
📦 hopping-logic.js      (100 lines)  - Hop phases + crawl cycles
                          ─────────
                         +160 lines
```

### Phase 4: Configuration (2-3 hrs) → 54.7%
```
📦 config-manager.js      (30 lines)  - Range validation, parsing
                          ─────────
                          +30 lines
```

### Phase 5: Advanced Logic (8-10 hrs) → 79.1%
```
📦 leg-state-calculator.js  (72 lines)  - Hop phase leg positions
📦 boundary-utils.js        (25 lines)  - Wrap/bounce logic
📦 spider-factory.js        (71 lines)  - Spider initialization
📦 position-utils.js        (13 lines)  - Leg position initialization
📦 mode-controller.js       (13 lines)  - Animation mode switching
📦 keyboard-controller.js   (19 lines)  - Keyboard shortcut mapping
📦 config-validators.js     (20 lines)  - Input validation
                            ─────────
                           +233 lines
```

### Phase 6: Integration Tests (4-5 hrs) → 81.7%
```
🧪 test-spider-animation-integration.js  (+25 lines coverage)
   - jsdom + mock canvas
   - Selective integration testing
```

---

## Progress Tracker

| Phase | Lines | Cumulative | Coverage % | Status |
|-------|-------|------------|------------|--------|
| Current | 233 | 233 | 24.2% | ✅ DONE |
| Phase 1 | +30 | 263 | 27.4% | ⬜ TODO |
| Phase 2 | +73 | 336 | 35.0% | ⬜ TODO |
| Phase 3 | +160 | 496 | 51.6% | ⬜ TODO |
| Phase 4 | +30 | 526 | 54.7% | ⬜ TODO |
| Phase 5 | +234 | 760 | 79.1% | ⬜ TODO |
| Phase 6 | +25 | 785 | **81.7%** | ⬜ TODO |

---

## Quick Decision Matrix

### Should I implement Phase X?

**Phase 1 (Simple):** YES - Low risk, quick wins, builds confidence
**Phase 2 (Math):** YES - Core animation logic, already proposed
**Phase 3 (State):** YES - Critical gait/hop logic, high value
**Phase 4 (Config):** YES - Already proposed, clean separation
**Phase 5 (Advanced):** YES - Gets to 79%, near target
**Phase 6 (Integration):** OPTIONAL - Only needed to cross 80% threshold

### Minimum viable implementation:
- **Phases 1-5** → 79.1% coverage (close to 80%)
- **Total effort:** 23-29 hours

### Recommended implementation:
- **Phases 1-6** → 81.7% coverage (exceeds 80%)
- **Total effort:** 27-34 hours

---

## Key Metrics

### Lines of Code
- **Total codebase:** 961 lines
- **Extractable:** 547 lines (75% of spider-animation.js)
- **Must remain:** 175 lines (canvas/DOM integration)

### Test Coverage
- **Current:** 233 lines @ 97%+ = 227 covered
- **Target:** 769 lines @ 80%
- **Gap:** 536 lines needed
- **Achievable:** 785 lines @ 81.7% ✅

### Effort Breakdown
- **Phases 1-2 (Foundation):** 6-8 hours
- **Phase 3 (Core Logic):** 7-8 hours
- **Phase 4 (Config):** 2-3 hours
- **Phase 5 (Advanced):** 8-10 hours
- **Phase 6 (Integration):** 4-5 hours
- **Total:** 27-34 hours

---

## Risk Levels

```
LOW RISK (Phases 1, 2, 4):
  - Pure functions
  - Clear inputs/outputs
  - Easy to test
  - Low coupling

MEDIUM RISK (Phases 3, 5):
  - State management
  - Complex logic
  - Requires careful extraction
  - Mitigated by TDD + phasing

HIGH RISK (Phase 6):
  - Mocking canvas/DOM
  - Integration testing
  - May be brittle
  - Optional (only for 80%+ guarantee)
```

---

## Success Milestones

### Week 1: Foundation Complete
- ✅ Phases 1-2 implemented
- ✅ 35% overall coverage
- ✅ All tests passing
- ✅ No functionality regressions

### Week 2: Core Logic Complete
- ✅ Phase 3 implemented
- ✅ 51.6% overall coverage
- ✅ Gait + hopping tested
- ✅ Animation works identically

### Week 3: Advanced Complete
- ✅ Phases 4-5 implemented
- ✅ 79.1% overall coverage
- ✅ Near target
- ✅ All UI controls tested

### Week 4: Target Achieved
- ✅ Phase 6 implemented
- ✅ 81.7% overall coverage
- ✅ EXCEEDS 80% TARGET ✅
- ✅ Documentation updated

---

## Files to Create

### Phase 1
- `config-defaults.js` + `test-config-defaults.js`
- `foot-positions.js` + `test-foot-positions.js`

### Phase 2
- `animation-math.js` + `test-animation-math.js`

### Phase 3
- `gait-state-machine.js` + `test-gait-state-machine.js`
- `hopping-logic.js` + `test-hopping-logic.js`

### Phase 4
- `config-manager.js` + `test-config-manager.js`

### Phase 5
- `leg-state-calculator.js` + `test-leg-state-calculator.js`
- `boundary-utils.js` + `test-boundary-utils.js`
- `spider-factory.js` + `test-spider-factory.js`
- `position-utils.js` + `test-position-utils.js`
- `mode-controller.js` + `test-mode-controller.js`
- `keyboard-controller.js` + `test-keyboard-controller.js`
- `config-validators.js` + `test-config-validators.js`

### Phase 6
- `test-spider-animation-integration.js`

**Total new files:** 25 (13 libraries + 12 test files)

---

## Next Steps

1. **Review COMPREHENSIVE_COVERAGE_PLAN.md** for full implementation details
2. **Start with Phase 1** (config-defaults.js + foot-positions.js)
3. **Use TDD approach** (write tests first)
4. **Commit after each phase** (easy rollback)
5. **Manual test after each phase** (verify animations work)

---

## Related Documents

- **COMPREHENSIVE_COVERAGE_PLAN.md** - Full implementation guide with code examples
- **REFACTORING_PROPOSAL.md** - Original proposal (Phases 1-4, ~230 lines)
- **COVERAGE_ISSUES.md** - Detailed coverage improvement guides
- **NEXT_AGENT_COVERAGE.md** - Quick-start for next agent

---

**Last Updated:** 2025-11-09
**Status:** Ready for implementation
**Estimated Completion:** 4 weeks (27-34 hours)
