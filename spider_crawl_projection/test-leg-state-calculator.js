/**
 * Tests for leg-state-calculator.js
 *
 * Tests hop phase calculations for leg positioning during hopping animation.
 * Target: 95%+ coverage
 */

const {
    calculateLegHopState,
    applyLegSmoothing,
    getPhaseConfig,
    isBackLeg,
    getLegReachFactor
} = require('./leg-state-calculator.js');

console.log("\n=== LEG STATE CALCULATOR TESTS ===\n");

let passed = 0;
let failed = 0;

function test(name, condition) {
    if (condition) {
        console.log(`✓ PASS: ${name}`);
        passed++;
    } else {
        console.log(`✗ FAIL: ${name}`);
        failed++;
    }
}

function almostEqual(a, b, epsilon = 0.0001) {
    return Math.abs(a - b) < epsilon;
}

// ===== isBackLeg Tests =====
console.log("\n--- isBackLeg Tests ---");
test("front leg 0 returns false", isBackLeg(0) === false);
test("front leg 1 returns false", isBackLeg(1) === false);
test("front leg 2 returns false", isBackLeg(2) === false);
test("front leg 3 returns false", isBackLeg(3) === false);
test("back leg 4 returns true", isBackLeg(4) === true);
test("back leg 5 returns true", isBackLeg(5) === true);
test("back leg 6 returns true", isBackLeg(6) === true);
test("back leg 7 returns true", isBackLeg(7) === true);

// ===== getPhaseConfig Tests =====
console.log("\n--- getPhaseConfig Tests ---");
const crouchConfig = getPhaseConfig(0);
test("CROUCH phase name is 'CROUCH'", crouchConfig.name === 'CROUCH');
test("CROUCH backFactor is 0.8", crouchConfig.backFactor === 0.8);
test("CROUCH frontFactor is 0.8", crouchConfig.frontFactor === 0.8);
test("CROUCH smoothing is 0.3", crouchConfig.smoothing === 0.3);

const takeoffConfig = getPhaseConfig(1);
test("TAKEOFF phase name is 'TAKEOFF'", takeoffConfig.name === 'TAKEOFF');
test("TAKEOFF backFactor is 1.2", takeoffConfig.backFactor === 1.2);
test("TAKEOFF frontFactor is 0.5", takeoffConfig.frontFactor === 0.5);
test("TAKEOFF smoothing is 0.5", takeoffConfig.smoothing === 0.5);

const flightConfig = getPhaseConfig(2);
test("FLIGHT phase name is 'FLIGHT'", flightConfig.name === 'FLIGHT');
test("FLIGHT backFactor is 0.4", flightConfig.backFactor === 0.4);
test("FLIGHT frontFactor is 0.4", flightConfig.frontFactor === 0.4);
test("FLIGHT smoothing is 1.0", flightConfig.smoothing === 1.0);

const landingConfig = getPhaseConfig(3);
test("LANDING phase name is 'LANDING'", landingConfig.name === 'LANDING');
test("LANDING backFactor is 0.9", landingConfig.backFactor === 0.9);
test("LANDING frontFactor is 1.1", landingConfig.frontFactor === 1.1);
test("LANDING smoothing is 0.4", landingConfig.smoothing === 0.4);

const pauseConfig = getPhaseConfig(4);
test("PAUSE phase name is 'PAUSE'", pauseConfig.name === 'PAUSE');
test("PAUSE backFactor is 1.0", pauseConfig.backFactor === 1.0);
test("PAUSE frontFactor is 1.0", pauseConfig.frontFactor === 1.0);
test("PAUSE smoothing is 0.2", pauseConfig.smoothing === 0.2);

const invalidConfig = getPhaseConfig(99);
test("invalid phase (99) defaults to PAUSE", invalidConfig.name === 'PAUSE');

const negativeConfig = getPhaseConfig(-1);
test("negative phase (-1) defaults to PAUSE", negativeConfig.name === 'PAUSE');

// ===== getLegReachFactor Tests =====
console.log("\n--- getLegReachFactor Tests ---");
test("CROUCH front leg factor is 0.8", getLegReachFactor(0, false) === 0.8);
test("CROUCH back leg factor is 0.8", getLegReachFactor(0, true) === 0.8);
test("TAKEOFF back leg factor is 1.2", getLegReachFactor(1, true) === 1.2);
test("TAKEOFF front leg factor is 0.5", getLegReachFactor(1, false) === 0.5);
test("FLIGHT front leg factor is 0.4", getLegReachFactor(2, false) === 0.4);
test("FLIGHT back leg factor is 0.4", getLegReachFactor(2, true) === 0.4);
test("LANDING front leg factor is 1.1", getLegReachFactor(3, false) === 1.1);
test("LANDING back leg factor is 0.9", getLegReachFactor(3, true) === 0.9);
test("PAUSE front leg factor is 1.0", getLegReachFactor(4, false) === 1.0);
test("PAUSE back leg factor is 1.0", getLegReachFactor(4, true) === 1.0);

// ===== applyLegSmoothing Tests =====
console.log("\n--- applyLegSmoothing Tests ---");
let result;

result = applyLegSmoothing(100, 50, 200, 150, 0);
test("smoothing 0 keeps current position X", result.x === 100);
test("smoothing 0 keeps current position Y", result.y === 50);

result = applyLegSmoothing(100, 50, 200, 150, 1.0);
test("smoothing 1.0 reaches target X", result.x === 200);
test("smoothing 1.0 reaches target Y", result.y === 150);

result = applyLegSmoothing(100, 50, 200, 150, 0.5);
test("smoothing 0.5 reaches halfway X", result.x === 150);
test("smoothing 0.5 reaches halfway Y", result.y === 100);

result = applyLegSmoothing(0, 0, 100, 100, 0.3);
test("smoothing 0.3 moves 30% towards target X", result.x === 30);
test("smoothing 0.3 moves 30% towards target Y", result.y === 30);

result = applyLegSmoothing(-100, -50, 0, 0, 0.5);
test("handles negative positions X", result.x === -50);
test("handles negative positions Y", result.y === -25);

result = applyLegSmoothing(200, 150, 100, 50, 0.5);
test("smoothing works in reverse direction X", result.x === 150);
test("smoothing works in reverse direction Y", result.y === 100);

// ===== calculateLegHopState Tests =====
console.log("\n--- calculateLegHopState Tests ---");
const relativePos = { x: 100, y: 50 };
const bodyX = 500;
const bodyY = 300;
const bodySize = 100;

// CROUCH phase
let state = calculateLegHopState(0, 1, relativePos, bodyX, bodyY, bodySize);
test("CROUCH front leg targetX correct", state.targetX === bodyX + 100 * 0.8);
test("CROUCH front leg targetY correct", state.targetY === bodyY + 50 * 0.8);
test("CROUCH front leg smoothing is 0.3", state.smoothing === 0.3);
test("CROUCH front leg isBackLeg false", state.isBackLeg === false);
test("CROUCH front leg factor is 0.8", state.factor === 0.8);

state = calculateLegHopState(0, 5, relativePos, bodyX, bodyY, bodySize);
test("CROUCH back leg targetX correct", state.targetX === bodyX + 100 * 0.8);
test("CROUCH back leg isBackLeg true", state.isBackLeg === true);

// TAKEOFF phase
state = calculateLegHopState(1, 6, relativePos, bodyX, bodyY, bodySize);
test("TAKEOFF back leg targetX correct", state.targetX === bodyX + 100 * 1.2);
test("TAKEOFF back leg targetY correct", state.targetY === bodyY + 50 * 1.2);
test("TAKEOFF back leg smoothing is 0.5", state.smoothing === 0.5);
test("TAKEOFF back leg factor is 1.2", state.factor === 1.2);

state = calculateLegHopState(1, 2, relativePos, bodyX, bodyY, bodySize);
test("TAKEOFF front leg targetX correct", state.targetX === bodyX + 100 * 0.5);
test("TAKEOFF front leg factor is 0.5", state.factor === 0.5);

// FLIGHT phase
state = calculateLegHopState(2, 0, relativePos, bodyX, bodyY, bodySize);
test("FLIGHT front leg targetX correct", state.targetX === bodyX + 100 * 0.4);
test("FLIGHT front leg smoothing is 1.0", state.smoothing === 1.0);

state = calculateLegHopState(2, 4, relativePos, bodyX, bodyY, bodySize);
test("FLIGHT back leg targetX correct", state.targetX === bodyX + 100 * 0.4);
test("FLIGHT back leg smoothing is 1.0", state.smoothing === 1.0);

// LANDING phase
state = calculateLegHopState(3, 1, relativePos, bodyX, bodyY, bodySize);
test("LANDING front leg targetX correct", state.targetX === bodyX + 100 * 1.1);
test("LANDING front leg targetY correct", state.targetY === bodyY + 50 * 1.1);
test("LANDING front leg smoothing is 0.6", state.smoothing === 0.6);
test("LANDING front leg factor is 1.1", state.factor === 1.1);

state = calculateLegHopState(3, 7, relativePos, bodyX, bodyY, bodySize);
test("LANDING back leg targetX correct", state.targetX === bodyX + 100 * 0.9);
test("LANDING back leg smoothing is 0.4", state.smoothing === 0.4);
test("LANDING back leg factor is 0.9", state.factor === 0.9);

// PAUSE phase
state = calculateLegHopState(4, 2, relativePos, bodyX, bodyY, bodySize);
test("PAUSE front leg targetX correct", state.targetX === bodyX + 100 * 1.0);
test("PAUSE front leg smoothing is 0.2", state.smoothing === 0.2);

state = calculateLegHopState(4, 5, relativePos, bodyX, bodyY, bodySize);
test("PAUSE back leg targetX correct", state.targetX === bodyX + 100 * 1.0);
test("PAUSE back leg smoothing is 0.2", state.smoothing === 0.2);

// Body size scaling
state = calculateLegHopState(4, 0, relativePos, bodyX, bodyY, 200);
test("bodySize 200 doubles leg reach X", state.targetX === bodyX + 100 * 2.0 * 1.0);
test("bodySize 200 doubles leg reach Y", state.targetY === bodyY + 50 * 2.0 * 1.0);

state = calculateLegHopState(4, 0, relativePos, bodyX, bodyY, 50);
test("bodySize 50 halves leg reach X", state.targetX === bodyX + 100 * 0.5 * 1.0);
test("bodySize 50 halves leg reach Y", state.targetY === bodyY + 50 * 0.5 * 1.0);

// Negative positions
const negPosX = { x: -100, y: 50 };
state = calculateLegHopState(4, 0, negPosX, bodyX, bodyY, bodySize);
test("handles negative X positions", state.targetX === bodyX - 100 * 1.0);

const negPosY = { x: 100, y: -50 };
state = calculateLegHopState(4, 0, negPosY, bodyX, bodyY, bodySize);
test("handles negative Y positions", state.targetY === bodyY - 50 * 1.0);

// Invalid phase
state = calculateLegHopState(99, 0, relativePos, bodyX, bodyY, bodySize);
test("invalid phase defaults to PAUSE factor", state.factor === 1.0);
test("invalid phase defaults to PAUSE smoothing", state.smoothing === 0.2);

// ===== Summary =====
console.log("\n" + "=".repeat(60));
console.log(`TOTAL: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
if (failed === 0) {
    console.log("✓✓✓ ALL TESTS PASSED! ✓✓✓");
    process.exit(0);
} else {
    console.log("✗✗✗ SOME TESTS FAILED ✗✗✗");
    process.exit(1);
}
