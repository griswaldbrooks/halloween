// test-config-defaults.js
// Tests for configuration defaults and validation

const { DEFAULT_CONFIG, createConfig, validateConfig } = require('./config-defaults.js');

console.log("\n=== CONFIG DEFAULTS TESTS ===\n");

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

// Test DEFAULT_CONFIG structure
test("DEFAULT_CONFIG has spiderCount", DEFAULT_CONFIG.hasOwnProperty('spiderCount'));
test("DEFAULT_CONFIG has spiderSpeed", DEFAULT_CONFIG.hasOwnProperty('spiderSpeed'));
test("DEFAULT_CONFIG has spiderSizeMin", DEFAULT_CONFIG.hasOwnProperty('spiderSizeMin'));
test("DEFAULT_CONFIG has spiderSizeMax", DEFAULT_CONFIG.hasOwnProperty('spiderSizeMax'));
test("DEFAULT_CONFIG has sizeVariation", DEFAULT_CONFIG.hasOwnProperty('sizeVariation'));
test("DEFAULT_CONFIG has speedVariation", DEFAULT_CONFIG.hasOwnProperty('speedVariation'));
test("DEFAULT_CONFIG has paused", DEFAULT_CONFIG.hasOwnProperty('paused'));
test("DEFAULT_CONFIG has animationMode", DEFAULT_CONFIG.hasOwnProperty('animationMode'));
test("DEFAULT_CONFIG has hopDistanceMin", DEFAULT_CONFIG.hasOwnProperty('hopDistanceMin'));
test("DEFAULT_CONFIG has hopDistanceMax", DEFAULT_CONFIG.hasOwnProperty('hopDistanceMax'));
test("DEFAULT_CONFIG has hopFrequencyMin", DEFAULT_CONFIG.hasOwnProperty('hopFrequencyMin'));
test("DEFAULT_CONFIG has hopFrequencyMax", DEFAULT_CONFIG.hasOwnProperty('hopFrequencyMax'));
test("DEFAULT_CONFIG has hopFlightDuration", DEFAULT_CONFIG.hasOwnProperty('hopFlightDuration'));

// Test default values
test("spiderCount defaults to 5", DEFAULT_CONFIG.spiderCount === 5);
test("spiderSpeed defaults to 1.0", DEFAULT_CONFIG.spiderSpeed === 1.0);
test("animationMode defaults to 'procedural'", DEFAULT_CONFIG.animationMode === 'procedural');
test("paused defaults to false", DEFAULT_CONFIG.paused === false);

// Test createConfig
const config1 = createConfig();
test("createConfig() returns defaults", JSON.stringify(config1) === JSON.stringify(DEFAULT_CONFIG));

const config2 = createConfig({ spiderCount: 10, spiderSpeed: 2.0 });
test("createConfig merges spiderCount override", config2.spiderCount === 10);
test("createConfig merges spiderSpeed override", config2.spiderSpeed === 2.0);
test("createConfig keeps unmodified values", config2.spiderSizeMin === DEFAULT_CONFIG.spiderSizeMin);

const originalCount = DEFAULT_CONFIG.spiderCount;
createConfig({ spiderCount: 99 });
test("createConfig does not modify DEFAULT_CONFIG", DEFAULT_CONFIG.spiderCount === originalCount);

// Test validateConfig
const validErrors = validateConfig(DEFAULT_CONFIG);
test("validateConfig accepts valid config", validErrors.length === 0);

const badSize = { ...DEFAULT_CONFIG, spiderSizeMin: 5.0, spiderSizeMax: 1.0 };
const sizeErrors = validateConfig(badSize);
test("validateConfig catches spiderSizeMin > spiderSizeMax", sizeErrors.length > 0 && sizeErrors.some(e => e.includes('spiderSizeMin')));

const badHopDist = { ...DEFAULT_CONFIG, hopDistanceMin: 20.0, hopDistanceMax: 5.0 };
const hopDistErrors = validateConfig(badHopDist);
test("validateConfig catches hopDistanceMin > hopDistanceMax", hopDistErrors.length > 0 && hopDistErrors.some(e => e.includes('hopDistanceMin')));

const badHopFreq = { ...DEFAULT_CONFIG, hopFrequencyMin: 20, hopFrequencyMax: 5 };
const hopFreqErrors = validateConfig(badHopFreq);
test("validateConfig catches hopFrequencyMin > hopFrequencyMax", hopFreqErrors.length > 0 && hopFreqErrors.some(e => e.includes('hopFrequencyMin')));

const multipleErrors = validateConfig({
    ...DEFAULT_CONFIG,
    spiderSizeMin: 5.0,
    spiderSizeMax: 1.0,
    hopDistanceMin: 20.0,
    hopDistanceMax: 5.0
});
test("validateConfig catches multiple errors", multipleErrors.length === 2);

const equalValues = { ...DEFAULT_CONFIG, spiderSizeMin: 2.0, spiderSizeMax: 2.0 };
const equalErrors = validateConfig(equalValues);
test("validateConfig accepts equal min and max", equalErrors.length === 0);

console.log(`\n=== RESULTS: ${passed} passed, ${failed} failed ===\n`);

if (failed > 0) {
    process.exit(1);
}
