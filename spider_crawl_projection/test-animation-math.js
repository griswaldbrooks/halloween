#!/usr/bin/env node

// test-animation-math.js
// Tests for animation math functions

const {
    calculateSwingTarget,
    interpolatePosition,
    calculateLurchDistance,
    calculateLurchSpeed,
    scaledFootPosition,
    smoothTransition,
    calculateSwingPositionForCrawl
} = require('./animation-math.js');

console.log("\n=== ANIMATION MATH TESTS ===\n");

let passed = 0;
let failed = 0;

function test(name, condition, actual, expected) {
    if (condition) {
        console.log(`✓ PASS: ${name}`);
        passed++;
    } else {
        console.log(`✗ FAIL: ${name}`);
        if (actual !== undefined && expected !== undefined) {
            console.log(`  Expected: ${expected}`);
            console.log(`  Actual: ${actual}`);
        }
        failed++;
    }
}

function approxEqual(a, b, tolerance = 0.1) {
    return Math.abs(a - b) < tolerance;
}

// Test calculateSwingTarget
console.log("Testing calculateSwingTarget...");
const target1 = calculateSwingTarget(100, 50, { x: 10, y: 5 }, 20, 2);
test("calculateSwingTarget X with lurch", target1.x === 140);
test("calculateSwingTarget Y with lurch", target1.y === 60);

const target2 = calculateSwingTarget(100, 50, { x: 10, y: 5 }, 0, 2);
test("calculateSwingTarget X with zero lurch", target2.x === 120);
test("calculateSwingTarget Y with zero lurch", target2.y === 60);

const target3 = calculateSwingTarget(100, 50, { x: -10, y: -5 }, 20, 2);
test("calculateSwingTarget X with negative position", target3.x === 100);
test("calculateSwingTarget Y with negative position", target3.y === 40);

// Test interpolatePosition
console.log("\nTesting interpolatePosition...");
const interp1 = interpolatePosition({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.0);
test("interpolatePosition at progress 0.0 (X)", interp1.x === 0);
test("interpolatePosition at progress 0.0 (Y)", interp1.y === 0);

const interp2 = interpolatePosition({ x: 0, y: 0 }, { x: 100, y: 50 }, 1.0);
test("interpolatePosition at progress 1.0 (X)", interp2.x === 100);
test("interpolatePosition at progress 1.0 (Y)", interp2.y === 50);

const interp3 = interpolatePosition({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.5);
test("interpolatePosition at progress 0.5 (X)", interp3.x === 50);
test("interpolatePosition at progress 0.5 (Y)", interp3.y === 25);

const interp4 = interpolatePosition({ x: -50, y: -25 }, { x: 50, y: 25 }, 0.5);
test("interpolatePosition with negative positions (X)", interp4.x === 0);
test("interpolatePosition with negative positions (Y)", interp4.y === 0);

// Test calculateLurchDistance
console.log("\nTesting calculateLurchDistance...");
test("calculateLurchDistance with default factor", calculateLurchDistance(100) === 40);
test("calculateLurchDistance with custom factor", calculateLurchDistance(100, 0.5) === 50);
test("calculateLurchDistance scales with body size", calculateLurchDistance(200) === 80);

// Test calculateLurchSpeed
console.log("\nTesting calculateLurchSpeed...");
test("calculateLurchSpeed with default factor", calculateLurchSpeed(100, 200) === 0.2);
test("calculateLurchSpeed with custom factor", calculateLurchSpeed(100, 200, 0.5) === 0.25);
const slow = calculateLurchSpeed(100, 400);
const fast = calculateLurchSpeed(100, 200);
test("calculateLurchSpeed varies inversely with duration", fast === slow * 2);

// Test scaledFootPosition
console.log("\nTesting scaledFootPosition...");
const scaled1 = scaledFootPosition({ x: 50, y: 25 }, 100);
test("scaledFootPosition at default size (X)", scaled1.x === 50);
test("scaledFootPosition at default size (Y)", scaled1.y === 25);

const scaled2 = scaledFootPosition({ x: 50, y: 25 }, 200);
test("scaledFootPosition at 2x size (X)", scaled2.x === 100);
test("scaledFootPosition at 2x size (Y)", scaled2.y === 50);

const scaled3 = scaledFootPosition({ x: 50, y: 25 }, 50);
test("scaledFootPosition at 0.5x size (X)", scaled3.x === 25);
test("scaledFootPosition at 0.5x size (Y)", scaled3.y === 12.5);

const scaled4 = scaledFootPosition({ x: 50, y: 25 }, 200, 200);
test("scaledFootPosition with custom base (X)", scaled4.x === 50);
test("scaledFootPosition with custom base (Y)", scaled4.y === 25);

// Test smoothTransition
console.log("\nTesting smoothTransition...");
test("smoothTransition with factor 0", smoothTransition(10, 20, 0) === 10);
test("smoothTransition with factor 1", smoothTransition(10, 20, 1) === 20);
test("smoothTransition with factor 0.5", smoothTransition(10, 20, 0.5) === 15);
test("smoothTransition with negative values", smoothTransition(-10, 10, 0.5) === 0);

// Test calculateSwingPositionForCrawl
console.log("\nTesting calculateSwingPositionForCrawl...");

// Not swinging cases
const notSwing1 = calculateSwingPositionForCrawl('A', 1, 0.5, 100, 50, 200, 100, { x: 10, y: 5 }, 100);
test("Not swinging: group A phase 1 (X)", notSwing1.x === 100);
test("Not swinging: group A phase 1 (Y)", notSwing1.y === 50);
test("Not swinging: group A phase 1 (isSwinging)", notSwing1.isSwinging === false);

const notSwing2 = calculateSwingPositionForCrawl('B', 0, 0.5, 100, 50, 200, 100, { x: 10, y: 5 }, 100);
test("Not swinging: group B phase 0 (X)", notSwing2.x === 100);
test("Not swinging: group B phase 0 (Y)", notSwing2.y === 50);
test("Not swinging: group B phase 0 (isSwinging)", notSwing2.isSwinging === false);

// Swinging case: group A phase 0 at 50% progress
const swing1 = calculateSwingPositionForCrawl(
    'A', 0, 0.5, 100, 50, 200, 100, { x: 160.2, y: 100.2 }, 100
);
test("Swinging: group A phase 0 (X)", approxEqual(swing1.x, 250.1, 1), swing1.x, 250.1);
test("Swinging: group A phase 0 (Y)", approxEqual(swing1.y, 125.1, 1), swing1.y, 125.1);
test("Swinging: group A phase 0 (isSwinging)", swing1.isSwinging === true);

// Swinging case: group B phase 3 at 50% progress
const swing2 = calculateSwingPositionForCrawl(
    'B', 3, 0.5, 100, 50, 200, 100, { x: 160.2, y: -100.2 }, 100
);
// swingTargetX = 240 + 160.2 = 400.2
// swingTargetY = 100 + (-100.2) = -0.2
// interpolated X = 100 + (400.2 - 100) * 0.5 = 250.1
// interpolated Y = 50 + (-0.2 - 50) * 0.5 = 50 - 25.1 = 24.9
test("Swinging: group B phase 3 (X)", approxEqual(swing2.x, 250.1, 1), swing2.x, 250.1);
test("Swinging: group B phase 3 (Y)", approxEqual(swing2.y, 24.9, 1), swing2.y, 24.9);
test("Swinging: group B phase 3 (isSwinging)", swing2.isSwinging === true);

// Swinging case: at progress 0 (start position)
const swing3 = calculateSwingPositionForCrawl(
    'A', 0, 0.0, 100, 50, 200, 100, { x: 160.2, y: 100.2 }, 100
);
test("Swinging at start: progress 0 (X)", approxEqual(swing3.x, 100, 1), swing3.x, 100);
test("Swinging at start: progress 0 (Y)", approxEqual(swing3.y, 50, 1), swing3.y, 50);
test("Swinging at start: progress 0 (isSwinging)", swing3.isSwinging === true);

// Swinging case: at progress 1 (target position)
const swing4 = calculateSwingPositionForCrawl(
    'A', 0, 1.0, 100, 50, 200, 100, { x: 160.2, y: 100.2 }, 100
);
test("Swinging at target: progress 1 (X)", approxEqual(swing4.x, 400.2, 1), swing4.x, 400.2);
test("Swinging at target: progress 1 (Y)", approxEqual(swing4.y, 200.2, 1), swing4.y, 200.2);
test("Swinging at target: progress 1 (isSwinging)", swing4.isSwinging === true);

// Swinging case: scaled body size
const swing5 = calculateSwingPositionForCrawl(
    'A', 0, 0.5, 100, 50, 200, 100, { x: 160.2, y: 100.2 }, 200
);
test("Swinging with 2x body size (X)", approxEqual(swing5.x, 350.2, 1), swing5.x, 350.2);
test("Swinging with 2x body size (Y)", approxEqual(swing5.y, 175.2, 1), swing5.y, 175.2);
test("Swinging with 2x body size (isSwinging)", swing5.isSwinging === true);

// Summary
console.log("\n" + "=".repeat(50));
console.log(`Passed: ${passed} / ${passed + failed}`);
console.log(`Failed: ${failed} / ${passed + failed}`);

if (failed === 0) {
    console.log("\n✅ All animation math tests passed!\n");
    process.exit(0);
} else {
    console.log(`\n❌ ${failed} test(s) failed\n`);
    process.exit(1);
}
