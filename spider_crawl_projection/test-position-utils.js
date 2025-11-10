/**
 * Tests for position-utils.js
 * Phase 5D: Leg position initialization logic
 */

const { initializeLegWorldPositions } = require('./position-utils.js');

console.log("\n=== POSITION UTILS TESTS ===\n");

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

// Mock custom foot positions (simplified version)
const mockFootPositions = [
    { x: -30, y: -40 },  // Leg 0
    { x: 30, y: -40 },   // Leg 1
    { x: -50, y: -20 },  // Leg 2
    { x: 50, y: -20 },   // Leg 3
    { x: -50, y: 20 },   // Leg 4
    { x: 50, y: 20 },    // Leg 5
    { x: -30, y: 40 },   // Leg 6
    { x: 30, y: 40 }     // Leg 7
];

// initializeLegWorldPositions tests
console.log("\n--- initializeLegWorldPositions ---");

const positions = initializeLegWorldPositions(500, 300, 100, mockFootPositions, 8);

test("returns array of positions", Array.isArray(positions));
test("initializes 8 leg positions", positions.length === 8);

test("position 0 has worldFootX", typeof positions[0].worldFootX === 'number');
test("position 0 has worldFootY", typeof positions[0].worldFootY === 'number');
test("position 0 has legIndex", positions[0].legIndex === 0);

// With bodySize=100 (scale=1.0), positions should equal spider pos + relative pos
test("leg 0 worldFootX at scale 1.0", positions[0].worldFootX === 500 + -30 * 1.0);
test("leg 0 worldFootY at scale 1.0", positions[0].worldFootY === 300 + -40 * 1.0);

test("leg 3 worldFootX at scale 1.0", positions[3].worldFootX === 500 + 50 * 1.0);
test("leg 3 worldFootY at scale 1.0", positions[3].worldFootY === 300 + -20 * 1.0);

// Test with bodySize=200 (scale=2.0)
const positions2x = initializeLegWorldPositions(500, 300, 200, mockFootPositions, 8);

test("leg 0 worldFootX at scale 2.0", positions2x[0].worldFootX === 500 + -30 * 2.0);
test("leg 0 worldFootY at scale 2.0", positions2x[0].worldFootY === 300 + -40 * 2.0);

test("leg 7 worldFootX at scale 2.0", positions2x[7].worldFootX === 500 + 30 * 2.0);
test("leg 7 worldFootY at scale 2.0", positions2x[7].worldFootY === 300 + 40 * 2.0);

// Test with different spider position
const positionsOffset = initializeLegWorldPositions(1000, 600, 100, mockFootPositions, 8);

test("positions relative to different spider X", positionsOffset[0].worldFootX === 1000 + -30 * 1.0);
test("positions relative to different spider Y", positionsOffset[0].worldFootY === 600 + -40 * 1.0);

// Test that all leg indices are assigned
const legIndices = positions.map(p => p.legIndex);
test("all leg indices present", legIndices.length === 8);
test("leg indices are sequential", legIndices.every((idx, i) => idx === i));

// Test with bodySize=50 (scale=0.5)
const positionsHalf = initializeLegWorldPositions(500, 300, 50, mockFootPositions, 8);

test("leg 0 worldFootX at scale 0.5", positionsHalf[0].worldFootX === 500 + -30 * 0.5);
test("leg 0 worldFootY at scale 0.5", positionsHalf[0].worldFootY === 300 + -40 * 0.5);

// Summary
console.log("\n=== SUMMARY ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
    process.exit(1);
}
