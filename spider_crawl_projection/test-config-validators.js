// test-config-validators.js
// Tests for configuration value parsing and validation

// Simple test framework (same as other test files)
let testsPassed = 0;
let testsFailed = 0;

function describe(name, fn) {
    console.log(`\n${name}`);
    fn();
}

function test(name, fn) {
    try {
        fn();
        testsPassed++;
        console.log(`  ✓ ${name}`);
    } catch (error) {
        testsFailed++;
        console.log(`  ✗ ${name}`);
        console.log(`    ${error.message}`);
        if (error.expected !== undefined) {
            console.log(`    Expected: ${JSON.stringify(error.expected)}`);
            console.log(`    Received: ${JSON.stringify(error.received)}`);
        }
    }
}

function expect(value) {
    return {
        toBe(expected) {
            if (value !== expected) {
                const error = new Error(`Expected ${value} to be ${expected}`);
                error.expected = expected;
                error.received = value;
                throw error;
            }
        },
        toContain(substring) {
            if (typeof value !== 'string' || !value.includes(substring)) {
                const error = new Error(`Expected "${value}" to contain "${substring}"`);
                error.expected = substring;
                error.received = value;
                throw error;
            }
        }
    };
}

const {
    parseConfigValue,
    validateSpiderCount,
    validateSpeed,
    validateVariation,
    validateSize,
    validateHopDistance,
    validateHopFrequency,
    validateHopFlightDuration,
    clampMinMax,
    validateSizeRange,
    validateHopDistanceRange,
    validateHopFrequencyRange
} = require('./config-validators.js');

describe('ConfigValidators - parseConfigValue', () => {
    test('should pass through numbers unchanged', () => {
        expect(parseConfigValue(42)).toBe(42);
        expect(parseConfigValue(3.14)).toBe(3.14);
        expect(parseConfigValue(0)).toBe(0);
    });

    test('should parse string numbers as floats', () => {
        expect(parseConfigValue('42')).toBe(42);
        expect(parseConfigValue('3.14')).toBe(3.14);
        expect(parseConfigValue('0.5')).toBe(0.5);
    });

    test('should handle integer strings', () => {
        expect(parseConfigValue('100')).toBe(100);
        expect(parseConfigValue('1')).toBe(1);
    });

    test('should return original value for non-numeric strings', () => {
        expect(parseConfigValue('hello')).toBe('hello');
        expect(parseConfigValue('abc')).toBe('abc');
    });

    test('should pass through non-string, non-number types', () => {
        expect(parseConfigValue(null)).toBe(null);
        expect(parseConfigValue(undefined)).toBe(undefined);
        expect(parseConfigValue(true)).toBe(true);
    });
});

describe('ConfigValidators - validateSpiderCount', () => {
    test('should accept valid spider counts', () => {
        expect(validateSpiderCount(1)).toBe(true);
        expect(validateSpiderCount(5)).toBe(true);
        expect(validateSpiderCount(50)).toBe(true);
        expect(validateSpiderCount(100)).toBe(true);
    });

    test('should reject counts below 1', () => {
        expect(validateSpiderCount(0)).toBe(false);
        expect(validateSpiderCount(-1)).toBe(false);
    });

    test('should reject counts above 100', () => {
        expect(validateSpiderCount(101)).toBe(false);
        expect(validateSpiderCount(1000)).toBe(false);
    });

    test('should accept string numbers', () => {
        expect(validateSpiderCount('5')).toBe(true);
        expect(validateSpiderCount('50')).toBe(true);
    });

    test('should reject NaN values', () => {
        expect(validateSpiderCount('abc')).toBe(false);
        expect(validateSpiderCount(NaN)).toBe(false);
    });
});

describe('ConfigValidators - validateSpeed', () => {
    test('should accept valid speeds', () => {
        expect(validateSpeed(0.1)).toBe(true);
        expect(validateSpeed(1)).toBe(true);
        expect(validateSpeed(5)).toBe(true);
        expect(validateSpeed(10)).toBe(true);
    });

    test('should reject zero and negative speeds', () => {
        expect(validateSpeed(0)).toBe(false);
        expect(validateSpeed(-1)).toBe(false);
    });

    test('should reject speeds above 10', () => {
        expect(validateSpeed(10.1)).toBe(false);
        expect(validateSpeed(100)).toBe(false);
    });

    test('should accept string numbers', () => {
        expect(validateSpeed('1.5')).toBe(true);
        expect(validateSpeed('5')).toBe(true);
    });

    test('should reject NaN values', () => {
        expect(validateSpeed('fast')).toBe(false);
        expect(validateSpeed(NaN)).toBe(false);
    });
});

describe('ConfigValidators - validateVariation', () => {
    test('should accept valid variations (0-1)', () => {
        expect(validateVariation(0)).toBe(true);
        expect(validateVariation(0.5)).toBe(true);
        expect(validateVariation(1)).toBe(true);
    });

    test('should reject negative variations', () => {
        expect(validateVariation(-0.1)).toBe(false);
        expect(validateVariation(-1)).toBe(false);
    });

    test('should reject variations above 1', () => {
        expect(validateVariation(1.1)).toBe(false);
        expect(validateVariation(2)).toBe(false);
    });

    test('should accept string numbers', () => {
        expect(validateVariation('0.5')).toBe(true);
        expect(validateVariation('0')).toBe(true);
        expect(validateVariation('1')).toBe(true);
    });

    test('should reject NaN values', () => {
        expect(validateVariation('much')).toBe(false);
        expect(validateVariation(NaN)).toBe(false);
    });
});

describe('ConfigValidators - validateSize', () => {
    test('should accept valid sizes', () => {
        expect(validateSize(0.1)).toBe(true);
        expect(validateSize(1)).toBe(true);
        expect(validateSize(5)).toBe(true);
        expect(validateSize(10)).toBe(true);
    });

    test('should reject zero and negative sizes', () => {
        expect(validateSize(0)).toBe(false);
        expect(validateSize(-1)).toBe(false);
    });

    test('should reject sizes above 10', () => {
        expect(validateSize(10.1)).toBe(false);
        expect(validateSize(100)).toBe(false);
    });
});

describe('ConfigValidators - validateHopDistance', () => {
    test('should accept valid hop distances', () => {
        expect(validateHopDistance(1)).toBe(true);
        expect(validateHopDistance(10)).toBe(true);
        expect(validateHopDistance(50)).toBe(true);
    });

    test('should reject zero and negative distances', () => {
        expect(validateHopDistance(0)).toBe(false);
        expect(validateHopDistance(-1)).toBe(false);
    });

    test('should reject distances above 50', () => {
        expect(validateHopDistance(51)).toBe(false);
        expect(validateHopDistance(100)).toBe(false);
    });
});

describe('ConfigValidators - validateHopFrequency', () => {
    test('should accept valid hop frequencies', () => {
        expect(validateHopFrequency(0)).toBe(true);
        expect(validateHopFrequency(10)).toBe(true);
        expect(validateHopFrequency(100)).toBe(true);
    });

    test('should reject negative frequencies', () => {
        expect(validateHopFrequency(-1)).toBe(false);
        expect(validateHopFrequency(-10)).toBe(false);
    });

    test('should reject frequencies above 100', () => {
        expect(validateHopFrequency(101)).toBe(false);
        expect(validateHopFrequency(1000)).toBe(false);
    });
});

describe('ConfigValidators - validateHopFlightDuration', () => {
    test('should accept valid flight durations', () => {
        expect(validateHopFlightDuration(1)).toBe(true);
        expect(validateHopFlightDuration(60)).toBe(true);
        expect(validateHopFlightDuration(1000)).toBe(true);
    });

    test('should reject zero and negative durations', () => {
        expect(validateHopFlightDuration(0)).toBe(false);
        expect(validateHopFlightDuration(-1)).toBe(false);
    });

    test('should reject durations above 1000', () => {
        expect(validateHopFlightDuration(1001)).toBe(false);
        expect(validateHopFlightDuration(10000)).toBe(false);
    });
});

describe('ConfigValidators - clampMinMax', () => {
    test('should not adjust when min < max', () => {
        const result = clampMinMax(1, 10);
        expect(result.min).toBe(1);
        expect(result.max).toBe(10);
        expect(result.adjusted).toBe(false);
    });

    test('should swap when min > max', () => {
        const result = clampMinMax(10, 1);
        expect(result.min).toBe(1);
        expect(result.max).toBe(10);
        expect(result.adjusted).toBe(true);
    });

    test('should handle equal min and max', () => {
        const result = clampMinMax(5, 5);
        expect(result.min).toBe(5);
        expect(result.max).toBe(5);
        expect(result.adjusted).toBe(false);
    });

    test('should work with decimals', () => {
        const result = clampMinMax(3.5, 1.5);
        expect(result.min).toBe(1.5);
        expect(result.max).toBe(3.5);
        expect(result.adjusted).toBe(true);
    });
});

describe('ConfigValidators - validateSizeRange', () => {
    test('should accept valid size range', () => {
        const result = validateSizeRange(0.5, 3.0);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(0.5);
        expect(result.max).toBe(3.0);
        expect(result.adjusted).toBe(false);
    });

    test('should auto-correct inverted range', () => {
        const result = validateSizeRange(3.0, 0.5);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(0.5);
        expect(result.max).toBe(3.0);
        expect(result.adjusted).toBe(true);
    });

    test('should reject zero sizes', () => {
        const result = validateSizeRange(0, 3.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('positive');
    });

    test('should reject negative sizes', () => {
        const result = validateSizeRange(-1, 3.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('positive');
    });

    test('should reject non-numeric values', () => {
        const result = validateSizeRange('abc', 3.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('numbers');
    });

    test('should parse string numbers', () => {
        const result = validateSizeRange('0.5', '3.0');
        expect(result.valid).toBe(true);
        expect(result.min).toBe(0.5);
        expect(result.max).toBe(3.0);
    });
});

describe('ConfigValidators - validateHopDistanceRange', () => {
    test('should accept valid hop distance range', () => {
        const result = validateHopDistanceRange(6.0, 10.0);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(6.0);
        expect(result.max).toBe(10.0);
        expect(result.adjusted).toBe(false);
    });

    test('should auto-correct inverted range', () => {
        const result = validateHopDistanceRange(10.0, 6.0);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(6.0);
        expect(result.max).toBe(10.0);
        expect(result.adjusted).toBe(true);
    });

    test('should reject zero distances', () => {
        const result = validateHopDistanceRange(0, 10.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('positive');
    });

    test('should reject negative distances', () => {
        const result = validateHopDistanceRange(-1, 10.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('positive');
    });

    test('should reject non-numeric values', () => {
        const result = validateHopDistanceRange('far', 10.0);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('numbers');
    });
});

describe('ConfigValidators - validateHopFrequencyRange', () => {
    test('should accept valid hop frequency range', () => {
        const result = validateHopFrequencyRange(1, 13);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(1);
        expect(result.max).toBe(13);
        expect(result.adjusted).toBe(false);
    });

    test('should auto-correct inverted range', () => {
        const result = validateHopFrequencyRange(13, 1);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(1);
        expect(result.max).toBe(13);
        expect(result.adjusted).toBe(true);
    });

    test('should accept zero frequency', () => {
        const result = validateHopFrequencyRange(0, 10);
        expect(result.valid).toBe(true);
        expect(result.min).toBe(0);
        expect(result.max).toBe(10);
    });

    test('should reject negative frequencies', () => {
        const result = validateHopFrequencyRange(-1, 10);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('non-negative');
    });

    test('should reject non-numeric values', () => {
        const result = validateHopFrequencyRange('often', 10);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('integers');
    });

    test('should parse string integers', () => {
        const result = validateHopFrequencyRange('1', '13');
        expect(result.valid).toBe(true);
        expect(result.min).toBe(1);
        expect(result.max).toBe(13);
    });
});

// Summary
console.log(`\n${'='.repeat(60)}`);
console.log(`Tests passed: ${testsPassed}`);
console.log(`Tests failed: ${testsFailed}`);
console.log('='.repeat(60));

if (testsFailed > 0) {
    process.exit(1);
}
