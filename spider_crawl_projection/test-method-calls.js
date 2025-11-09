#!/usr/bin/env node

// Test: Static analysis to verify all method calls have corresponding definitions
// This test would have caught the missing updateProcedural method

const fs = require('fs');
const path = require('path');

console.log('=== Method Call Validation Test ===\n');

const animationCode = fs.readFileSync(path.join(__dirname, 'spider-animation.js'), 'utf8');

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

// Extract Spider class definition
function extractSpiderClass(code) {
    const classMatch = code.match(/class Spider \{([\s\S]*?)(?=\n\nclass|\n\n\/\/|\n\nfunction|$)/);
    if (!classMatch) {
        throw new Error('Could not find Spider class definition');
    }
    return classMatch[0];
}

// Find all method definitions in Spider class
function findMethodDefinitions(classCode) {
    const methods = new Set();

    // Match method definitions: methodName() { or methodName(params) {
    const methodRegex = /^\s+(\w+)\s*\([^)]*\)\s*\{/gm;
    let match;

    while ((match = methodRegex.exec(classCode)) !== null) {
        methods.add(match[1]);
    }

    return methods;
}

// Find all this.methodName() calls in Spider class
function findMethodCalls(classCode) {
    const calls = new Map(); // method name -> line numbers

    const lines = classCode.split('\n');
    lines.forEach((line, lineNum) => {
        const callRegex = /this\.(\w+)\(/g;
        let match;

        while ((match = callRegex.exec(line)) !== null) {
            const methodName = match[1];
            if (!calls.has(methodName)) {
                calls.set(methodName, []);
            }
            calls.get(methodName).push(lineNum + 1);
        }
    });

    return calls;
}

// Test 1: Spider class exists
test('Spider class definition exists', () => {
    if (!animationCode.includes('class Spider')) {
        throw new Error('Spider class not found in spider-animation.js');
    }
});

// Test 2: All called methods are defined
test('All this.method() calls have corresponding definitions', () => {
    const spiderClass = extractSpiderClass(animationCode);
    const definitions = findMethodDefinitions(spiderClass);
    const calls = findMethodCalls(spiderClass);

    const missing = [];

    for (const [method, lineNumbers] of calls.entries()) {
        // Skip property accesses (not method calls that need definitions)
        if (method === 'x' || method === 'y' || method === 'bodySize' ||
            method === 'legs' || method === 'body' || method === 'color' ||
            method === 'index' || method === 'gaitPhase' || method === 'gaitTimer' ||
            method === 'stepProgress' || method === 'hopPhase' || method === 'hopTimer') {
            continue;
        }

        if (!definitions.has(method)) {
            missing.push(`  - this.${method}() called on lines ${lineNumbers.join(', ')} but not defined`);
        }
    }

    if (missing.length > 0) {
        throw new Error(`Missing method definitions:\n${missing.join('\n')}`);
    }
});

// Test 3: Critical methods are defined
test('Critical animation methods are defined', () => {
    const spiderClass = extractSpiderClass(animationCode);
    const definitions = findMethodDefinitions(spiderClass);

    const criticalMethods = [
        'update',
        'updateProcedural',  // THIS IS THE ONE THAT WAS MISSING!
        'updateHopping',
        'draw',
        'reset'
    ];

    const missing = criticalMethods.filter(m => !definitions.has(m));

    if (missing.length > 0) {
        throw new Error(`Missing critical methods: ${missing.join(', ')}`);
    }
});

// Test 4: update() calls updateProcedural or updateHopping
test('update() method calls updateProcedural or updateHopping', () => {
    const spiderClass = extractSpiderClass(animationCode);

    // Extract update() method
    const updateMatch = spiderClass.match(/update\s*\([^)]*\)\s*\{([\s\S]*?)(?=\n    \w+\s*\(|\n\n    \/\/|\n\})/);
    if (!updateMatch) {
        throw new Error('Could not find update() method');
    }

    const updateBody = updateMatch[0];

    if (!updateBody.includes('updateProcedural') && !updateBody.includes('updateHopping')) {
        throw new Error('update() does not call updateProcedural or updateHopping');
    }

    if (!updateBody.includes('updateProcedural')) {
        throw new Error('update() does not call updateProcedural');
    }

    if (!updateBody.includes('updateHopping')) {
        throw new Error('update() does not call updateHopping');
    }
});

// Test 5: Classes are exported for browser
test('SpiderBody and Leg2D are exported for browser', () => {
    const kinematicsCode = fs.readFileSync(path.join(__dirname, 'leg-kinematics.js'), 'utf8');
    const modelCode = fs.readFileSync(path.join(__dirname, 'spider-model.js'), 'utf8');

    if (!kinematicsCode.includes('window.Leg2D')) {
        throw new Error('Leg2D not exported to window for browser use');
    }

    if (!modelCode.includes('window.SpiderBody')) {
        throw new Error('SpiderBody not exported to window for browser use');
    }
});

// Test 6: Script loading uses onload handlers
test('Scripts are loaded with onload handlers', () => {
    if (!animationCode.includes('script.onload')) {
        throw new Error('Scripts not loaded with onload handlers (race condition risk!)');
    }

    if (!animationCode.includes('scriptsLoaded')) {
        throw new Error('No script loading counter found (race condition risk!)');
    }
});

// Test 7: Animation doesn't start with setTimeout
test('Animation does not start with setTimeout', () => {
    // Check if animate() is called from setTimeout
    const setTimeoutAnimateRegex = /setTimeout\s*\([^)]*animate\s*\(/;
    if (setTimeoutAnimateRegex.test(animationCode)) {
        throw new Error('animate() called from setTimeout (race condition risk!)');
    }
});

// Test 8: Check for common typos in method names
test('No common typos in method names', () => {
    const typos = [
        { correct: 'updateProcedural', typo: 'updateProceedural' },
        { correct: 'updateHopping', typo: 'updateHoping' },
        { correct: 'initializeLegPositions', typo: 'initalizeLegPositions' }
    ];

    const found = [];
    for (const { correct, typo } of typos) {
        if (animationCode.includes(typo)) {
            found.push(`Found typo: ${typo} (should be ${correct})`);
        }
    }

    if (found.length > 0) {
        throw new Error(found.join('\n  '));
    }
});

// Test 9: Exact browser export pattern validation
test('Browser exports use correct typeof window pattern', () => {
    const kinematicsCode = fs.readFileSync(path.join(__dirname, 'leg-kinematics.js'), 'utf8');
    const modelCode = fs.readFileSync(path.join(__dirname, 'spider-model.js'), 'utf8');

    const errors = [];

    // Check leg-kinematics.js has correct pattern
    if (!kinematicsCode.includes("typeof window !== 'undefined'")) {
        errors.push('leg-kinematics.js: Missing "typeof window !== \'undefined\'" check');
    }

    // Check spider-model.js has correct pattern
    if (!modelCode.includes("typeof window !== 'undefined'")) {
        errors.push('spider-model.js: Missing "typeof window !== \'undefined\'" check');
    }

    // Fail if globalThis.window pattern is found (incorrect)
    if (kinematicsCode.includes('globalThis.window')) {
        errors.push('leg-kinematics.js: Found "globalThis.window" - should use "typeof window !== \'undefined\'"');
    }
    if (modelCode.includes('globalThis.window')) {
        errors.push('spider-model.js: Found "globalThis.window" - should use "typeof window !== \'undefined\'"');
    }

    // Fail if globalThis exports are found (incorrect)
    if (kinematicsCode.includes('globalThis.Leg2D')) {
        errors.push('leg-kinematics.js: Found "globalThis.Leg2D" - should use "window.Leg2D"');
    }
    if (modelCode.includes('globalThis.SpiderBody')) {
        errors.push('spider-model.js: Found "globalThis.SpiderBody" - should use "window.SpiderBody"');
    }

    if (errors.length > 0) {
        throw new Error('Browser export pattern violations:\n  ' + errors.join('\n  '));
    }
});

// Test 10: Window object export validation
test('Browser exports use window.ClassName not globalThis', () => {
    const kinematicsCode = fs.readFileSync(path.join(__dirname, 'leg-kinematics.js'), 'utf8');
    const modelCode = fs.readFileSync(path.join(__dirname, 'spider-model.js'), 'utf8');

    const errors = [];

    // Verify exports use window.Leg2D
    const leg2DWindowMatch = kinematicsCode.match(/window\.Leg2D\s*=\s*Leg2D/);
    if (!leg2DWindowMatch) {
        errors.push('leg-kinematics.js: Missing "window.Leg2D = Leg2D" export');
    }

    // Verify exports use window.SpiderBody
    const spiderBodyWindowMatch = modelCode.match(/window\.SpiderBody\s*=\s*SpiderBody/);
    if (!spiderBodyWindowMatch) {
        errors.push('spider-model.js: Missing "window.SpiderBody = SpiderBody" export');
    }

    // Verify no globalThis.Leg2D exports
    if (kinematicsCode.match(/globalThis\.Leg2D\s*=/)) {
        errors.push('leg-kinematics.js: Found "globalThis.Leg2D = ..." - should use "window.Leg2D"');
    }

    // Verify no globalThis.SpiderBody exports
    if (modelCode.match(/globalThis\.SpiderBody\s*=/)) {
        errors.push('spider-model.js: Found "globalThis.SpiderBody = ..." - should use "window.SpiderBody"');
    }

    if (errors.length > 0) {
        throw new Error('Window export pattern violations:\n  ' + errors.join('\n  '));
    }
});

// Test 11: Node.js export compatibility and order
test('Node.js exports come before browser exports', () => {
    const kinematicsCode = fs.readFileSync(path.join(__dirname, 'leg-kinematics.js'), 'utf8');
    const modelCode = fs.readFileSync(path.join(__dirname, 'spider-model.js'), 'utf8');

    const errors = [];

    // Check leg-kinematics.js export order
    const kinematicsNodeExport = kinematicsCode.indexOf("typeof module !== 'undefined'");
    const kinematicsBrowserExport = kinematicsCode.indexOf("typeof window !== 'undefined'");

    if (kinematicsNodeExport === -1) {
        errors.push('leg-kinematics.js: Missing Node.js export check');
    } else if (kinematicsBrowserExport === -1) {
        errors.push('leg-kinematics.js: Missing browser export check');
    } else if (kinematicsNodeExport > kinematicsBrowserExport) {
        errors.push('leg-kinematics.js: Node.js export must come BEFORE browser export');
    }

    // Verify correct module.exports pattern for leg-kinematics.js
    if (!kinematicsCode.match(/module\.exports\s*=\s*\{\s*Leg2D\s*\}/)) {
        errors.push('leg-kinematics.js: module.exports pattern incorrect - should be "module.exports = { Leg2D }"');
    }

    // Check spider-model.js export order
    const modelNodeExport = modelCode.indexOf("typeof module !== 'undefined'");
    const modelBrowserExport = modelCode.indexOf("typeof window !== 'undefined'");

    if (modelNodeExport === -1) {
        errors.push('spider-model.js: Missing Node.js export check');
    } else if (modelBrowserExport === -1) {
        errors.push('spider-model.js: Missing browser export check');
    } else if (modelNodeExport > modelBrowserExport) {
        errors.push('spider-model.js: Node.js export must come BEFORE browser export');
    }

    // Verify correct module.exports pattern for spider-model.js
    if (!modelCode.match(/module\.exports\s*=\s*\{\s*SpiderBody\s*\}/)) {
        errors.push('spider-model.js: module.exports pattern incorrect - should be "module.exports = { SpiderBody }"');
    }

    if (errors.length > 0) {
        throw new Error('Export order and pattern violations:\n  ' + errors.join('\n  '));
    }
});

console.log(`\n${testsPassed}/${testsRun} tests passed\n`);

if (testsPassed !== testsRun) {
    console.log('❌ Some tests failed');
    process.exit(1);
} else {
    console.log('✅ All method call validation tests passed');
    console.log('\n💡 This test would have caught the missing updateProcedural() bug!');
    process.exit(0);
}
