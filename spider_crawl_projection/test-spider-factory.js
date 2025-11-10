/**
 * Tests for spider-factory.js
 * Phase 5C: Spider creation and initialization logic
 */

const {
    calculateSpeedMultiplier,
    calculateBodySize,
    assignLegGroups,
    getElbowBiasPattern,
    createInitialSpiderState
} = require('./spider-factory.js');

console.log("\n=== SPIDER FACTORY TESTS ===\n");

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

function approxEqual(a, b, tolerance = 0.0001) {
    return Math.abs(a - b) < tolerance;
}

// calculateSpeedMultiplier tests
console.log("\n--- calculateSpeedMultiplier ---");

// With 0 variation, all spiders should have base speed
const speed1 = calculateSpeedMultiplier(1.0, 0);
test("0 variation returns base speed", speed1 === 1.0);

const speed2 = calculateSpeedMultiplier(2.0, 0);
test("0 variation with different base speed", speed2 === 2.0);

// With 1.0 variation, speed should vary between 0.5x and 1.5x base
const speeds = [];
for (let i = 0; i < 100; i++) {
    speeds.push(calculateSpeedMultiplier(1.0, 1.0));
}
const minSpeed = Math.min(...speeds);
const maxSpeed = Math.max(...speeds);
test("1.0 variation creates range of speeds", minSpeed >= 0.4 && maxSpeed <= 1.6);
test("1.0 variation speeds vary (not all same)", new Set(speeds).size > 10);

// With 0.5 variation
const speeds05 = [];
for (let i = 0; i < 100; i++) {
    speeds05.push(calculateSpeedMultiplier(1.0, 0.5));
}
const minSpeed05 = Math.min(...speeds05);
const maxSpeed05 = Math.max(...speeds05);
test("0.5 variation creates narrower range", minSpeed05 >= 0.65 && maxSpeed05 <= 1.35);

// Different base speeds
const fastSpeeds = [];
for (let i = 0; i < 100; i++) {
    fastSpeeds.push(calculateSpeedMultiplier(3.0, 0.5));
}
const avgFastSpeed = fastSpeeds.reduce((a, b) => a + b, 0) / fastSpeeds.length;
test("higher base speed produces higher average", avgFastSpeed > 2.5 && avgFastSpeed < 3.5);

// calculateBodySize tests
console.log("\n--- calculateBodySize ---");

// With 0 variation, all spiders should be same size (average)
const size1 = calculateBodySize(100, 200, 0);
test("0 variation returns consistent size", size1 >= (8 + 0) * 150 && size1 <= (8 + 8) * 150);

// Multiple samples with 0 variation should all be in same range
const sizes0 = [];
for (let i = 0; i < 50; i++) {
    sizes0.push(calculateBodySize(100, 200, 0));
}
const avgSize0 = sizes0.reduce((a, b) => a + b, 0) / sizes0.length;
const expectedAvg0 = 12 * 150; // (8 + 4) * 150 average, where 4 is avg of random 0-8
test("0 variation produces predictable average", Math.abs(avgSize0 - expectedAvg0) < 600);

// With 1.0 variation, size should vary between min and max
const sizes1 = [];
for (let i = 0; i < 100; i++) {
    sizes1.push(calculateBodySize(100, 300, 1.0));
}
test("1.0 variation creates range of sizes", new Set(sizes1.map(s => Math.floor(s / 10))).size > 15);

// With 0.5 variation
const sizes05 = [];
for (let i = 0; i < 100; i++) {
    sizes05.push(calculateBodySize(100, 300, 0.5));
}
const spread05 = Math.max(...sizes05) - Math.min(...sizes05);
const spread1 = Math.max(...sizes1) - Math.min(...sizes1);
test("0.5 variation creates narrower spread than 1.0", spread05 < spread1);

// Different size ranges
const smallSizes = [];
for (let i = 0; i < 50; i++) {
    smallSizes.push(calculateBodySize(50, 100, 0.5));
}
const largeSizes = [];
for (let i = 0; i < 50; i++) {
    largeSizes.push(calculateBodySize(200, 300, 0.5));
}
const avgSmall = smallSizes.reduce((a, b) => a + b, 0) / smallSizes.length;
const avgLarge = largeSizes.reduce((a, b) => a + b, 0) / largeSizes.length;
test("size range affects output", avgLarge > avgSmall * 2);

// assignLegGroups tests
console.log("\n--- assignLegGroups ---");

const groups = assignLegGroups(8);
test("returns array of 8 groups", groups.length === 8);
test("leg 0 is in group B", groups[0] === 'B');
test("leg 1 is in group A", groups[1] === 'A');
test("leg 2 is in group A", groups[2] === 'A');
test("leg 3 is in group B", groups[3] === 'B');
test("leg 4 is in group B", groups[4] === 'B');
test("leg 5 is in group A", groups[5] === 'A');
test("leg 6 is in group A", groups[6] === 'A');
test("leg 7 is in group B", groups[7] === 'B');

const groupsCounts = groups.reduce((acc, g) => {
    acc[g] = (acc[g] || 0) + 1;
    return acc;
}, {});
test("has 4 legs in group A", groupsCounts['A'] === 4);
test("has 4 legs in group B", groupsCounts['B'] === 4);

// getElbowBiasPattern tests
console.log("\n--- getElbowBiasPattern ---");

const elbowBias = getElbowBiasPattern(8);
test("returns array of 8 biases", elbowBias.length === 8);
test("leg 0 bias is -1", elbowBias[0] === -1);
test("leg 1 bias is 1", elbowBias[1] === 1);
test("leg 2 bias is -1", elbowBias[2] === -1);
test("leg 3 bias is 1", elbowBias[3] === 1);
test("leg 4 bias is 1", elbowBias[4] === 1);
test("leg 5 bias is -1", elbowBias[5] === -1);
test("leg 6 bias is 1", elbowBias[6] === 1);
test("leg 7 bias is -1", elbowBias[7] === -1);

const biasCounts = elbowBias.reduce((acc, b) => {
    acc[b] = (acc[b] || 0) + 1;
    return acc;
}, {});
test("has 4 legs with bias -1", biasCounts[-1] === 4);
test("has 4 legs with bias 1", biasCounts[1] === 4);

// createInitialSpiderState tests
console.log("\n--- createInitialSpiderState ---");

const config = {
    spiderSpeed: 1.5,
    speedVariation: 0.5,
    spiderSizeMin: 100,
    spiderSizeMax: 200,
    sizeVariation: 0.5,
    hopFrequencyMin: 2,
    hopFrequencyMax: 5,
    hopDistanceMin: 100,
    hopDistanceMax: 300
};

const state = createInitialSpiderState(0, config, 600);

test("state has index", state.index === 0);
test("state has x position", typeof state.x === 'number');
test("state has y position", typeof state.y === 'number');
test("state has vy velocity", typeof state.vy === 'number');
test("state has speedMultiplier", typeof state.speedMultiplier === 'number');
test("state has bodySize", typeof state.bodySize === 'number');
test("state has gaitPhase", typeof state.gaitPhase === 'number');
test("state has gaitTimer", typeof state.gaitTimer === 'number');
test("state has stepProgress", typeof state.stepProgress === 'number');
test("state has hopPhase", typeof state.hopPhase === 'number');
test("state has hopTimer", typeof state.hopTimer === 'number');
test("state has crawlPhase", typeof state.crawlPhase === 'number');
test("state has crawlTimer", typeof state.crawlTimer === 'number');
test("state has crawlCyclesRemaining", typeof state.crawlCyclesRemaining === 'number');
test("state has hopStartX", typeof state.hopStartX === 'number');
test("state has hopTargetX", typeof state.hopTargetX === 'number');

test("spider starts at x = -50", state.x === -50);
test("y position is within canvas height", state.y >= 0 && state.y <= 600);
test("vy velocity is small", Math.abs(state.vy) < 0.2);

test("speedMultiplier in reasonable range", state.speedMultiplier > 0.5 && state.speedMultiplier < 2.5);
test("bodySize in reasonable range", state.bodySize > 500 && state.bodySize < 3000);

test("gaitPhase starts at 0", state.gaitPhase === 0);
test("gaitTimer starts at 0", state.gaitTimer === 0);
test("stepProgress starts at 0", state.stepProgress === 0);

test("hopPhase starts at 0", state.hopPhase === 0);
test("hopTimer starts at 0", state.hopTimer === 0);
test("crawlPhase starts at 0", state.crawlPhase === 0);
test("crawlTimer starts at 0", state.crawlTimer === 0);

test("crawlCyclesRemaining in config range",
    state.crawlCyclesRemaining >= config.hopFrequencyMin &&
    state.crawlCyclesRemaining <= config.hopFrequencyMax);

test("hopStartX equals initial x", state.hopStartX === state.x);
test("hopTargetX is forward from start", state.hopTargetX > state.hopStartX);
test("hop distance in config range",
    (state.hopTargetX - state.hopStartX) >= config.hopDistanceMin &&
    (state.hopTargetX - state.hopStartX) <= config.hopDistanceMax);

// Test that multiple spiders have different random values
const state1 = createInitialSpiderState(1, config, 600);
const state2 = createInitialSpiderState(2, config, 600);
const state3 = createInitialSpiderState(3, config, 600);

const yPositions = [state.y, state1.y, state2.y, state3.y];
test("spiders have different y positions", new Set(yPositions).size > 1);

const speedMultipliers = [state.speedMultiplier, state1.speedMultiplier, state2.speedMultiplier, state3.speedMultiplier];
test("spiders have different speed multipliers", new Set(speedMultipliers.map(s => Math.floor(s * 100))).size > 1);

const sizes = [state.bodySize, state1.bodySize, state2.bodySize, state3.bodySize];
test("spiders have different body sizes", new Set(sizes.map(s => Math.floor(s / 10))).size > 1);

// Summary
console.log("\n=== SUMMARY ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
    process.exit(1);
}
