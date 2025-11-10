#!/usr/bin/env node

// Test: Browser simulation using jsdom to verify exports work in real browser environment
//
// CRITICAL: This test prevents browser compatibility regressions that unit tests miss!
//
// What this test prevents:
// 1. ES6 'export' syntax (works in Node.js, breaks in browser <script> tags)
// 2. Missing window.X prefix (breaks when libraries reference each other)
// 3. Incomplete exports (missing properties or methods on window object)
// 4. Integration failures (libraries don't work together in browser)
//
// History of bugs this test caught AFTER being enhanced:
// - 2025-11-09: config-defaults.js used 'export' keyword - broke browser loading
// - 2025-11-09: spider-animation.js missing 'window.' prefix - undefined references
//
// Why unit tests didn't catch these bugs:
// - Node.js accepts both CommonJS and ES modules (more permissive)
// - Node.js doesn't require 'window.' prefix for module scope
// - jsdom tests only work if they cover ALL libraries (original tests didn't)
//
// IMPORTANT: Every new library MUST have a test added here before merging!
//
// See: PHASE1_LESSONS_LEARNED.md for detailed analysis

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

// Test 4: ConfigDefaults exports to window
test('ConfigDefaults exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.ConfigDefaults !== 'undefined') {
        throw new Error('window.ConfigDefaults already defined before loading script');
    }

    // Load config-defaults.js
    loadScript(window, path.join(__dirname, 'config-defaults.js'));

    // Verify ConfigDefaults is now defined on window
    if (typeof window.ConfigDefaults === 'undefined') {
        throw new Error('window.ConfigDefaults not defined after loading config-defaults.js');
    }

    // Verify it's an object
    if (typeof window.ConfigDefaults !== 'object') {
        throw new Error(`window.ConfigDefaults is ${typeof window.ConfigDefaults}, expected object`);
    }

    // Verify it has DEFAULT_CONFIG
    if (typeof window.ConfigDefaults.DEFAULT_CONFIG === 'undefined') {
        throw new Error('window.ConfigDefaults.DEFAULT_CONFIG not defined');
    }

    // Verify it has createConfig function
    if (typeof window.ConfigDefaults.createConfig !== 'function') {
        throw new Error('window.ConfigDefaults.createConfig is not a function');
    }

    // Verify we can use it
    const config = window.ConfigDefaults.createConfig({ spiderCount: 10 });
    if (config.spiderCount !== 10) {
        throw new Error('createConfig did not apply override correctly');
    }
});

// Test 5: FootPositions exports to window
test('FootPositions exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.FootPositions !== 'undefined') {
        throw new Error('window.FootPositions already defined before loading script');
    }

    // Load foot-positions.js
    loadScript(window, path.join(__dirname, 'foot-positions.js'));

    // Verify FootPositions is now defined on window
    if (typeof window.FootPositions === 'undefined') {
        throw new Error('window.FootPositions not defined after loading foot-positions.js');
    }

    // Verify it's an object
    if (typeof window.FootPositions !== 'object') {
        throw new Error(`window.FootPositions is ${typeof window.FootPositions}, expected object`);
    }

    // Verify it has CUSTOM_FOOT_POSITIONS
    if (typeof window.FootPositions.CUSTOM_FOOT_POSITIONS === 'undefined') {
        throw new Error('window.FootPositions.CUSTOM_FOOT_POSITIONS not defined');
    }

    // Verify CUSTOM_FOOT_POSITIONS is an array
    if (!Array.isArray(window.FootPositions.CUSTOM_FOOT_POSITIONS)) {
        throw new Error('window.FootPositions.CUSTOM_FOOT_POSITIONS is not an array');
    }

    // Verify it has 8 positions
    if (window.FootPositions.CUSTOM_FOOT_POSITIONS.length !== 8) {
        throw new Error(`Expected 8 foot positions, got ${window.FootPositions.CUSTOM_FOOT_POSITIONS.length}`);
    }

    // Verify getFootPosition function exists
    if (typeof window.FootPositions.getFootPosition !== 'function') {
        throw new Error('window.FootPositions.getFootPosition is not a function');
    }

    // Verify we can use it
    const pos = window.FootPositions.getFootPosition(0, 100);
    if (typeof pos.x !== 'number' || typeof pos.y !== 'number') {
        throw new Error('getFootPosition did not return valid position');
    }
});

// Test 6: AnimationMath exports to window
test('AnimationMath exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.AnimationMath !== 'undefined') {
        throw new Error('window.AnimationMath already defined before loading script');
    }

    // Load animation-math.js
    loadScript(window, path.join(__dirname, 'animation-math.js'));

    // Verify AnimationMath is now defined on window
    if (typeof window.AnimationMath === 'undefined') {
        throw new Error('window.AnimationMath not defined after loading animation-math.js');
    }

    // Verify it's an object
    if (typeof window.AnimationMath !== 'object') {
        throw new Error(`window.AnimationMath is ${typeof window.AnimationMath}, expected object`);
    }

    // Verify all expected functions exist
    const expectedFunctions = [
        'calculateSwingTarget',
        'interpolatePosition',
        'calculateLurchDistance',
        'calculateLurchSpeed',
        'scaledFootPosition',
        'smoothTransition',
        'calculateSwingPositionForCrawl'
    ];

    for (const funcName of expectedFunctions) {
        if (typeof window.AnimationMath[funcName] !== 'function') {
            throw new Error(`window.AnimationMath.${funcName} is not a function`);
        }
    }

    // Verify we can use the functions
    const swingTarget = window.AnimationMath.calculateSwingTarget(100, 50, { x: 10, y: 5 }, 20, 2);
    if (typeof swingTarget.x !== 'number' || typeof swingTarget.y !== 'number') {
        throw new Error('calculateSwingTarget did not return valid position');
    }

    const interpolated = window.AnimationMath.interpolatePosition({ x: 0, y: 0 }, { x: 100, y: 50 }, 0.5);
    if (interpolated.x !== 50 || interpolated.y !== 25) {
        throw new Error('interpolatePosition did not calculate correctly');
    }
});

// Test 7: GaitStateMachine exports to window
test('GaitStateMachine exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.GaitStateMachine !== 'undefined') {
        throw new Error('window.GaitStateMachine already defined before loading script');
    }

    // Load gait-state-machine.js
    loadScript(window, path.join(__dirname, 'gait-state-machine.js'));

    // Verify GaitStateMachine is now defined on window
    if (typeof window.GaitStateMachine === 'undefined') {
        throw new Error('window.GaitStateMachine not defined after loading gait-state-machine.js');
    }

    // Verify it's an object
    if (typeof window.GaitStateMachine !== 'object') {
        throw new Error(`window.GaitStateMachine is ${typeof window.GaitStateMachine}, expected object`);
    }

    // Verify all expected functions exist
    const expectedFunctions = [
        'getGaitPhaseDuration',
        'getAllPhaseDurations',
        'getNextGaitPhase',
        'calculateStepProgress',
        'updateGaitState',
        'isLurchPhase',
        'calculateLurchSpeed',
        'createInitialGaitState'
    ];

    for (const funcName of expectedFunctions) {
        if (typeof window.GaitStateMachine[funcName] !== 'function') {
            throw new Error(`window.GaitStateMachine.${funcName} is not a function`);
        }
    }

    // Verify PHASE_DURATIONS constant
    if (!Array.isArray(window.GaitStateMachine.PHASE_DURATIONS)) {
        throw new Error('window.GaitStateMachine.PHASE_DURATIONS is not an array');
    }

    if (window.GaitStateMachine.PHASE_DURATIONS.length !== 6) {
        throw new Error(`Expected 6 phase durations, got ${window.GaitStateMachine.PHASE_DURATIONS.length}`);
    }

    // Verify we can use the functions
    const state = window.GaitStateMachine.createInitialGaitState();
    if (state.gaitPhase !== 0 || state.gaitTimer !== 0) {
        throw new Error('createInitialGaitState did not return correct initial state');
    }

    const updated = window.GaitStateMachine.updateGaitState(state, 100, 1.0);
    if (typeof updated.gaitPhase !== 'number' || typeof updated.stepProgress !== 'number') {
        throw new Error('updateGaitState did not return valid state');
    }

    const isLurch = window.GaitStateMachine.isLurchPhase(1);
    if (typeof isLurch !== 'boolean') {
        throw new Error('isLurchPhase did not return boolean');
    }
});

// Test 8: HoppingLogic exports to window
test('HoppingLogic exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.HoppingLogic !== 'undefined') {
        throw new Error('window.HoppingLogic already defined before loading script');
    }

    // Load hopping-logic.js
    loadScript(window, path.join(__dirname, 'hopping-logic.js'));

    // Verify HoppingLogic is now defined on window
    if (typeof window.HoppingLogic === 'undefined') {
        throw new Error('window.HoppingLogic not defined after loading hopping-logic.js');
    }

    // Verify it's an object
    if (typeof window.HoppingLogic !== 'object') {
        throw new Error(`window.HoppingLogic is ${typeof window.HoppingLogic}, expected object`);
    }

    // Verify all expected functions and constants exist
    const expectedFunctions = [
        'getHopPhaseDuration',
        'getAllHopPhaseDurations',
        'getNextHopPhase',
        'calculateHopDistance',
        'calculateHopTargetX',
        'calculateCrawlCycles',
        'shouldStartHopping',
        'updateHopPhase',
        'updateCrawlPhase',
        'createInitialHoppingState',
        'isFlightPhase',
        'isCrawlMode',
        'getCrawlPhaseDurations',
        'isLegSwingingInCrawl',
        'isCrawlLurchPhase'
    ];

    for (const funcName of expectedFunctions) {
        if (typeof window.HoppingLogic[funcName] !== 'function') {
            throw new Error(`window.HoppingLogic.${funcName} is not a function`);
        }
    }

    // Verify HOP_PHASE constant
    if (typeof window.HoppingLogic.HOP_PHASE !== 'object') {
        throw new Error('window.HoppingLogic.HOP_PHASE is not an object');
    }

    // Verify HOP_PHASE has expected values
    if (window.HoppingLogic.HOP_PHASE.CROUCH !== 0) {
        throw new Error('HOP_PHASE.CROUCH should be 0');
    }

    if (window.HoppingLogic.HOP_PHASE.TAKEOFF !== 1) {
        throw new Error('HOP_PHASE.TAKEOFF should be 1');
    }

    if (window.HoppingLogic.HOP_PHASE.FLIGHT !== 2) {
        throw new Error('HOP_PHASE.FLIGHT should be 2');
    }

    if (window.HoppingLogic.HOP_PHASE.LANDING !== 3) {
        throw new Error('HOP_PHASE.LANDING should be 3');
    }

    if (window.HoppingLogic.HOP_PHASE.CRAWL !== 4) {
        throw new Error('HOP_PHASE.CRAWL should be 4');
    }

    // Verify we can use the functions
    const config = { hopFlightDuration: 60, hopFrequencyMin: 2, hopFrequencyMax: 5, hopDistanceMin: 2.0, hopDistanceMax: 4.0 };

    const duration = window.HoppingLogic.getHopPhaseDuration(0, config);
    if (duration !== 100) {
        throw new Error('getHopPhaseDuration should return 100 for CROUCH phase');
    }

    const initialState = window.HoppingLogic.createInitialHoppingState(config, 800);
    if (typeof initialState.hopPhase !== 'number' || typeof initialState.crawlCyclesRemaining !== 'number') {
        throw new Error('createInitialHoppingState did not return valid state');
    }

    const isFlying = window.HoppingLogic.isFlightPhase(2);
    if (isFlying !== true) {
        throw new Error('isFlightPhase should return true for FLIGHT phase');
    }
});

// Test 9: All seven modules load together
test('All seven modules load together and integrate correctly', () => {
    const window = createBrowserEnvironment();

    // Load all scripts in order
    loadScript(window, path.join(__dirname, 'leg-kinematics.js'));
    loadScript(window, path.join(__dirname, 'spider-model.js'));
    loadScript(window, path.join(__dirname, 'config-defaults.js'));
    loadScript(window, path.join(__dirname, 'foot-positions.js'));
    loadScript(window, path.join(__dirname, 'animation-math.js'));
    loadScript(window, path.join(__dirname, 'gait-state-machine.js'));
    loadScript(window, path.join(__dirname, 'hopping-logic.js'));

    // Verify all seven modules are available
    if (typeof window.Leg2D === 'undefined') {
        throw new Error('window.Leg2D not available after loading all scripts');
    }

    if (typeof window.SpiderBody === 'undefined') {
        throw new Error('window.SpiderBody not available after loading all scripts');
    }

    if (typeof window.ConfigDefaults === 'undefined') {
        throw new Error('window.ConfigDefaults not available after loading all scripts');
    }

    if (typeof window.FootPositions === 'undefined') {
        throw new Error('window.FootPositions not available after loading all scripts');
    }

    if (typeof window.AnimationMath === 'undefined') {
        throw new Error('window.AnimationMath not available after loading all scripts');
    }

    if (typeof window.GaitStateMachine === 'undefined') {
        throw new Error('window.GaitStateMachine not available after loading all scripts');
    }

    if (typeof window.HoppingLogic === 'undefined') {
        throw new Error('window.HoppingLogic not available after loading all scripts');
    }

    // Test integration: Create config and use foot positions
    const config = window.ConfigDefaults.createConfig();
    const footPos = window.FootPositions.getFootPosition(0, 100);

    if (!config || !footPos) {
        throw new Error('Failed to create config or get foot position');
    }

    // Test integration: Create a SpiderBody and verify leg attachments work with Leg2D
    const body = new window.SpiderBody(10);

    if (body.legAttachments.length !== 8) {
        throw new Error(`Expected 8 leg attachments, got ${body.legAttachments.length}`);
    }

    // Verify foot positions count matches leg count
    if (window.FootPositions.getLegCount() !== body.legAttachments.length) {
        throw new Error('Foot positions count does not match leg attachments count');
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

    // Test integration: Use AnimationMath to calculate swing position
    const swingPos = window.AnimationMath.calculateSwingPositionForCrawl(
        'A', 0, 0.5, 100, 50, 200, 100, footPos, body.size
    );

    if (typeof swingPos.x !== 'number' || typeof swingPos.y !== 'number') {
        throw new Error('calculateSwingPositionForCrawl should return position with numeric x,y');
    }

    if (typeof swingPos.isSwinging !== 'boolean') {
        throw new Error('calculateSwingPositionForCrawl should return isSwinging boolean');
    }

    // Test integration: Use GaitStateMachine to manage gait phases
    const gaitState = window.GaitStateMachine.createInitialGaitState();
    const updatedGait = window.GaitStateMachine.updateGaitState(gaitState, 50, 1.0);

    if (typeof updatedGait.gaitPhase !== 'number') {
        throw new Error('GaitStateMachine updateGaitState should return numeric gaitPhase');
    }

    if (typeof updatedGait.stepProgress !== 'number') {
        throw new Error('GaitStateMachine updateGaitState should return numeric stepProgress');
    }

    // Verify lurch phase detection works
    const isPhase1Lurch = window.GaitStateMachine.isLurchPhase(1);
    if (isPhase1Lurch !== true) {
        throw new Error('Phase 1 should be a lurch phase');
    }

    const isPhase0Lurch = window.GaitStateMachine.isLurchPhase(0);
    if (isPhase0Lurch !== false) {
        throw new Error('Phase 0 should not be a lurch phase');
    }

    // Test integration: Use HoppingLogic with config
    const hopConfig = {
        hopFlightDuration: 60,
        hopFrequencyMin: 2,
        hopFrequencyMax: 5,
        hopDistanceMin: 2.0,
        hopDistanceMax: 4.0
    };

    const hoppingState = window.HoppingLogic.createInitialHoppingState(hopConfig, 800);
    if (typeof hoppingState.hopPhase !== 'number') {
        throw new Error('HoppingLogic should create valid state');
    }

    // Test hop phase update
    const updatedHop = window.HoppingLogic.updateHopPhase(hoppingState, 50, 1.0, hopConfig);
    if (typeof updatedHop.hopTimer !== 'number') {
        throw new Error('HoppingLogic updateHopPhase should return valid state');
    }

    // Test crawl phase update
    const crawlState = { crawlPhase: 0, crawlTimer: 50, crawlCyclesRemaining: 3 };
    const updatedCrawl = window.HoppingLogic.updateCrawlPhase(crawlState, 50, 1.0, hopConfig);
    if (typeof updatedCrawl.stepProgress !== 'number') {
        throw new Error('HoppingLogic updateCrawlPhase should return valid state');
    }

    // Verify hopping logic helpers work
    if (!window.HoppingLogic.isLegSwingingInCrawl('A', 0)) {
        throw new Error('Group A should swing in crawl phase 0');
    }

    if (!window.HoppingLogic.isCrawlLurchPhase(1)) {
        throw new Error('Crawl phase 1 should be a lurch phase');
    }
});

// Test 10: ConfigValidators exports to window (Phase 4)
test('ConfigValidators exports to window object', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.ConfigValidators !== 'undefined') {
        throw new Error('window.ConfigValidators already defined before loading script');
    }

    // Load config-validators.js
    loadScript(window, path.join(__dirname, 'config-validators.js'));

    // Verify ConfigValidators is now defined on window
    if (typeof window.ConfigValidators === 'undefined') {
        throw new Error('window.ConfigValidators not defined after loading config-validators.js');
    }

    // Verify it's an object
    if (typeof window.ConfigValidators !== 'object') {
        throw new Error(`window.ConfigValidators is ${typeof window.ConfigValidators}, expected object`);
    }

    // Verify core validation functions exist
    if (typeof window.ConfigValidators.validateSpiderCount !== 'function') {
        throw new Error('window.ConfigValidators.validateSpiderCount is not a function');
    }

    if (typeof window.ConfigValidators.validateSpeed !== 'function') {
        throw new Error('window.ConfigValidators.validateSpeed is not a function');
    }

    if (typeof window.ConfigValidators.validateVariation !== 'function') {
        throw new Error('window.ConfigValidators.validateVariation is not a function');
    }

    if (typeof window.ConfigValidators.clampMinMax !== 'function') {
        throw new Error('window.ConfigValidators.clampMinMax is not a function');
    }

    if (typeof window.ConfigValidators.validateSizeRange !== 'function') {
        throw new Error('window.ConfigValidators.validateSizeRange is not a function');
    }

    if (typeof window.ConfigValidators.validateHopDistanceRange !== 'function') {
        throw new Error('window.ConfigValidators.validateHopDistanceRange is not a function');
    }

    if (typeof window.ConfigValidators.validateHopFrequencyRange !== 'function') {
        throw new Error('window.ConfigValidators.validateHopFrequencyRange is not a function');
    }

    // Test core functionality
    if (!window.ConfigValidators.validateSpiderCount(5)) {
        throw new Error('validateSpiderCount(5) should return true');
    }

    if (window.ConfigValidators.validateSpiderCount(0)) {
        throw new Error('validateSpiderCount(0) should return false');
    }

    if (!window.ConfigValidators.validateSpeed(1.5)) {
        throw new Error('validateSpeed(1.5) should return true');
    }

    if (window.ConfigValidators.validateSpeed(0)) {
        throw new Error('validateSpeed(0) should return false');
    }

    // Test range validation
    const sizeRange = window.ConfigValidators.validateSizeRange(0.5, 3.0);
    if (!sizeRange.valid || sizeRange.min !== 0.5 || sizeRange.max !== 3.0) {
        throw new Error('validateSizeRange should validate and return correct range');
    }

    // Test clamping
    const clamped = window.ConfigValidators.clampMinMax(10, 1);
    if (clamped.min !== 1 || clamped.max !== 10 || !clamped.adjusted) {
        throw new Error('clampMinMax should swap inverted min/max values');
    }
});

// Test 11: LegStateCalculator module (Phase 5A)
test('LegStateCalculator exports to window and calculates hop phase states', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.LegStateCalculator !== 'undefined') {
        throw new Error('window.LegStateCalculator already defined before loading script');
    }

    // Load leg-state-calculator.js
    loadScript(window, path.join(__dirname, 'leg-state-calculator.js'));

    // Verify LegStateCalculator is now defined on window
    if (typeof window.LegStateCalculator === 'undefined') {
        throw new Error('window.LegStateCalculator not defined after loading leg-state-calculator.js');
    }

    // Verify it has expected methods
    if (typeof window.LegStateCalculator.calculateLegHopState !== 'function') {
        throw new Error('LegStateCalculator missing calculateLegHopState method');
    }

    if (typeof window.LegStateCalculator.applyLegSmoothing !== 'function') {
        throw new Error('LegStateCalculator missing applyLegSmoothing method');
    }

    if (typeof window.LegStateCalculator.getPhaseConfig !== 'function') {
        throw new Error('LegStateCalculator missing getPhaseConfig method');
    }

    if (typeof window.LegStateCalculator.isBackLeg !== 'function') {
        throw new Error('LegStateCalculator missing isBackLeg method');
    }

    if (typeof window.LegStateCalculator.getLegReachFactor !== 'function') {
        throw new Error('LegStateCalculator missing getLegReachFactor method');
    }

    // Test isBackLeg
    if (window.LegStateCalculator.isBackLeg(2) !== false) {
        throw new Error('isBackLeg(2) should return false for front leg');
    }

    if (window.LegStateCalculator.isBackLeg(5) !== true) {
        throw new Error('isBackLeg(5) should return true for back leg');
    }

    // Test getPhaseConfig
    const crouchConfig = window.LegStateCalculator.getPhaseConfig(0);
    if (!crouchConfig || crouchConfig.name !== 'CROUCH') {
        throw new Error('getPhaseConfig(0) should return CROUCH config');
    }

    if (crouchConfig.backFactor !== 0.8 || crouchConfig.frontFactor !== 0.8) {
        throw new Error('CROUCH config should have 0.8 factors');
    }

    // Test getLegReachFactor
    const takeoffBackFactor = window.LegStateCalculator.getLegReachFactor(1, true);
    if (takeoffBackFactor !== 1.2) {
        throw new Error('TAKEOFF back leg factor should be 1.2');
    }

    // Test applyLegSmoothing
    const smoothed = window.LegStateCalculator.applyLegSmoothing(0, 0, 100, 100, 0.5);
    if (smoothed.x !== 50 || smoothed.y !== 50) {
        throw new Error('applyLegSmoothing with 0.5 should move halfway');
    }

    // Test calculateLegHopState
    const relativePos = { x: 100, y: 50 };
    const state = window.LegStateCalculator.calculateLegHopState(
        0, // CROUCH phase
        2, // front leg
        relativePos,
        500, // bodyX
        300, // bodyY
        100  // bodySize
    );

    if (!state || typeof state.targetX !== 'number' || typeof state.targetY !== 'number') {
        throw new Error('calculateLegHopState should return state with targetX and targetY');
    }

    if (state.targetX !== 580) { // 500 + 100 * 0.8
        throw new Error(`CROUCH state targetX should be 580, got ${state.targetX}`);
    }

    if (state.smoothing !== 0.3) {
        throw new Error('CROUCH state smoothing should be 0.3');
    }

    if (state.isBackLeg !== false) {
        throw new Error('Leg 2 should not be marked as back leg');
    }
});

// Test 12: BoundaryUtils module (Phase 5B)
test('BoundaryUtils exports to window and handles boundary conditions', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.BoundaryUtils !== 'undefined') {
        throw new Error('window.BoundaryUtils already defined before loading script');
    }

    // Load boundary-utils.js
    loadScript(window, path.join(__dirname, 'boundary-utils.js'));

    // Verify BoundaryUtils is now defined on window
    if (typeof window.BoundaryUtils === 'undefined') {
        throw new Error('window.BoundaryUtils not defined after loading boundary-utils.js');
    }

    // Verify it has expected methods
    if (typeof window.BoundaryUtils.handleVerticalBoundary !== 'function') {
        throw new Error('BoundaryUtils missing handleVerticalBoundary method');
    }

    if (typeof window.BoundaryUtils.handleHorizontalWrap !== 'function') {
        throw new Error('BoundaryUtils missing handleHorizontalWrap method');
    }

    if (typeof window.BoundaryUtils.randomYPosition !== 'function') {
        throw new Error('BoundaryUtils missing randomYPosition method');
    }

    if (typeof window.BoundaryUtils.isOutOfVerticalBounds !== 'function') {
        throw new Error('BoundaryUtils missing isOutOfVerticalBounds method');
    }

    if (typeof window.BoundaryUtils.isPastWrapThreshold !== 'function') {
        throw new Error('BoundaryUtils missing isPastWrapThreshold method');
    }

    // Test handleVerticalBoundary
    const bounceTop = window.BoundaryUtils.handleVerticalBoundary(-10, -5, 600);
    if (bounceTop.y !== 0 || bounceTop.vy !== 5 || !bounceTop.bounced) {
        throw new Error('handleVerticalBoundary should bounce at top boundary');
    }

    const bounceBottom = window.BoundaryUtils.handleVerticalBoundary(650, 5, 600);
    if (bounceBottom.y !== 600 || bounceBottom.vy !== -5 || !bounceBottom.bounced) {
        throw new Error('handleVerticalBoundary should bounce at bottom boundary');
    }

    const noBounce = window.BoundaryUtils.handleVerticalBoundary(300, 5, 600);
    if (noBounce.y !== 300 || noBounce.vy !== 5 || noBounce.bounced) {
        throw new Error('handleVerticalBoundary should not bounce when in bounds');
    }

    // Test handleHorizontalWrap
    const wrap = window.BoundaryUtils.handleHorizontalWrap(1000, 800, 50);
    if (wrap.x !== -50 || !wrap.wrapped) {
        throw new Error('handleHorizontalWrap should wrap past right edge');
    }

    const noWrap = window.BoundaryUtils.handleHorizontalWrap(400, 800, 50);
    if (noWrap.x !== 400 || noWrap.wrapped) {
        throw new Error('handleHorizontalWrap should not wrap when in bounds');
    }

    // Test randomYPosition
    const randomY = window.BoundaryUtils.randomYPosition(600);
    if (typeof randomY !== 'number' || randomY < 0 || randomY > 600) {
        throw new Error('randomYPosition should return number between 0 and canvas height');
    }

    // Test isOutOfVerticalBounds
    if (!window.BoundaryUtils.isOutOfVerticalBounds(-1, 600)) {
        throw new Error('isOutOfVerticalBounds should detect y < 0');
    }

    if (!window.BoundaryUtils.isOutOfVerticalBounds(601, 600)) {
        throw new Error('isOutOfVerticalBounds should detect y > canvasHeight');
    }

    if (window.BoundaryUtils.isOutOfVerticalBounds(300, 600)) {
        throw new Error('isOutOfVerticalBounds should return false when in bounds');
    }

    // Test isPastWrapThreshold
    if (!window.BoundaryUtils.isPastWrapThreshold(851, 800, 50)) {
        throw new Error('isPastWrapThreshold should detect x > width + threshold');
    }

    if (window.BoundaryUtils.isPastWrapThreshold(800, 800, 50)) {
        throw new Error('isPastWrapThreshold should return false when below threshold');
    }
});

// Test 13: SpiderFactory module (Phase 5C)
test('SpiderFactory exports to window and creates spider state', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.SpiderFactory !== 'undefined') {
        throw new Error('window.SpiderFactory already defined before loading script');
    }

    // Load spider-factory.js
    loadScript(window, path.join(__dirname, 'spider-factory.js'));

    // Verify SpiderFactory is now defined on window
    if (typeof window.SpiderFactory === 'undefined') {
        throw new Error('window.SpiderFactory not defined after loading spider-factory.js');
    }

    // Verify it has expected methods
    if (typeof window.SpiderFactory.calculateSpeedMultiplier !== 'function') {
        throw new Error('SpiderFactory missing calculateSpeedMultiplier method');
    }

    if (typeof window.SpiderFactory.calculateBodySize !== 'function') {
        throw new Error('SpiderFactory missing calculateBodySize method');
    }

    if (typeof window.SpiderFactory.assignLegGroups !== 'function') {
        throw new Error('SpiderFactory missing assignLegGroups method');
    }

    if (typeof window.SpiderFactory.getElbowBiasPattern !== 'function') {
        throw new Error('SpiderFactory missing getElbowBiasPattern method');
    }

    if (typeof window.SpiderFactory.createInitialSpiderState !== 'function') {
        throw new Error('SpiderFactory missing createInitialSpiderState method');
    }

    // Test calculateSpeedMultiplier
    const speed = window.SpiderFactory.calculateSpeedMultiplier(1.0, 0);
    if (speed !== 1.0) {
        throw new Error('calculateSpeedMultiplier with 0 variation should return base speed');
    }

    // Test calculateBodySize
    const bodySize = window.SpiderFactory.calculateBodySize(100, 200, 0);
    if (typeof bodySize !== 'number' || bodySize < 1000 || bodySize > 3000) {
        throw new Error('calculateBodySize should return reasonable size');
    }

    // Test assignLegGroups
    const groups = window.SpiderFactory.assignLegGroups(8);
    if (!Array.isArray(groups) || groups.length !== 8) {
        throw new Error('assignLegGroups should return array of 8 groups');
    }
    if (groups[1] !== 'A' || groups[0] !== 'B') {
        throw new Error('assignLegGroups should correctly assign A/B groups');
    }

    // Test getElbowBiasPattern
    const elbowBias = window.SpiderFactory.getElbowBiasPattern(8);
    if (!Array.isArray(elbowBias) || elbowBias.length !== 8) {
        throw new Error('getElbowBiasPattern should return array of 8 biases');
    }
    if (elbowBias[0] !== -1 || elbowBias[1] !== 1) {
        throw new Error('getElbowBiasPattern should correctly assign bias values');
    }

    // Test createInitialSpiderState
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
    const state = window.SpiderFactory.createInitialSpiderState(0, config, 600);

    if (!state || typeof state !== 'object') {
        throw new Error('createInitialSpiderState should return state object');
    }

    if (state.x !== -50) {
        throw new Error('Initial spider x should be -50');
    }

    if (typeof state.y !== 'number' || state.y < 0 || state.y > 600) {
        throw new Error('Initial spider y should be within canvas height');
    }

    if (typeof state.speedMultiplier !== 'number' || state.speedMultiplier <= 0) {
        throw new Error('State should have valid speedMultiplier');
    }

    if (typeof state.bodySize !== 'number' || state.bodySize <= 0) {
        throw new Error('State should have valid bodySize');
    }

    if (state.gaitPhase !== 0 || state.hopPhase !== 0) {
        throw new Error('Initial phases should start at 0');
    }
});

// Test 14: PositionUtils module (Phase 5D)
test('PositionUtils exports to window and initializes leg positions', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.PositionUtils !== 'undefined') {
        throw new Error('window.PositionUtils already defined before loading script');
    }

    // Load position-utils.js
    loadScript(window, path.join(__dirname, 'position-utils.js'));

    // Verify PositionUtils is now defined on window
    if (typeof window.PositionUtils === 'undefined') {
        throw new Error('window.PositionUtils not defined after loading position-utils.js');
    }

    // Verify it has expected method
    if (typeof window.PositionUtils.initializeLegWorldPositions !== 'function') {
        throw new Error('PositionUtils missing initializeLegWorldPositions method');
    }

    // Test initializeLegWorldPositions
    const mockFootPositions = [
        { x: -30, y: -40 },
        { x: 30, y: -40 },
        { x: -50, y: -20 },
        { x: 50, y: -20 },
        { x: -50, y: 20 },
        { x: 50, y: 20 },
        { x: -30, y: 40 },
        { x: 30, y: 40 }
    ];

    const positions = window.PositionUtils.initializeLegWorldPositions(500, 300, 100, mockFootPositions, 8);

    if (!Array.isArray(positions) || positions.length !== 8) {
        throw new Error('initializeLegWorldPositions should return array of 8 positions');
    }

    if (typeof positions[0].worldFootX !== 'number' || typeof positions[0].worldFootY !== 'number') {
        throw new Error('Position should have worldFootX and worldFootY');
    }

    if (positions[0].legIndex !== 0) {
        throw new Error('Position should have legIndex');
    }

    // Test scaling - with bodySize=100 (scale=1.0)
    if (positions[0].worldFootX !== 500 + -30 * 1.0) {
        throw new Error('worldFootX should be spider X + scaled relative X');
    }

    if (positions[0].worldFootY !== 300 + -40 * 1.0) {
        throw new Error('worldFootY should be spider Y + scaled relative Y');
    }

    // Test scaling - with bodySize=200 (scale=2.0)
    const positions2x = window.PositionUtils.initializeLegWorldPositions(500, 300, 200, mockFootPositions, 8);
    if (positions2x[0].worldFootX !== 500 + -30 * 2.0) {
        throw new Error('Scaling should double with bodySize=200');
    }
});

// Test 15: ModeController module (Phase 5E)
test('ModeController exports to window and validates animation modes', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.ModeController !== 'undefined') {
        throw new Error('window.ModeController already defined before loading script');
    }

    // Load mode-controller.js
    loadScript(window, path.join(__dirname, 'mode-controller.js'));

    // Verify ModeController is now defined on window
    if (typeof window.ModeController === 'undefined') {
        throw new Error('window.ModeController not defined after loading mode-controller.js');
    }

    // Verify it has expected methods
    if (typeof window.ModeController.shouldShowHoppingControls !== 'function') {
        throw new Error('ModeController missing shouldShowHoppingControls method');
    }

    if (typeof window.ModeController.getAvailableModes !== 'function') {
        throw new Error('ModeController missing getAvailableModes method');
    }

    if (typeof window.ModeController.validateMode !== 'function') {
        throw new Error('ModeController missing validateMode method');
    }

    // Test shouldShowHoppingControls
    if (!window.ModeController.shouldShowHoppingControls('hopping')) {
        throw new Error('shouldShowHoppingControls should return true for hopping mode');
    }

    if (window.ModeController.shouldShowHoppingControls('procedural')) {
        throw new Error('shouldShowHoppingControls should return false for procedural mode');
    }

    // Test getAvailableModes
    const modes = window.ModeController.getAvailableModes();
    if (!Array.isArray(modes) || modes.length !== 2) {
        throw new Error('getAvailableModes should return array of 2 modes');
    }

    if (!modes.includes('procedural') || !modes.includes('hopping')) {
        throw new Error('getAvailableModes should include procedural and hopping');
    }

    // Test validateMode
    if (!window.ModeController.validateMode('procedural')) {
        throw new Error('validateMode should return true for procedural mode');
    }

    if (!window.ModeController.validateMode('hopping')) {
        throw new Error('validateMode should return true for hopping mode');
    }

    if (window.ModeController.validateMode('invalid')) {
        throw new Error('validateMode should return false for invalid mode');
    }
});

// Test 16: KeyboardController module (Phase 5F)
test('KeyboardController exports to window and maps keyboard actions', () => {
    const window = createBrowserEnvironment();

    // Verify window starts clean
    if (typeof window.KeyboardController !== 'undefined') {
        throw new Error('window.KeyboardController already defined before loading script');
    }

    // Load keyboard-controller.js
    loadScript(window, path.join(__dirname, 'keyboard-controller.js'));

    // Verify KeyboardController is now defined on window
    if (typeof window.KeyboardController === 'undefined') {
        throw new Error('window.KeyboardController not defined after loading keyboard-controller.js');
    }

    // Verify it has expected properties and methods
    if (typeof window.KeyboardController.KEYBOARD_ACTIONS !== 'object') {
        throw new Error('KeyboardController missing KEYBOARD_ACTIONS property');
    }

    if (typeof window.KeyboardController.getKeyboardAction !== 'function') {
        throw new Error('KeyboardController missing getKeyboardAction method');
    }

    if (typeof window.KeyboardController.getAllShortcuts !== 'function') {
        throw new Error('KeyboardController missing getAllShortcuts method');
    }

    // Test KEYBOARD_ACTIONS constant
    const actions = window.KeyboardController.KEYBOARD_ACTIONS;
    if (actions['h'] !== 'toggleControls') {
        throw new Error('KEYBOARD_ACTIONS should map h to toggleControls');
    }

    if (actions['f'] !== 'toggleFullscreen') {
        throw new Error('KEYBOARD_ACTIONS should map f to toggleFullscreen');
    }

    if (actions['r'] !== 'resetSpiders') {
        throw new Error('KEYBOARD_ACTIONS should map r to resetSpiders');
    }

    if (actions[' '] !== 'togglePause') {
        throw new Error('KEYBOARD_ACTIONS should map space to togglePause');
    }

    // Test getKeyboardAction
    if (window.KeyboardController.getKeyboardAction('h') !== 'toggleControls') {
        throw new Error('getKeyboardAction should return toggleControls for h key');
    }

    if (window.KeyboardController.getKeyboardAction('H') !== 'toggleControls') {
        throw new Error('getKeyboardAction should be case insensitive');
    }

    if (window.KeyboardController.getKeyboardAction(' ') !== 'togglePause') {
        throw new Error('getKeyboardAction should return togglePause for space key');
    }

    if (window.KeyboardController.getKeyboardAction('x') !== null) {
        throw new Error('getKeyboardAction should return null for unknown key');
    }

    // Test getAllShortcuts
    const shortcuts = window.KeyboardController.getAllShortcuts();
    if (!Array.isArray(shortcuts) || shortcuts.length !== 4) {
        throw new Error('getAllShortcuts should return array of 4 shortcuts');
    }

    const spaceShortcut = shortcuts.find(s => s.action === 'togglePause');
    if (!spaceShortcut || spaceShortcut.key !== 'Space') {
        throw new Error('getAllShortcuts should format space key as "Space"');
    }

    const hShortcut = shortcuts.find(s => s.action === 'toggleControls');
    if (!hShortcut || hShortcut.key !== 'H') {
        throw new Error('getAllShortcuts should format letter keys as uppercase');
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
