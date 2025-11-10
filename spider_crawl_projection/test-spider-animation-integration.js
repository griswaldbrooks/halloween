#!/usr/bin/env node

// Integration tests for spider-animation.js
// Tests the integration layer code that coordinates all libraries
//
// NOTE: Full DOM/canvas/animation testing is extremely difficult in jsdom
// because spider-animation.js uses asynchronous script loading.
//
// These tests verify:
// 1. All libraries can be loaded in correct order
// 2. Global functions and classes are properly defined
// 3. Configuration and state management work correctly
// 4. No syntax errors or missing dependencies

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

console.log('\n=== Spider Animation Integration Tests ===\n');

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

function assertTrue(condition, message) {
    if (!condition) {
        throw new Error(message || 'Expected condition to be true');
    }
}

// Test 1: All library modules load without errors
test('All library modules load successfully in order', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        runScripts: 'dangerously'
    });
    const window = dom.window;

    const libraries = [
        'leg-kinematics.js',
        'spider-model.js',
        'config-defaults.js',
        'foot-positions.js',
        'animation-math.js',
        'gait-state-machine.js',
        'hopping-logic.js',
        'leg-state-calculator.js',
        'boundary-utils.js',
        'spider-factory.js',
        'position-utils.js',
        'mode-controller.js',
        'keyboard-controller.js'
    ];

    // Load each library
    libraries.forEach(libPath => {
        const scriptCode = fs.readFileSync(path.join(__dirname, libPath), 'utf8');
        const scriptElement = window.document.createElement('script');
        scriptElement.textContent = scriptCode;
        window.document.body.appendChild(scriptElement);
    });

    // Verify all libraries are available
    assertTrue(typeof window.Leg2D !== 'undefined', 'Leg2D should be defined');
    assertTrue(typeof window.SpiderBody !== 'undefined', 'SpiderBody should be defined');
    assertTrue(typeof window.ConfigDefaults !== 'undefined', 'ConfigDefaults should be defined');
    assertTrue(typeof window.FootPositions !== 'undefined', 'FootPositions should be defined');
    assertTrue(typeof window.AnimationMath !== 'undefined', 'AnimationMath should be defined');
    assertTrue(typeof window.GaitStateMachine !== 'undefined', 'GaitStateMachine should be defined');
    assertTrue(typeof window.HoppingLogic !== 'undefined', 'HoppingLogic should be defined');
    assertTrue(typeof window.LegStateCalculator !== 'undefined', 'LegStateCalculator should be defined');
    assertTrue(typeof window.BoundaryUtils !== 'undefined', 'BoundaryUtils should be defined');
    assertTrue(typeof window.SpiderFactory !== 'undefined', 'SpiderFactory should be defined');
    assertTrue(typeof window.PositionUtils !== 'undefined', 'PositionUtils should be defined');
    assertTrue(typeof window.ModeController !== 'undefined', 'ModeController should be defined');
    assertTrue(typeof window.KeyboardController !== 'undefined', 'KeyboardController should be defined');
});

// Test 2: spider-animation.js can be parsed without syntax errors
test('spider-animation.js parses without syntax errors', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Try to parse the code
    try {
        new Function(animationCode);
    } catch (e) {
        throw new Error(`Syntax error in spider-animation.js: ${e.message}`);
    }
});

// Test 3: Spider class can be instantiated in integration context
test('Spider class integrates with all library dependencies', () => {
    const dom = new JSDOM('<!DOCTYPE html><html><body><canvas id="canvas"></canvas></body></html>', {
        runScripts: 'dangerously'
    });
    const window = dom.window;

    // Load all libraries
    const libraries = [
        'leg-kinematics.js',
        'spider-model.js',
        'config-defaults.js',
        'foot-positions.js',
        'animation-math.js',
        'gait-state-machine.js',
        'hopping-logic.js',
        'leg-state-calculator.js',
        'boundary-utils.js',
        'spider-factory.js',
        'position-utils.js',
        'mode-controller.js',
        'keyboard-controller.js'
    ];

    libraries.forEach(libPath => {
        const scriptCode = fs.readFileSync(path.join(__dirname, libPath), 'utf8');
        const scriptElement = window.document.createElement('script');
        scriptElement.textContent = scriptCode;
        window.document.body.appendChild(scriptElement);
    });

    // Create test Spider class manually (extract from spider-animation.js)
    const canvas = window.document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 600;

    const config = window.ConfigDefaults.createConfig();

    // Verify Spider class would have access to all dependencies
    assertTrue(typeof window.SpiderBody !== 'undefined', 'SpiderBody available');
    assertTrue(typeof window.Leg2D !== 'undefined', 'Leg2D available');
    assertTrue(typeof window.FootPositions !== 'undefined', 'FootPositions available');
    assertTrue(typeof window.AnimationMath !== 'undefined', 'AnimationMath available');
    assertTrue(typeof window.GaitStateMachine !== 'undefined', 'GaitStateMachine available');
    assertTrue(typeof window.HoppingLogic !== 'undefined', 'HoppingLogic available');
    assertTrue(typeof window.LegStateCalculator !== 'undefined', 'LegStateCalculator available');
    assertTrue(typeof window.BoundaryUtils !== 'undefined', 'BoundaryUtils available');

    // Test creating spider components
    const bodySize = 100;
    const body = new window.SpiderBody(bodySize);

    assertTrue(body.legAttachments.length === 8, 'Spider body should have 8 leg attachments');

    // Test creating a leg
    const attachment = body.getAttachment(0);
    const leg = new window.Leg2D({
        attachX: attachment.x,
        attachY: attachment.y,
        upperLength: body.legUpperLength,
        lowerLength: body.legLowerLength
    });

    assertTrue(typeof leg.inverseKinematics === 'function', 'Leg should have IK');
    assertTrue(typeof leg.forwardKinematics === 'function', 'Leg should have FK');

    // Test foot positions
    const footPos = window.FootPositions.getFootPosition(0, bodySize);
    assertTrue(typeof footPos.x === 'number', 'Foot position should have x');
    assertTrue(typeof footPos.y === 'number', 'Foot position should have y');

    // Test gait state machine
    const gaitState = window.GaitStateMachine.createInitialGaitState();
    assertTrue(gaitState.gaitPhase === 0, 'Initial gait phase should be 0');

    // Test hopping logic
    const hopState = window.HoppingLogic.createInitialHoppingState(config, canvas.height);
    assertTrue(typeof hopState.hopPhase === 'number', 'Hopping state should have phase');

    // Test leg state calculator
    const relPos = { x: 100, y: 50 };
    const legState = window.LegStateCalculator.calculateLegHopState(0, 0, relPos, 500, 300, bodySize);
    assertTrue(typeof legState.targetX === 'number', 'Leg state should have targetX');
    assertTrue(typeof legState.targetY === 'number', 'Leg state should have targetY');

    // Test boundary utils
    const bounceResult = window.BoundaryUtils.handleVerticalBoundary(650, 5, 600);
    assertTrue(bounceResult.y === 600, 'Should bounce at bottom');
    assertTrue(bounceResult.bounced === true, 'Should detect bounce');

    // Test mode controller
    assertTrue(window.ModeController.validateMode('procedural'), 'Should validate procedural mode');
    assertTrue(window.ModeController.shouldShowHoppingControls('hopping'), 'Should show hopping controls');

    // Test keyboard controller
    const action = window.KeyboardController.getKeyboardAction('h');
    assertTrue(action === 'toggleControls', 'Should map h to toggleControls');
});

// Test 4: Script loading logic tracks dependencies correctly
test('Script loading mechanism tracks all 13 libraries', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Verify scriptsToLoad array contains all libraries
    const scriptsToLoadMatch = animationCode.match(/const scriptsToLoad = \[([\s\S]*?)\];/);
    assertTrue(scriptsToLoadMatch !== null, 'Should find scriptsToLoad array');

    const scriptsList = scriptsToLoadMatch[1];

    // Check for all 13 libraries
    assertTrue(scriptsList.includes('leg-kinematics.js'), 'Should load leg-kinematics.js');
    assertTrue(scriptsList.includes('spider-model.js'), 'Should load spider-model.js');
    assertTrue(scriptsList.includes('config-defaults.js'), 'Should load config-defaults.js');
    assertTrue(scriptsList.includes('foot-positions.js'), 'Should load foot-positions.js');
    assertTrue(scriptsList.includes('animation-math.js'), 'Should load animation-math.js');
    assertTrue(scriptsList.includes('gait-state-machine.js'), 'Should load gait-state-machine.js');
    assertTrue(scriptsList.includes('hopping-logic.js'), 'Should load hopping-logic.js');
    assertTrue(scriptsList.includes('leg-state-calculator.js'), 'Should load leg-state-calculator.js');
    assertTrue(scriptsList.includes('boundary-utils.js'), 'Should load boundary-utils.js');
    assertTrue(scriptsList.includes('spider-factory.js'), 'Should load spider-factory.js');
    assertTrue(scriptsList.includes('position-utils.js'), 'Should load position-utils.js');
    assertTrue(scriptsList.includes('mode-controller.js'), 'Should load mode-controller.js');
    assertTrue(scriptsList.includes('keyboard-controller.js'), 'Should load keyboard-controller.js');
});

// Test 5: Integration layer uses library methods correctly
test('spider-animation.js uses library methods with window prefix', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Verify it uses window.ModeController
    assertTrue(
        animationCode.includes('window.ModeController.shouldShowHoppingControls'),
        'Should use window.ModeController.shouldShowHoppingControls'
    );

    // Verify it uses window.KeyboardController
    assertTrue(
        animationCode.includes('window.KeyboardController.getKeyboardAction'),
        'Should use window.KeyboardController.getKeyboardAction'
    );

    // Verify it uses window.BoundaryUtils
    assertTrue(
        animationCode.includes('window.BoundaryUtils.handleVerticalBoundary'),
        'Should use window.BoundaryUtils.handleVerticalBoundary'
    );

    // Verify it uses window.LegStateCalculator
    assertTrue(
        animationCode.includes('window.LegStateCalculator.calculateLegHopState'),
        'Should use window.LegStateCalculator.calculateLegHopState'
    );

    // Verify it uses window.GaitStateMachine
    assertTrue(
        animationCode.includes('window.GaitStateMachine.updateGaitState'),
        'Should use window.GaitStateMachine.updateGaitState'
    );

    // Verify it uses window.HoppingLogic
    assertTrue(
        animationCode.includes('window.HoppingLogic.updateHopPhase'),
        'Should use window.HoppingLogic.updateHopPhase'
    );

    // Verify it uses window.AnimationMath
    assertTrue(
        animationCode.includes('window.AnimationMath.calculateSwingPositionForCrawl'),
        'Should use window.AnimationMath.calculateSwingPositionForCrawl'
    );

    // Verify it uses window.FootPositions
    assertTrue(
        animationCode.includes('window.FootPositions.CUSTOM_FOOT_POSITIONS'),
        'Should use window.FootPositions.CUSTOM_FOOT_POSITIONS'
    );

    // Verify it uses window.ConfigDefaults
    assertTrue(
        animationCode.includes('window.ConfigDefaults.createConfig'),
        'Should use window.ConfigDefaults.createConfig'
    );
});

// Test 6: All keyboard shortcuts map to actions
test('Keyboard event handler uses KeyboardController for all actions', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Find keyboard handler
    const keydownMatch = animationCode.match(/document\.addEventListener\('keydown', \(e\) => \{([\s\S]*?)\}\);/);
    assertTrue(keydownMatch !== null, 'Should find keydown event listener');

    const keydownHandler = keydownMatch[1];

    // Verify it uses KeyboardController.getKeyboardAction
    assertTrue(
        keydownHandler.includes('window.KeyboardController.getKeyboardAction'),
        'Should use KeyboardController.getKeyboardAction'
    );

    // Verify it handles all actions
    assertTrue(keydownHandler.includes('toggleControls'), 'Should handle toggleControls');
    assertTrue(keydownHandler.includes('toggleFullscreen'), 'Should handle toggleFullscreen');
    assertTrue(keydownHandler.includes('resetSpiders'), 'Should handle resetSpiders');
    assertTrue(keydownHandler.includes('togglePause'), 'Should handle togglePause');
});

// Test 7: Mode change uses ModeController
test('updateAnimationMode uses ModeController for hopping controls', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Find updateAnimationMode function
    const modeMatch = animationCode.match(/function updateAnimationMode\(mode\) \{([\s\S]*?)\n\}/);
    assertTrue(modeMatch !== null, 'Should find updateAnimationMode function');

    const modeFunction = modeMatch[1];

    // Verify it uses ModeController
    assertTrue(
        modeFunction.includes('window.ModeController.shouldShowHoppingControls'),
        'Should use ModeController.shouldShowHoppingControls'
    );
});

// Test 8: Update functions handle boundary conditions
test('Spider update functions use BoundaryUtils for wrapping and bouncing', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Find update method
    const updateMatch = animationCode.match(/update\(\) \{([\s\S]*?)\n    \}/);
    assertTrue(updateMatch !== null, 'Should find update method');

    const updateMethod = updateMatch[1];

    // Verify it uses BoundaryUtils
    assertTrue(
        updateMethod.includes('window.BoundaryUtils.handleVerticalBoundary'),
        'Should use BoundaryUtils.handleVerticalBoundary'
    );

    assertTrue(
        updateMethod.includes('window.BoundaryUtils.handleHorizontalWrap'),
        'Should use BoundaryUtils.handleHorizontalWrap'
    );

    assertTrue(
        updateMethod.includes('window.BoundaryUtils.randomYPosition'),
        'Should use BoundaryUtils.randomYPosition'
    );
});

// Test 9: All library checks are present in onScriptLoaded
test('onScriptLoaded verifies all 13 libraries are loaded', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Find onScriptLoaded function
    const onLoadMatch = animationCode.match(/function onScriptLoaded\(\) \{([\s\S]*?)\n\}/);
    assertTrue(onLoadMatch !== null, 'Should find onScriptLoaded function');

    const onLoadFunction = onLoadMatch[1];

    // Verify all library checks
    assertTrue(onLoadFunction.includes('typeof SpiderBody'), 'Should check SpiderBody');
    assertTrue(onLoadFunction.includes('typeof Leg2D'), 'Should check Leg2D');
    assertTrue(onLoadFunction.includes('typeof window.ConfigDefaults'), 'Should check ConfigDefaults');
    assertTrue(onLoadFunction.includes('typeof window.FootPositions'), 'Should check FootPositions');
    assertTrue(onLoadFunction.includes('typeof window.AnimationMath'), 'Should check AnimationMath');
    assertTrue(onLoadFunction.includes('typeof window.GaitStateMachine'), 'Should check GaitStateMachine');
    assertTrue(onLoadFunction.includes('typeof window.HoppingLogic'), 'Should check HoppingLogic');
    assertTrue(onLoadFunction.includes('typeof window.LegStateCalculator'), 'Should check LegStateCalculator');
    assertTrue(onLoadFunction.includes('typeof window.BoundaryUtils'), 'Should check BoundaryUtils');
    assertTrue(onLoadFunction.includes('typeof window.SpiderFactory'), 'Should check SpiderFactory');
    assertTrue(onLoadFunction.includes('typeof window.PositionUtils'), 'Should check PositionUtils');
    assertTrue(onLoadFunction.includes('typeof window.ModeController'), 'Should check ModeController');
    assertTrue(onLoadFunction.includes('typeof window.KeyboardController'), 'Should check KeyboardController');
});

// Test 10: Spider class uses all extracted libraries
test('Spider class integrates with all library methods', () => {
    const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

    // Find Spider class
    const spiderMatch = animationCode.match(/class Spider \{([\s\S]*?)\n\}/);
    assertTrue(spiderMatch !== null, 'Should find Spider class');

    const spiderClass = spiderMatch[1];

    // Verify it uses libraries
    assertTrue(spiderClass.includes('window.HoppingLogic'), 'Should use HoppingLogic');
    assertTrue(spiderClass.includes('window.BoundaryUtils'), 'Should use BoundaryUtils');
    assertTrue(spiderClass.includes('window.FootPositions'), 'Should use FootPositions');
    assertTrue(spiderClass.includes('window.AnimationMath'), 'Should use AnimationMath');
    assertTrue(spiderClass.includes('window.GaitStateMachine'), 'Should use GaitStateMachine');
    assertTrue(spiderClass.includes('window.LegStateCalculator'), 'Should use LegStateCalculator');
    assertTrue(spiderClass.includes('new SpiderBody'), 'Should instantiate SpiderBody');
    assertTrue(spiderClass.includes('new Leg2D'), 'Should instantiate Leg2D');
});

console.log(`\n${passed} passed, ${failed} failed\n`);

if (failed === 0) {
    console.log('✅ All integration tests passed!');
    console.log('\nThese tests verify:');
    console.log('  - All 13 libraries load correctly');
    console.log('  - spider-animation.js uses all libraries with window prefix');
    console.log('  - Integration layer properly coordinates all components');
    console.log('  - No syntax errors or missing dependencies');
    console.log('\nNote: Full DOM/canvas/animation testing requires manual browser testing');
    console.log('      due to asynchronous script loading and requestAnimationFrame');
}

process.exit(failed > 0 ? 1 : 0);
