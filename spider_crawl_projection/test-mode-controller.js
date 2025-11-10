// Test: Mode Controller
const { shouldShowHoppingControls, getAvailableModes, validateMode } = require('./mode-controller.js');

let passed = 0;
let failed = 0;

function test(description, fn) {
    try {
        fn();
        console.log(`  ✓ ${description}`);
        passed++;
    } catch (error) {
        console.error(`  ✗ ${description}`);
        console.error(`    ${error.message}`);
        failed++;
    }
}

function assertEquals(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        throw new Error(message || `Expected ${expectedStr}, got ${actualStr}`);
    }
}

console.log('\n=== Mode Controller Tests ===\n');

// Test: shouldShowHoppingControls
test('shouldShowHoppingControls returns true for hopping', () => {
    assertEquals(shouldShowHoppingControls('hopping'), true);
});

test('shouldShowHoppingControls returns false for procedural', () => {
    assertEquals(shouldShowHoppingControls('procedural'), false);
});

test('shouldShowHoppingControls returns false for invalid mode', () => {
    assertEquals(shouldShowHoppingControls('invalid'), false);
});

// Test: getAvailableModes
test('getAvailableModes returns both modes', () => {
    const modes = getAvailableModes();
    assertEquals(modes.length, 2);
    assertEquals(modes.includes('procedural'), true);
    assertEquals(modes.includes('hopping'), true);
});

// Test: validateMode
test('validateMode returns true for procedural', () => {
    assertEquals(validateMode('procedural'), true);
});

test('validateMode returns true for hopping', () => {
    assertEquals(validateMode('hopping'), true);
});

test('validateMode returns false for invalid mode', () => {
    assertEquals(validateMode('invalid'), false);
});

test('validateMode returns false for undefined', () => {
    assertEquals(validateMode(undefined), false);
});

test('validateMode returns false for null', () => {
    assertEquals(validateMode(null), false);
});

// Summary
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
