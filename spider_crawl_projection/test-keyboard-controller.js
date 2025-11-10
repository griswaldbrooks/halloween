// Test: Keyboard Controller
const { KEYBOARD_ACTIONS, getKeyboardAction, getAllShortcuts } = require('./keyboard-controller.js');

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

console.log('\n=== Keyboard Controller Tests ===\n');

// Test: getKeyboardAction
test('Maps h to toggleControls', () => {
    assertEquals(getKeyboardAction('h'), 'toggleControls');
});

test('Maps f to toggleFullscreen', () => {
    assertEquals(getKeyboardAction('f'), 'toggleFullscreen');
});

test('Maps r to resetSpiders', () => {
    assertEquals(getKeyboardAction('r'), 'resetSpiders');
});

test('Maps space to togglePause', () => {
    assertEquals(getKeyboardAction(' '), 'togglePause');
});

test('Returns null for unknown key', () => {
    assertEquals(getKeyboardAction('x'), null);
});

test('Case insensitive: H maps to toggleControls', () => {
    assertEquals(getKeyboardAction('H'), 'toggleControls');
});

test('Case insensitive: F maps to toggleFullscreen', () => {
    assertEquals(getKeyboardAction('F'), 'toggleFullscreen');
});

// Test: getAllShortcuts
test('getAllShortcuts returns all 4 shortcuts', () => {
    const shortcuts = getAllShortcuts();
    assertEquals(shortcuts.length, 4);
});

test('getAllShortcuts formats space key as Space', () => {
    const shortcuts = getAllShortcuts();
    const spaceShortcut = shortcuts.find(s => s.action === 'togglePause');
    assertEquals(spaceShortcut !== undefined, true);
    assertEquals(spaceShortcut.key, 'Space');
});

test('getAllShortcuts formats letter keys as uppercase', () => {
    const shortcuts = getAllShortcuts();
    const hShortcut = shortcuts.find(s => s.action === 'toggleControls');
    assertEquals(hShortcut.key, 'H');
});

test('getAllShortcuts includes all actions', () => {
    const shortcuts = getAllShortcuts();
    const actions = shortcuts.map(s => s.action);
    assertEquals(actions.includes('toggleControls'), true);
    assertEquals(actions.includes('toggleFullscreen'), true);
    assertEquals(actions.includes('resetSpiders'), true);
    assertEquals(actions.includes('togglePause'), true);
});

// Summary
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
