#!/usr/bin/env node

// Test: Browser simulation using jsdom to verify exports work in real browser environment
// This test ensures that Leg2D and SpiderBody are correctly exported to window object

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('=== Browser Export Simulation Test ===\n');

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

// Helper to create a fresh jsdom instance
function createBrowserEnvironment() {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        runScripts: 'dangerously',
        resources: 'usable'
    });
    return dom.window;
}

// Helper to load a script into the window
function loadScript(window, scriptPath) {
    const scriptCode = fs.readFileSync(scriptPath, 'utf8');
    const scriptElement = window.document.createElement('script');
    scriptElement.textContent = scriptCode;
    window.document.body.appendChild(scriptElement);
}

// Test 1: Leg2D exports to window
test('Leg2D exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.Leg2D !== 'undefined') {
        throw new Error('window.Leg2D already defined before loading script');
    }

    // Load leg-kinematics.js
    loadScript(window, path.join(__dirname, 'leg-kinematics.js'));

    // Verify Leg2D is now defined on window
    if (typeof window.Leg2D === 'undefined') {
        throw new Error('window.Leg2D not defined after loading leg-kinematics.js');
    }

    // Verify it's a function/constructor
    if (typeof window.Leg2D !== 'function') {
        throw new Error(`window.Leg2D is ${typeof window.Leg2D}, expected function`);
    }

    // Verify we can instantiate it
    const leg = new window.Leg2D({
        attachX: 0,
        attachY: 0,
        upperLength: 10,
        lowerLength: 10
    });

    if (!leg) {
        throw new Error('Failed to instantiate Leg2D');
    }

    // Verify it has expected methods
    if (typeof leg.inverseKinematics !== 'function') {
        throw new Error('Leg2D instance missing inverseKinematics method');
    }

    if (typeof leg.forwardKinematics !== 'function') {
        throw new Error('Leg2D instance missing forwardKinematics method');
    }
});

// Test 2: SpiderBody exports to window
test('SpiderBody exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.SpiderBody !== 'undefined') {
        throw new Error('window.SpiderBody already defined before loading script');
    }

    // Load spider-model.js
    loadScript(window, path.join(__dirname, 'spider-model.js'));

    // Verify SpiderBody is now defined on window
    if (typeof window.SpiderBody === 'undefined') {
        throw new Error('window.SpiderBody not defined after loading spider-model.js');
    }

    // Verify it's a function/constructor
    if (typeof window.SpiderBody !== 'function') {
        throw new Error(`window.SpiderBody is ${typeof window.SpiderBody}, expected function`);
    }

    // Verify we can instantiate it
    const body = new window.SpiderBody(10);

    if (!body) {
        throw new Error('Failed to instantiate SpiderBody');
    }

    // Verify it has expected properties
    if (typeof body.size !== 'number') {
        throw new Error('SpiderBody instance missing size property');
    }

    if (!body.legAttachments || !Array.isArray(body.legAttachments)) {
        throw new Error('SpiderBody instance missing legAttachments array');
    }

    // Verify it has expected methods
    if (typeof body.getAttachment !== 'function') {
        throw new Error('SpiderBody instance missing getAttachment method');
    }
});

// Test 3: No direct globalThis assignments in code
test('Code uses window.ClassName not globalThis.ClassName', () => {
    const window = createBrowserEnvironment();

    // Read the source code to verify it doesn't use globalThis assignments
    const kinematicsCode = fs.readFileSync(path.join(__dirname, 'leg-kinematics.js'), 'utf8');
    const modelCode = fs.readFileSync(path.join(__dirname, 'spider-model.js'), 'utf8');

    // Verify code doesn't contain "globalThis.Leg2D ="
    if (kinematicsCode.includes('globalThis.Leg2D')) {
        throw new Error('leg-kinematics.js contains "globalThis.Leg2D" - should use "window.Leg2D"');
    }

    // Verify code doesn't contain "globalThis.SpiderBody ="
    if (modelCode.includes('globalThis.SpiderBody')) {
        throw new Error('spider-model.js contains "globalThis.SpiderBody" - should use "window.SpiderBody"');
    }

    // Load both scripts and verify window exports work
    loadScript(window, path.join(__dirname, 'leg-kinematics.js'));
    loadScript(window, path.join(__dirname, 'spider-model.js'));

    // Verify window exports ARE defined
    if (typeof window.Leg2D === 'undefined') {
        throw new Error('window.Leg2D should be defined');
    }

    if (typeof window.SpiderBody === 'undefined') {
        throw new Error('window.SpiderBody should be defined');
    }

    // Note: In a real browser, window === globalThis, so globalThis.Leg2D will be defined
    // because window.Leg2D is defined. This is expected and correct behavior.
    // What we're testing is that the CODE explicitly uses window, not globalThis.
});

// Test 4: Multiple modules load together
test('Both modules load together and integrate correctly', () => {
    const window = createBrowserEnvironment();

    // Load both scripts in order (kinematics first, then model)
    loadScript(window, path.join(__dirname, 'leg-kinematics.js'));
    loadScript(window, path.join(__dirname, 'spider-model.js'));

    // Verify both classes are available
    if (typeof window.Leg2D === 'undefined') {
        throw new Error('window.Leg2D not available after loading both scripts');
    }

    if (typeof window.SpiderBody === 'undefined') {
        throw new Error('window.SpiderBody not available after loading both scripts');
    }

    // Test integration: Create a SpiderBody and verify leg attachments work with Leg2D
    const body = new window.SpiderBody(10);

    if (body.legAttachments.length !== 8) {
        throw new Error(`Expected 8 leg attachments, got ${body.legAttachments.length}`);
    }

    // Create a Leg2D using SpiderBody's attachment point
    const attachment = body.getAttachment(0);
    const leg = new window.Leg2D({
        attachX: attachment.x,
        attachY: attachment.y,
        upperLength: body.legUpperLength,
        lowerLength: body.legLowerLength
    });

    // Verify leg can perform IK with a target
    const result = leg.inverseKinematics(20, 20);

    if (typeof result !== 'boolean') {
        throw new Error('inverseKinematics should return boolean');
    }

    // Verify leg can perform FK
    const position = leg.forwardKinematics();

    if (!position || !position.foot || !position.knee) {
        throw new Error('forwardKinematics should return {foot, knee}');
    }

    if (typeof position.foot.x !== 'number' || typeof position.foot.y !== 'number') {
        throw new Error('forwardKinematics foot position should have numeric x,y');
    }
});

console.log(`\n${testsPassed}/${testsRun} tests passed\n`);

if (testsPassed !== testsRun) {
    console.log('❌ Some browser export tests failed');
    process.exit(1);
} else {
    console.log('✅ All browser export simulation tests passed');
    console.log('\n💡 These tests verify exports work correctly in real browser environment!');
    process.exit(0);
}
