/**
 * Tests for boundary-utils.js
 * Phase 5B: Boundary handling and wrapping logic
 */

const {
    handleVerticalBoundary,
    handleHorizontalWrap,
    randomYPosition,
    isOutOfVerticalBounds,
    isPastWrapThreshold
} = require('./boundary-utils.js');

console.log("\n=== BOUNDARY UTILS TESTS ===\n");

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

// handleVerticalBoundary tests
console.log("\n--- handleVerticalBoundary ---");

const bounce1 = handleVerticalBoundary(-10, -5, 600);
test("bounces at top boundary (y < 0) - y clamped to 0", bounce1.y === 0);
test("bounces at top boundary (y < 0) - vy reversed", bounce1.vy === 5);
test("bounces at top boundary (y < 0) - bounced flag set", bounce1.bounced === true);

const bounce2 = handleVerticalBoundary(650, 5, 600);
test("bounces at bottom boundary (y > height) - y clamped to height", bounce2.y === 600);
test("bounces at bottom boundary (y > height) - vy reversed", bounce2.vy === -5);
test("bounces at bottom boundary (y > height) - bounced flag set", bounce2.bounced === true);

const noBounce = handleVerticalBoundary(300, 5, 600);
test("no bounce when in bounds - y unchanged", noBounce.y === 300);
test("no bounce when in bounds - vy unchanged", noBounce.vy === 5);
test("no bounce when in bounds - bounced flag false", noBounce.bounced === false);

const clampTop = handleVerticalBoundary(-100, -10, 600);
test("clamps to exactly 0 at top", clampTop.y === 0);

const clampBottom = handleVerticalBoundary(700, 10, 600);
test("clamps to exactly canvasHeight at bottom", clampBottom.y === 600);

const atZero = handleVerticalBoundary(0, 5, 600);
test("y = 0 is in-bounds", atZero.bounced === false && atZero.y === 0);

const atHeight = handleVerticalBoundary(600, 5, 600);
test("y = canvasHeight is in-bounds", atHeight.bounced === false && atHeight.y === 600);

// handleHorizontalWrap tests
console.log("\n--- handleHorizontalWrap ---");

const wrap1 = handleHorizontalWrap(1000, 800, 50);
test("wraps past right edge - x reset to -threshold", wrap1.x === -50);
test("wraps past right edge - wrapped flag set", wrap1.wrapped === true);

const wrap2 = handleHorizontalWrap(851, 800, 50);
test("wraps at exact threshold", wrap2.x === -50 && wrap2.wrapped === true);

const noWrap1 = handleHorizontalWrap(849, 800, 50);
test("does not wrap below threshold", noWrap1.x === 849 && noWrap1.wrapped === false);

const noWrap2 = handleHorizontalWrap(400, 800, 50);
test("does not wrap when in bounds", noWrap2.x === 400 && noWrap2.wrapped === false);

const customThreshold = handleHorizontalWrap(901, 800, 100);
test("works with custom threshold (x = 901)", customThreshold.x === -100 && customThreshold.wrapped === true);

const negativeX = handleHorizontalWrap(-50, 800, 50);
test("does not wrap negative x", negativeX.x === -50 && negativeX.wrapped === false);

// randomYPosition tests
console.log("\n--- randomYPosition ---");

let allInRange = true;
for (let i = 0; i < 100; i++) {
    const y = randomYPosition(600);
    if (y < 0 || y > 600) {
        allInRange = false;
        break;
    }
}
test("returns values between 0 and canvasHeight", allInRange);

const randomValues = new Set();
for (let i = 0; i < 50; i++) {
    randomValues.add(randomYPosition(600));
}
test("generates different values (not constant)", randomValues.size > 10);

let allInLargerRange = true;
for (let i = 0; i < 50; i++) {
    const y = randomYPosition(1200);
    if (y < 0 || y > 1200) {
        allInLargerRange = false;
        break;
    }
}
test("scales with canvasHeight", allInLargerRange);

// isOutOfVerticalBounds tests
console.log("\n--- isOutOfVerticalBounds ---");

test("detects y < 0 (y = -1)", isOutOfVerticalBounds(-1, 600) === true);
test("detects y < 0 (y = -100)", isOutOfVerticalBounds(-100, 600) === true);
test("detects y > canvasHeight (y = 601)", isOutOfVerticalBounds(601, 600) === true);
test("detects y > canvasHeight (y = 1000)", isOutOfVerticalBounds(1000, 600) === true);

test("y = 0 is in bounds", isOutOfVerticalBounds(0, 600) === false);
test("y = 300 is in bounds", isOutOfVerticalBounds(300, 600) === false);
test("y = 600 is in bounds", isOutOfVerticalBounds(600, 600) === false);

test("y = -0.1 is out of bounds", isOutOfVerticalBounds(-0.1, 600) === true);
test("y = 600.1 is out of bounds", isOutOfVerticalBounds(600.1, 600) === true);

// isPastWrapThreshold tests
console.log("\n--- isPastWrapThreshold ---");

test("detects x > width + threshold (x = 851)", isPastWrapThreshold(851, 800, 50) === true);
test("detects x > width + threshold (x = 1000)", isPastWrapThreshold(1000, 800, 50) === true);

test("x = 850 is not past threshold", isPastWrapThreshold(850, 800, 50) === false);
test("x = 800 is not past threshold", isPastWrapThreshold(800, 800, 50) === false);
test("x = 400 is not past threshold", isPastWrapThreshold(400, 800, 50) === false);

test("works with custom threshold (x = 901)", isPastWrapThreshold(901, 800, 100) === true);
test("custom threshold boundary (x = 900)", isPastWrapThreshold(900, 800, 100) === false);

test("negative x is not past threshold", isPastWrapThreshold(-50, 800, 50) === false);

test("exact threshold + 0.1 is past", isPastWrapThreshold(850.1, 800, 50) === true);

// Summary
console.log("\n=== SUMMARY ===");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${passed + failed}`);

if (failed > 0) {
    process.exit(1);
}
