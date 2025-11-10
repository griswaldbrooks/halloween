#!/usr/bin/env node

/**
 * Unit tests for gait-state-machine.js
 *
 * Tests the gait phase transition logic and timing for procedural spider crawling.
 * Phase 3A of coverage improvement plan.
 */

const GaitStateMachine = require('./gait-state-machine.js');

console.log("\n=== GAIT STATE MACHINE TESTS ===\n");

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✓ ${name}`);
        passed++;
    } catch (error) {
        console.log(`✗ ${name}`);
        console.log(`  ${error.message}`);
        failed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

function assertAlmostEqual(actual, expected, tolerance = 0.001, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(message || `Expected ${expected} ± ${tolerance}, got ${actual}`);
    }
}

function assertArrayEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
}

// Phase Durations Tests
test('PHASE_DURATIONS has 6 phases', () => {
    assertEqual(GaitStateMachine.PHASE_DURATIONS.length, 6);
});

test('PHASE_DURATIONS contains expected values', () => {
    assertArrayEqual(GaitStateMachine.PHASE_DURATIONS, [200, 150, 100, 200, 150, 100]);
});

test('getGaitPhaseDuration returns correct duration for phase 0', () => {
    assertEqual(GaitStateMachine.getGaitPhaseDuration(0), 200);
});

test('getGaitPhaseDuration returns correct duration for phase 1', () => {
    assertEqual(GaitStateMachine.getGaitPhaseDuration(1), 150);
});

test('getGaitPhaseDuration returns correct duration for phase 5', () => {
    assertEqual(GaitStateMachine.getGaitPhaseDuration(5), 100);
});

test('getGaitPhaseDuration handles negative phase gracefully', () => {
    assertEqual(GaitStateMachine.getGaitPhaseDuration(-1), 200); // Default to first phase
});

test('getGaitPhaseDuration handles out-of-bounds phase gracefully', () => {
    assertEqual(GaitStateMachine.getGaitPhaseDuration(10), 200); // Default to first phase
});

test('getAllPhaseDurations returns copy of phase durations', () => {
    const durations = GaitStateMachine.getAllPhaseDurations();
    assertArrayEqual(durations, [200, 150, 100, 200, 150, 100]);
});

test('getAllPhaseDurations returns a new array (not reference)', () => {
    const durations1 = GaitStateMachine.getAllPhaseDurations();
    const durations2 = GaitStateMachine.getAllPhaseDurations();
    assert(durations1 !== durations2);
});

// Phase Transitions Tests
test('getNextGaitPhase transitions from 0 to 1', () => {
    assertEqual(GaitStateMachine.getNextGaitPhase(0), 1);
});

test('getNextGaitPhase transitions from 4 to 5', () => {
    assertEqual(GaitStateMachine.getNextGaitPhase(4), 5);
});

test('getNextGaitPhase wraps from 5 to 0', () => {
    assertEqual(GaitStateMachine.getNextGaitPhase(5), 0);
});

test('getNextGaitPhase handles all phases in cycle', () => {
    let phase = 0;
    for (let i = 0; i < 6; i++) {
        const next = GaitStateMachine.getNextGaitPhase(phase);
        assertEqual(next, (phase + 1) % 6);
        phase = next;
    }
    assertEqual(phase, 0); // Full cycle
});

// Step Progress Tests
test('calculateStepProgress returns 0 at start of phase', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(0, 200), 0);
});

test('calculateStepProgress returns 0.5 at midpoint', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(100, 200), 0.5);
});

test('calculateStepProgress returns 1.0 at end of phase', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(200, 200), 1.0);
});

test('calculateStepProgress clamps to 1.0 when over duration', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(250, 200), 1.0);
});

test('calculateStepProgress returns 0 when phase duration is 0', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(100, 0), 0);
});

test('calculateStepProgress returns 0 when phase duration is negative', () => {
    assertEqual(GaitStateMachine.calculateStepProgress(100, -10), 0);
});

test('calculateStepProgress handles fractional progress', () => {
    assertAlmostEqual(GaitStateMachine.calculateStepProgress(75, 200), 0.375);
});

// State Updates Tests
test('updateGaitState increments timer when not at phase end', () => {
    const state = { gaitPhase: 0, gaitTimer: 50, stepProgress: 0.25 };
    const result = GaitStateMachine.updateGaitState(state, 30, 1.0);

    assertEqual(result.gaitPhase, 0);
    assertEqual(result.gaitTimer, 80);
    assertEqual(result.phaseChanged, false);
});

test('updateGaitState transitions phase when timer exceeds duration', () => {
    const state = { gaitPhase: 0, gaitTimer: 190, stepProgress: 0.95 };
    const result = GaitStateMachine.updateGaitState(state, 15, 1.0);

    assertEqual(result.gaitPhase, 1);
    assertEqual(result.gaitTimer, 0);
    assertEqual(result.phaseChanged, true);
});

test('updateGaitState wraps from phase 5 to phase 0', () => {
    const state = { gaitPhase: 5, gaitTimer: 95, stepProgress: 0.95 };
    const result = GaitStateMachine.updateGaitState(state, 10, 1.0);

    assertEqual(result.gaitPhase, 0);
    assertEqual(result.gaitTimer, 0);
    assertEqual(result.phaseChanged, true);
});

test('updateGaitState calculates correct step progress', () => {
    const state = { gaitPhase: 0, gaitTimer: 0, stepProgress: 0 };
    const result = GaitStateMachine.updateGaitState(state, 100, 1.0);

    assertEqual(result.stepProgress, 0.5); // 100/200 = 0.5
});

test('updateGaitState respects speed multiplier', () => {
    const state = { gaitPhase: 0, gaitTimer: 0, stepProgress: 0 };
    const result = GaitStateMachine.updateGaitState(state, 50, 2.0);

    assertEqual(result.gaitTimer, 100); // 50 * 2.0 = 100
    assertEqual(result.stepProgress, 0.5); // 100/200
});

test('updateGaitState with speed 0.5 slows animation', () => {
    const state = { gaitPhase: 0, gaitTimer: 0, stepProgress: 0 };
    const result = GaitStateMachine.updateGaitState(state, 100, 0.5);

    assertEqual(result.gaitTimer, 50); // 100 * 0.5
    assertEqual(result.stepProgress, 0.25); // 50/200
});

test('updateGaitState transitions through multiple phases', () => {
    let state = { gaitPhase: 0, gaitTimer: 0, stepProgress: 0 };

    // Phase 0 → 1
    state = GaitStateMachine.updateGaitState(state, 200, 1.0);
    assertEqual(state.gaitPhase, 1);

    // Phase 1 → 2
    state = GaitStateMachine.updateGaitState(state, 150, 1.0);
    assertEqual(state.gaitPhase, 2);

    // Phase 2 → 3
    state = GaitStateMachine.updateGaitState(state, 100, 1.0);
    assertEqual(state.gaitPhase, 3);
});

// Lurch Phase Detection Tests
test('isLurchPhase returns true for phase 1', () => {
    assertEqual(GaitStateMachine.isLurchPhase(1), true);
});

test('isLurchPhase returns true for phase 4', () => {
    assertEqual(GaitStateMachine.isLurchPhase(4), true);
});

test('isLurchPhase returns false for phase 0', () => {
    assertEqual(GaitStateMachine.isLurchPhase(0), false);
});

test('isLurchPhase returns false for phase 2', () => {
    assertEqual(GaitStateMachine.isLurchPhase(2), false);
});

test('isLurchPhase returns false for phase 3', () => {
    assertEqual(GaitStateMachine.isLurchPhase(3), false);
});

test('isLurchPhase returns false for phase 5', () => {
    assertEqual(GaitStateMachine.isLurchPhase(5), false);
});

// Lurch Speed Calculation Tests
test('calculateLurchSpeed returns correct speed for bodySize 100', () => {
    const bodySize = 100;
    const phaseDuration = 150;
    const expectedSpeed = (bodySize * 0.4) / phaseDuration; // 40 / 150

    assertAlmostEqual(GaitStateMachine.calculateLurchSpeed(bodySize, phaseDuration), expectedSpeed);
});

test('calculateLurchSpeed scales with body size', () => {
    const speed1 = GaitStateMachine.calculateLurchSpeed(50, 150);
    const speed2 = GaitStateMachine.calculateLurchSpeed(100, 150);

    assertAlmostEqual(speed2, speed1 * 2);
});

test('calculateLurchSpeed inversely scales with duration', () => {
    const speed1 = GaitStateMachine.calculateLurchSpeed(100, 100);
    const speed2 = GaitStateMachine.calculateLurchSpeed(100, 200);

    assertAlmostEqual(speed1, speed2 * 2);
});

test('calculateLurchSpeed handles large body sizes', () => {
    const speed = GaitStateMachine.calculateLurchSpeed(500, 150);
    assertAlmostEqual(speed, (500 * 0.4) / 150);
});

test('calculateLurchSpeed handles small body sizes', () => {
    const speed = GaitStateMachine.calculateLurchSpeed(10, 150);
    assertAlmostEqual(speed, (10 * 0.4) / 150);
});

// Initial State Creation Tests
test('createInitialGaitState creates state at phase 0 by default', () => {
    const state = GaitStateMachine.createInitialGaitState();
    assertEqual(state.gaitPhase, 0);
    assertEqual(state.gaitTimer, 0);
    assertEqual(state.stepProgress, 0);
});

test('createInitialGaitState accepts custom initial phase', () => {
    const state = GaitStateMachine.createInitialGaitState(3);
    assertEqual(state.gaitPhase, 3);
    assertEqual(state.gaitTimer, 0);
    assertEqual(state.stepProgress, 0);
});

test('createInitialGaitState has all required properties', () => {
    const state = GaitStateMachine.createInitialGaitState();
    assert(state.hasOwnProperty('gaitPhase'));
    assert(state.hasOwnProperty('gaitTimer'));
    assert(state.hasOwnProperty('stepProgress'));
});

// Integration Tests
test('full gait cycle completes in expected time', () => {
    let state = GaitStateMachine.createInitialGaitState();

    // Simulate full cycle by going through each phase
    for (let i = 0; i < 6; i++) {
        const duration = GaitStateMachine.getGaitPhaseDuration(state.gaitPhase);
        state = GaitStateMachine.updateGaitState(state, duration, 1.0);
    }

    // After 6 phases, should wrap back to phase 0
    assertEqual(state.gaitPhase, 0);
});

test('lurch phases occur at correct intervals', () => {
    let state = GaitStateMachine.createInitialGaitState();
    const lurchPhases = [];

    // Simulate one complete cycle
    for (let step = 0; step < 6; step++) {
        const duration = GaitStateMachine.getGaitPhaseDuration(state.gaitPhase);
        if (GaitStateMachine.isLurchPhase(state.gaitPhase)) {
            lurchPhases.push(state.gaitPhase);
        }
        state = GaitStateMachine.updateGaitState(state, duration, 1.0);
    }

    assertArrayEqual(lurchPhases, [1, 4]);
});

test('step progress resets correctly on phase transitions', () => {
    let state = { gaitPhase: 0, gaitTimer: 190, stepProgress: 0.95 };

    // Transition to next phase
    state = GaitStateMachine.updateGaitState(state, 20, 1.0);

    // Should be at start of new phase
    assertEqual(state.gaitPhase, 1);
    assertEqual(state.stepProgress, 0); // Timer is 0, so progress is 0
});

// Summary
const total = passed + failed;
console.log(`\n${passed}/${total} tests passed`);

if (failed > 0) {
    console.log(`\n❌ ${failed} test(s) failed`);
    process.exit(1);
} else {
    console.log('\n✅ All gait state machine tests passed!');
    process.exit(0);
}
