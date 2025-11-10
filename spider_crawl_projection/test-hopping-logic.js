#!/usr/bin/env node

/**
 * Unit Tests for Hopping Logic
 *
 * Tests the 5-phase hopping state machine (CROUCH, TAKEOFF, FLIGHT, LANDING, CRAWL)
 * Extracted from spider-animation.js for unit testing (Phase 3B).
 */

const {
    HOP_PHASE,
    getHopPhaseDuration,
    getAllHopPhaseDurations,
    getNextHopPhase,
    calculateHopDistance,
    calculateHopTargetX,
    calculateCrawlCycles,
    shouldStartHopping,
    updateHopPhase,
    updateCrawlPhase,
    createInitialHoppingState,
    isFlightPhase,
    isCrawlMode,
    getCrawlPhaseDurations,
    isLegSwingingInCrawl,
    isCrawlLurchPhase
} = require('./hopping-logic.js');

console.log('=== Hopping Logic Tests ===\n');

let testsRun = 0;
let testsPassed = 0;

function test(name, fn) {
    testsRun++;
    try {
        fn();
        testsPassed++;
        console.log(`✓ ${name}`);
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  ${error.message}`);
    }
}

function assertEq(actual, expected, msg) {
    if (actual !== expected) {
        throw new Error(`${msg}: expected ${expected}, got ${actual}`);
    }
}

function assertTrue(value, msg) {
    if (!value) {
        throw new Error(msg);
    }
}

function assertFalse(value, msg) {
    if (value) {
        throw new Error(msg);
    }
}

function assertRange(value, min, max, msg) {
    if (value < min || value > max) {
        throw new Error(`${msg}: expected ${value} to be between ${min} and ${max}`);
    }
}

// ===========================
// HOP_PHASE Constants Tests
// ===========================

test('HOP_PHASE.CROUCH is 0', () => {
    assertEq(HOP_PHASE.CROUCH, 0, 'CROUCH phase');
});

test('HOP_PHASE.TAKEOFF is 1', () => {
    assertEq(HOP_PHASE.TAKEOFF, 1, 'TAKEOFF phase');
});

test('HOP_PHASE.FLIGHT is 2', () => {
    assertEq(HOP_PHASE.FLIGHT, 2, 'FLIGHT phase');
});

test('HOP_PHASE.LANDING is 3', () => {
    assertEq(HOP_PHASE.LANDING, 3, 'LANDING phase');
});

test('HOP_PHASE.CRAWL is 4', () => {
    assertEq(HOP_PHASE.CRAWL, 4, 'CRAWL phase');
});

// ===========================
// Phase Duration Tests
// ===========================

test('getHopPhaseDuration returns correct CROUCH duration (100ms)', () => {
    const config = { hopFlightDuration: 60 };
    assertEq(getHopPhaseDuration(HOP_PHASE.CROUCH, config), 100, 'CROUCH duration');
});

test('getHopPhaseDuration returns correct TAKEOFF duration (200ms)', () => {
    const config = { hopFlightDuration: 60 };
    assertEq(getHopPhaseDuration(HOP_PHASE.TAKEOFF, config), 200, 'TAKEOFF duration');
});

test('getHopPhaseDuration returns correct FLIGHT duration (from config)', () => {
    const config = { hopFlightDuration: 80 };
    assertEq(getHopPhaseDuration(HOP_PHASE.FLIGHT, config), 80, 'FLIGHT duration');
});

test('getHopPhaseDuration returns default FLIGHT duration (60ms) if config missing', () => {
    const config = {};
    assertEq(getHopPhaseDuration(HOP_PHASE.FLIGHT, config), 60, 'Default FLIGHT duration');
});

test('getHopPhaseDuration returns correct LANDING duration (200ms)', () => {
    const config = { hopFlightDuration: 60 };
    assertEq(getHopPhaseDuration(HOP_PHASE.LANDING, config), 200, 'LANDING duration');
});

test('getHopPhaseDuration handles out of range phase (returns CROUCH duration)', () => {
    const config = { hopFlightDuration: 60 };
    assertEq(getHopPhaseDuration(-1, config), 100, 'Negative phase defaults to CROUCH');
    assertEq(getHopPhaseDuration(5, config), 100, 'Phase 5+ defaults to CROUCH');
});

test('getAllHopPhaseDurations returns array of 4 durations', () => {
    const config = { hopFlightDuration: 70 };
    const durations = getAllHopPhaseDurations(config);
    assertTrue(Array.isArray(durations), 'Should return array');
    assertEq(durations.length, 4, 'Should have 4 durations');
    assertEq(durations[0], 100, 'CROUCH duration');
    assertEq(durations[1], 200, 'TAKEOFF duration');
    assertEq(durations[2], 70, 'FLIGHT duration (from config)');
    assertEq(durations[3], 200, 'LANDING duration');
});

// ===========================
// Phase Transition Tests
// ===========================

test('getNextHopPhase transitions 0 → 1', () => {
    assertEq(getNextHopPhase(0), 1, 'CROUCH → TAKEOFF');
});

test('getNextHopPhase transitions 1 → 2', () => {
    assertEq(getNextHopPhase(1), 2, 'TAKEOFF → FLIGHT');
});

test('getNextHopPhase transitions 2 → 3', () => {
    assertEq(getNextHopPhase(2), 3, 'FLIGHT → LANDING');
});

test('getNextHopPhase transitions 3 → 0 (wraps)', () => {
    assertEq(getNextHopPhase(3), 0, 'LANDING → CROUCH (wraps)');
});

// ===========================
// Distance Calculation Tests
// ===========================

test('calculateHopDistance returns value in min-max range', () => {
    const config = { hopDistanceMin: 2.0, hopDistanceMax: 4.0 };
    for (let i = 0; i < 10; i++) {
        const distance = calculateHopDistance(config);
        assertRange(distance, 2.0, 4.0, `Hop distance iteration ${i}`);
    }
});

test('calculateHopDistance handles min === max', () => {
    const config = { hopDistanceMin: 3.0, hopDistanceMax: 3.0 };
    const distance = calculateHopDistance(config);
    assertEq(distance, 3.0, 'Distance should be exactly 3.0 when min === max');
});

test('calculateHopTargetX calculates correct target position', () => {
    const config = { hopDistanceMin: 2.0, hopDistanceMax: 2.0 }; // Fixed distance for predictability
    const currentX = 100;
    const bodySize = 50;

    const targetX = calculateHopTargetX(currentX, bodySize, config);
    assertEq(targetX, 200, 'Target X should be currentX + (bodySize * 2.0)');
});

// ===========================
// Crawl Cycles Tests
// ===========================

test('calculateCrawlCycles returns value in min-max range', () => {
    const config = { hopFrequencyMin: 2, hopFrequencyMax: 5 };
    for (let i = 0; i < 10; i++) {
        const cycles = calculateCrawlCycles(config);
        assertRange(cycles, 2, 5, `Crawl cycles iteration ${i}`);
        // Should be an integer
        assertEq(cycles, Math.floor(cycles), `Cycles should be integer (iteration ${i})`);
    }
});

test('calculateCrawlCycles handles min === max', () => {
    const config = { hopFrequencyMin: 3, hopFrequencyMax: 3 };
    const cycles = calculateCrawlCycles(config);
    assertEq(cycles, 3, 'Cycles should be exactly 3 when min === max');
});

test('shouldStartHopping returns true when cycles <= 0', () => {
    assertTrue(shouldStartHopping(0), 'Should start hopping when cycles = 0');
    assertTrue(shouldStartHopping(-1), 'Should start hopping when cycles < 0');
});

test('shouldStartHopping returns false when cycles > 0', () => {
    assertFalse(shouldStartHopping(1), 'Should not start hopping when cycles = 1');
    assertFalse(shouldStartHopping(10), 'Should not start hopping when cycles = 10');
});

// ===========================
// updateHopPhase Tests
// ===========================

test('updateHopPhase increments timer', () => {
    const state = { hopPhase: 0, hopTimer: 50, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 20, 1.0, config);
    assertEq(updated.hopTimer, 70, 'Timer should increment by deltaTime * speedMultiplier');
});

test('updateHopPhase respects speed multiplier', () => {
    const state = { hopPhase: 0, hopTimer: 50, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 20, 2.0, config);
    assertEq(updated.hopTimer, 90, 'Timer should increment by deltaTime * 2.0');
});

test('updateHopPhase calculates hopProgress correctly', () => {
    const state = { hopPhase: 0, hopTimer: 50, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 0, 1.0, config); // No time change
    // CROUCH duration is 100ms, timer is 50ms → progress = 50/100 = 0.5
    assertEq(updated.hopProgress, 0.5, 'Progress should be timer / phaseDuration');
});

test('updateHopPhase transitions to next phase when timer exceeds duration', () => {
    const state = { hopPhase: 0, hopTimer: 90, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 20, 1.0, config); // Timer becomes 110, exceeds 100
    assertEq(updated.hopPhase, 1, 'Should transition to TAKEOFF');
    assertEq(updated.hopTimer, 0, 'Timer should reset');
    assertTrue(updated.phaseChanged, 'phaseChanged flag should be true');
});

test('updateHopPhase does not transition when timer < duration', () => {
    const state = { hopPhase: 0, hopTimer: 50, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 20, 1.0, config); // Timer becomes 70, < 100
    assertEq(updated.hopPhase, 0, 'Should stay in CROUCH');
    assertFalse(updated.phaseChanged, 'phaseChanged flag should be false');
});

test('updateHopPhase transitions LANDING → CRAWL (not CROUCH)', () => {
    const state = { hopPhase: 3, hopTimer: 190, hopProgress: 0, hopStartX: 0, hopTargetX: 0 };
    const config = { hopFlightDuration: 60 };

    const updated = updateHopPhase(state, 20, 1.0, config); // Timer becomes 210, exceeds 200
    assertEq(updated.hopPhase, HOP_PHASE.CRAWL, 'Should transition to CRAWL (4), not CROUCH (0)');
});

// ===========================
// updateCrawlPhase Tests
// ===========================

test('updateCrawlPhase increments timer', () => {
    const state = { crawlPhase: 0, crawlTimer: 50, crawlCyclesRemaining: 3 };
    const config = {};

    const updated = updateCrawlPhase(state, 20, 1.0, config);
    assertEq(updated.crawlTimer, 70, 'Timer should increment by deltaTime * speedMultiplier');
});

test('updateCrawlPhase respects speed multiplier', () => {
    const state = { crawlPhase: 0, crawlTimer: 50, crawlCyclesRemaining: 3 };
    const config = {};

    const updated = updateCrawlPhase(state, 20, 1.5, config);
    assertEq(updated.crawlTimer, 80, 'Timer should increment by deltaTime * 1.5');
});

test('updateCrawlPhase calculates stepProgress correctly', () => {
    const state = { crawlPhase: 0, crawlTimer: 100, crawlCyclesRemaining: 3 };
    const config = {};

    const updated = updateCrawlPhase(state, 0, 1.0, config);
    // Phase 0 duration is 200ms, timer is 100ms → progress = 100/200 = 0.5
    assertEq(updated.stepProgress, 0.5, 'Progress should be timer / phaseDuration');
});

test('updateCrawlPhase transitions to next phase when timer exceeds duration', () => {
    const state = { crawlPhase: 0, crawlTimer: 190, crawlCyclesRemaining: 3 };
    const config = {};

    const updated = updateCrawlPhase(state, 20, 1.0, config); // Timer becomes 210, exceeds 200
    assertEq(updated.crawlPhase, 1, 'Should transition to phase 1');
    assertEq(updated.crawlTimer, 0, 'Timer should reset');
    assertTrue(updated.phaseChanged, 'phaseChanged flag should be true');
});

test('updateCrawlPhase decrements crawlCyclesRemaining when returning to phase 0', () => {
    const state = { crawlPhase: 5, crawlTimer: 90, crawlCyclesRemaining: 3 };
    const config = { hopFrequencyMin: 2, hopFrequencyMax: 5 };

    const updated = updateCrawlPhase(state, 20, 1.0, config); // Timer becomes 110, exceeds 100 → phase 0
    assertEq(updated.crawlPhase, 0, 'Should wrap to phase 0');
    assertEq(updated.crawlCyclesRemaining, 2, 'Should decrement cycles remaining');
});

test('updateCrawlPhase sets shouldTransitionToHop when cycles reach 0', () => {
    const state = { crawlPhase: 5, crawlTimer: 90, crawlCyclesRemaining: 1 };
    const config = { hopFrequencyMin: 2, hopFrequencyMax: 5 };

    const updated = updateCrawlPhase(state, 20, 1.0, config); // Timer becomes 110, cycles become 0
    assertTrue(updated.shouldTransitionToHop, 'Should signal transition to hop');
    assertRange(updated.crawlCyclesRemaining, 2, 5, 'Should reset to new random cycles');
});

test('updateCrawlPhase does not decrement cycles mid-cycle', () => {
    const state = { crawlPhase: 3, crawlTimer: 190, crawlCyclesRemaining: 3 };
    const config = {};

    const updated = updateCrawlPhase(state, 20, 1.0, config); // Phase 3 → 4, not completing cycle
    assertEq(updated.crawlPhase, 4, 'Should transition to phase 4');
    assertEq(updated.crawlCyclesRemaining, 3, 'Should not decrement cycles (mid-cycle)');
    assertFalse(updated.shouldTransitionToHop, 'Should not transition to hop');
});

// ===========================
// Helper Function Tests
// ===========================

test('isFlightPhase returns true for FLIGHT phase', () => {
    assertTrue(isFlightPhase(HOP_PHASE.FLIGHT), 'Should be true for FLIGHT (2)');
});

test('isFlightPhase returns false for other phases', () => {
    assertFalse(isFlightPhase(HOP_PHASE.CROUCH), 'Should be false for CROUCH');
    assertFalse(isFlightPhase(HOP_PHASE.TAKEOFF), 'Should be false for TAKEOFF');
    assertFalse(isFlightPhase(HOP_PHASE.LANDING), 'Should be false for LANDING');
    assertFalse(isFlightPhase(HOP_PHASE.CRAWL), 'Should be false for CRAWL');
});

test('isCrawlMode returns true for CRAWL phase', () => {
    assertTrue(isCrawlMode(HOP_PHASE.CRAWL), 'Should be true for CRAWL (4)');
});

test('isCrawlMode returns false for other phases', () => {
    assertFalse(isCrawlMode(HOP_PHASE.CROUCH), 'Should be false for CROUCH');
    assertFalse(isCrawlMode(HOP_PHASE.TAKEOFF), 'Should be false for TAKEOFF');
    assertFalse(isCrawlMode(HOP_PHASE.FLIGHT), 'Should be false for FLIGHT');
    assertFalse(isCrawlMode(HOP_PHASE.LANDING), 'Should be false for LANDING');
});

test('getCrawlPhaseDurations returns array of 6 durations', () => {
    const durations = getCrawlPhaseDurations();
    assertTrue(Array.isArray(durations), 'Should return array');
    assertEq(durations.length, 6, 'Should have 6 durations');
    assertEq(durations[0], 200, 'Phase 0 duration');
    assertEq(durations[1], 150, 'Phase 1 duration');
    assertEq(durations[2], 100, 'Phase 2 duration');
    assertEq(durations[3], 200, 'Phase 3 duration');
    assertEq(durations[4], 150, 'Phase 4 duration');
    assertEq(durations[5], 100, 'Phase 5 duration');
});

test('isLegSwingingInCrawl detects group A swing (phase 0)', () => {
    assertTrue(isLegSwingingInCrawl('A', 0), 'Group A should swing in phase 0');
    assertFalse(isLegSwingingInCrawl('B', 0), 'Group B should not swing in phase 0');
});

test('isLegSwingingInCrawl detects group B swing (phase 3)', () => {
    assertTrue(isLegSwingingInCrawl('B', 3), 'Group B should swing in phase 3');
    assertFalse(isLegSwingingInCrawl('A', 3), 'Group A should not swing in phase 3');
});

test('isLegSwingingInCrawl returns false for non-swing phases', () => {
    assertFalse(isLegSwingingInCrawl('A', 1), 'Group A should not swing in phase 1');
    assertFalse(isLegSwingingInCrawl('A', 2), 'Group A should not swing in phase 2');
    assertFalse(isLegSwingingInCrawl('B', 1), 'Group B should not swing in phase 1');
    assertFalse(isLegSwingingInCrawl('B', 2), 'Group B should not swing in phase 2');
});

test('isCrawlLurchPhase detects lurch phases (1 and 4)', () => {
    assertTrue(isCrawlLurchPhase(1), 'Phase 1 should be lurch');
    assertTrue(isCrawlLurchPhase(4), 'Phase 4 should be lurch');
});

test('isCrawlLurchPhase returns false for non-lurch phases', () => {
    assertFalse(isCrawlLurchPhase(0), 'Phase 0 should not be lurch');
    assertFalse(isCrawlLurchPhase(2), 'Phase 2 should not be lurch');
    assertFalse(isCrawlLurchPhase(3), 'Phase 3 should not be lurch');
    assertFalse(isCrawlLurchPhase(5), 'Phase 5 should not be lurch');
});

// ===========================
// Initial State Tests
// ===========================

test('createInitialHoppingState creates valid state', () => {
    const config = { hopFrequencyMin: 2, hopFrequencyMax: 5, hopFlightDuration: 60 };
    const state = createInitialHoppingState(config, 800);

    assertTrue(typeof state.hopPhase === 'number', 'hopPhase should be a number');
    assertRange(state.hopPhase, 0, 4, 'hopPhase should be 0-4');

    assertTrue(typeof state.hopTimer === 'number', 'hopTimer should be a number');
    assertRange(state.hopTimer, 0, 200, 'hopTimer should be reasonable');

    assertEq(state.hopProgress, 0, 'hopProgress should start at 0');
    assertEq(state.hopStartX, 0, 'hopStartX should start at 0');
    assertEq(state.hopTargetX, 0, 'hopTargetX should start at 0');

    assertEq(state.crawlPhase, 0, 'crawlPhase should start at 0');
    assertEq(state.crawlTimer, 0, 'crawlTimer should start at 0');

    assertRange(state.crawlCyclesRemaining, 2, 5, 'crawlCyclesRemaining should be in range');
});

// ===========================
// Summary
// ===========================

console.log(`\n${testsPassed}/${testsRun} tests passed\n`);

if (testsPassed !== testsRun) {
    console.log('❌ Some hopping logic tests failed');
    process.exit(1);
} else {
    console.log('✅ All hopping logic tests passed');
    process.exit(0);
}
