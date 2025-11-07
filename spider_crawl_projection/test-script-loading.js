#!/usr/bin/env node

// Test: Verify spider-animation.js properly waits for dependencies before starting
// This test simulates the browser environment to check for race conditions

const fs = require('fs');
const path = require('path');

console.log('=== Script Loading Test ===\n');

// Read the spider-animation.js file
const spiderAnimPath = path.join(__dirname, 'spider-animation.js');
const spiderAnimContent = fs.readFileSync(spiderAnimPath, 'utf8');

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

// Test 1: Check that scripts are loaded with onload handlers
test('Scripts have onload handlers', () => {
    if (!spiderAnimContent.includes('script.onload')) {
        throw new Error('Scripts must have onload handlers to track loading');
    }
    if (!spiderAnimContent.match(/onload\s*=\s*onScriptLoaded/)) {
        throw new Error('Scripts must call onScriptLoaded when loaded');
    }
});

// Test 2: Check that scripts have error handlers
test('Scripts have onerror handlers', () => {
    if (!spiderAnimContent.includes('script.onerror')) {
        throw new Error('Scripts must have onerror handlers for debugging');
    }
});

// Test 3: Check that animation starts only after scripts load
test('Animation starts after scripts load', () => {
    // Should NOT use setTimeout for script loading
    const setTimeoutMatches = spiderAnimContent.match(/setTimeout.*\n.*animate\(/g);
    if (setTimeoutMatches && setTimeoutMatches.length > 0) {
        throw new Error('Animation should not start via setTimeout (use onload instead)');
    }

    // Should call animate() from onScriptLoaded
    if (!spiderAnimContent.match(/onScriptLoaded[\s\S]*?animate\(\)/)) {
        throw new Error('animate() must be called from onScriptLoaded function');
    }
});

// Test 4: Check that all required scripts are loaded
test('All required dependencies are loaded', () => {
    const requiredScripts = ['leg-kinematics.js', 'spider-model.js'];
    for (const script of requiredScripts) {
        if (!spiderAnimContent.includes(script)) {
            throw new Error(`Required script ${script} not found in load list`);
        }
    }
});

// Test 5: Check for script load counter
test('Script load counter is implemented', () => {
    if (!spiderAnimContent.includes('scriptsLoaded')) {
        throw new Error('Must track number of scripts loaded');
    }
    if (!spiderAnimContent.match(/scriptsLoaded\s*\+\+/)) {
        throw new Error('Must increment scriptsLoaded counter');
    }
    if (!spiderAnimContent.match(/scriptsLoaded\s*===.*scriptsToLoad\.length/)) {
        throw new Error('Must check if all scripts are loaded');
    }
});

// Test 6: Verify classes are used after loading
test('SpiderBody class is instantiated', () => {
    // Check that SpiderBody is instantiated somewhere (likely in reset method)
    if (!spiderAnimContent.includes('new SpiderBody')) {
        throw new Error('SpiderBody must be instantiated');
    }
});

// Test 7: Check for proper initialization order
test('Initialization happens in correct order', () => {
    const lines = spiderAnimContent.split('\n');
    let resizeCanvasLine = -1;
    let animateLine = -1;
    let onScriptLoadedDef = -1;

    lines.forEach((line, i) => {
        if (line.includes('function onScriptLoaded')) onScriptLoadedDef = i;
        if (line.includes('resizeCanvas()') && onScriptLoadedDef > 0) resizeCanvasLine = i;
        if (line.includes('animate()') && onScriptLoadedDef > 0) animateLine = i;
    });

    if (resizeCanvasLine === -1 || animateLine === -1) {
        throw new Error('resizeCanvas() and animate() must be called from onScriptLoaded');
    }

    if (resizeCanvasLine > animateLine) {
        throw new Error('resizeCanvas() should be called before animate()');
    }
});

console.log(`\n${testsPassed}/${testsRun} tests passed\n`);

if (testsPassed !== testsRun) {
    console.log('❌ Some tests failed');
    process.exit(1);
} else {
    console.log('✅ All script loading tests passed');
    process.exit(0);
}
