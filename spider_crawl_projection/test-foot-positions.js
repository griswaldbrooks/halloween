// test-foot-positions.js
// Tests for foot position data and utilities

const { CUSTOM_FOOT_POSITIONS, getFootPosition, getLegCount } = require('./foot-positions.js');

console.log("\n=== FOOT POSITIONS TESTS ===\n");

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

function approximately(a, b, epsilon = 0.0001) {
    return Math.abs(a - b) < epsilon;
}

// Test CUSTOM_FOOT_POSITIONS structure
test("CUSTOM_FOOT_POSITIONS has 8 entries", CUSTOM_FOOT_POSITIONS.length === 8);

let allHaveXY = true;
for (let i = 0; i < CUSTOM_FOOT_POSITIONS.length; i++) {
    const pos = CUSTOM_FOOT_POSITIONS[i];
    if (!pos.hasOwnProperty('x') || !pos.hasOwnProperty('y')) {
        allHaveXY = false;
        break;
    }
    if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        allHaveXY = false;
        break;
    }
}
test("all positions have x and y number properties", allHaveXY);

// Test symmetry (left/right pairs)
test("Legs 0-1 are symmetric (x same, y opposite)",
    CUSTOM_FOOT_POSITIONS[0].x === CUSTOM_FOOT_POSITIONS[1].x &&
    CUSTOM_FOOT_POSITIONS[0].y === -CUSTOM_FOOT_POSITIONS[1].y);

test("Legs 2-3 are symmetric (x same, y opposite)",
    CUSTOM_FOOT_POSITIONS[2].x === CUSTOM_FOOT_POSITIONS[3].x &&
    CUSTOM_FOOT_POSITIONS[2].y === -CUSTOM_FOOT_POSITIONS[3].y);

test("Legs 4-5 are symmetric (x same, y opposite)",
    CUSTOM_FOOT_POSITIONS[4].x === CUSTOM_FOOT_POSITIONS[5].x &&
    CUSTOM_FOOT_POSITIONS[4].y === -CUSTOM_FOOT_POSITIONS[5].y);

test("Legs 6-7 are symmetric (x same, y opposite)",
    CUSTOM_FOOT_POSITIONS[6].x === CUSTOM_FOOT_POSITIONS[7].x &&
    CUSTOM_FOOT_POSITIONS[6].y === -CUSTOM_FOOT_POSITIONS[7].y);

// Test getFootPosition
const pos0_100 = getFootPosition(0, 100);
test("getFootPosition(0, 100) returns original x",
    approximately(pos0_100.x, CUSTOM_FOOT_POSITIONS[0].x));
test("getFootPosition(0, 100) returns original y",
    approximately(pos0_100.y, CUSTOM_FOOT_POSITIONS[0].y));

const pos0_default = getFootPosition(0);
test("getFootPosition(0) defaults to bodySize=100",
    approximately(pos0_default.x, CUSTOM_FOOT_POSITIONS[0].x) &&
    approximately(pos0_default.y, CUSTOM_FOOT_POSITIONS[0].y));

const pos0_200 = getFootPosition(0, 200);
test("getFootPosition(0, 200) doubles x value",
    approximately(pos0_200.x, CUSTOM_FOOT_POSITIONS[0].x * 2));
test("getFootPosition(0, 200) doubles y value",
    approximately(pos0_200.y, CUSTOM_FOOT_POSITIONS[0].y * 2));

const pos0_50 = getFootPosition(0, 50);
test("getFootPosition(0, 50) halves x value",
    approximately(pos0_50.x, CUSTOM_FOOT_POSITIONS[0].x * 0.5));
test("getFootPosition(0, 50) halves y value",
    approximately(pos0_50.y, CUSTOM_FOOT_POSITIONS[0].y * 0.5));

test("getFootPosition returns object with x property",
    pos0_100.hasOwnProperty('x'));
test("getFootPosition returns object with y property",
    pos0_100.hasOwnProperty('y'));

// Test all 8 legs work
let allLegsWork = true;
for (let i = 0; i < 8; i++) {
    const pos = getFootPosition(i, 150);
    if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        allLegsWork = false;
        break;
    }
}
test("getFootPosition works for all 8 leg indices", allLegsWork);

// Test getLegCount
test("getLegCount returns 8", getLegCount() === 8);
test("getLegCount matches CUSTOM_FOOT_POSITIONS.length",
    getLegCount() === CUSTOM_FOOT_POSITIONS.length);

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===\n`);

if (failed > 0) {
    process.exit(1);
}
