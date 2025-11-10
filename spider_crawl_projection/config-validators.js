// config-validators.js
// Configuration value parsing and validation utilities
//
// BROWSER COMPATIBILITY PATTERN:
// - NO ES6 'export' keywords (breaks in browser <script> tags)
// - Define with 'const' and 'function' normally
// - Conditional exports at bottom for both Node.js and browser
// - Browser access: window.ConfigValidators.methodName()
//
// CRITICAL: Do NOT use 'export const' or 'export function' syntax!
// See: PHASE1_LESSONS_LEARNED.md for why this matters

/**
 * Parse a configuration value from string to appropriate numeric type
 * Handles both integer and float parsing
 */
function parseConfigValue(value) {
    if (typeof value === 'number') {
        return value;
    }

    if (typeof value === 'string') {
        // Try parsing as float first (handles both int and float strings)
        const num = Number.parseFloat(value);
        if (!Number.isNaN(num)) {
            return num;
        }
    }

    return value;
}

/**
 * Validate spider count is within acceptable range
 */
function validateSpiderCount(count) {
    const parsed = Number.parseInt(count);
    return !Number.isNaN(parsed) && parsed >= 1 && parsed <= 100;
}

/**
 * Validate speed is positive and reasonable
 */
function validateSpeed(speed) {
    const parsed = Number.parseFloat(speed);
    return !Number.isNaN(parsed) && parsed > 0 && parsed <= 10;
}

/**
 * Validate variation is between 0 and 1
 */
function validateVariation(variation) {
    const parsed = Number.parseFloat(variation);
    return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 1;
}

/**
 * Validate size value is positive
 */
function validateSize(size) {
    const parsed = Number.parseFloat(size);
    return !Number.isNaN(parsed) && parsed > 0 && parsed <= 10;
}

/**
 * Validate hop distance is positive
 */
function validateHopDistance(distance) {
    const parsed = Number.parseFloat(distance);
    return !Number.isNaN(parsed) && parsed > 0 && parsed <= 50;
}

/**
 * Validate hop frequency is positive integer
 */
function validateHopFrequency(frequency) {
    const parsed = Number.parseInt(frequency);
    return !Number.isNaN(parsed) && parsed >= 0 && parsed <= 100;
}

/**
 * Validate hop flight duration is positive integer
 */
function validateHopFlightDuration(duration) {
    const parsed = Number.parseInt(duration);
    return !Number.isNaN(parsed) && parsed > 0 && parsed <= 1000;
}

/**
 * Ensure min value doesn't exceed max value
 * Returns adjusted {min, max} pair
 */
function clampMinMax(min, max) {
    const adjustedMin = Math.min(min, max);
    const adjustedMax = Math.max(min, max);
    return {
        min: adjustedMin,
        max: adjustedMax,
        adjusted: adjustedMin !== min || adjustedMax !== max
    };
}

/**
 * Parse and validate size min/max pair
 * Returns validated and clamped values
 */
function validateSizeRange(sizeMin, sizeMax) {
    const min = Number.parseFloat(sizeMin);
    const max = Number.parseFloat(sizeMax);

    if (Number.isNaN(min) || Number.isNaN(max)) {
        return {
            valid: false,
            error: 'Size values must be numbers'
        };
    }

    if (min <= 0 || max <= 0) {
        return {
            valid: false,
            error: 'Size values must be positive'
        };
    }

    const clamped = clampMinMax(min, max);
    return {
        valid: true,
        min: clamped.min,
        max: clamped.max,
        adjusted: clamped.adjusted
    };
}

/**
 * Parse and validate hop distance min/max pair
 * Returns validated and clamped values
 */
function validateHopDistanceRange(distanceMin, distanceMax) {
    const min = Number.parseFloat(distanceMin);
    const max = Number.parseFloat(distanceMax);

    if (Number.isNaN(min) || Number.isNaN(max)) {
        return {
            valid: false,
            error: 'Hop distance values must be numbers'
        };
    }

    if (min <= 0 || max <= 0) {
        return {
            valid: false,
            error: 'Hop distance values must be positive'
        };
    }

    const clamped = clampMinMax(min, max);
    return {
        valid: true,
        min: clamped.min,
        max: clamped.max,
        adjusted: clamped.adjusted
    };
}

/**
 * Parse and validate hop frequency min/max pair
 * Returns validated and clamped values
 */
function validateHopFrequencyRange(frequencyMin, frequencyMax) {
    const min = Number.parseInt(frequencyMin);
    const max = Number.parseInt(frequencyMax);

    if (Number.isNaN(min) || Number.isNaN(max)) {
        return {
            valid: false,
            error: 'Hop frequency values must be integers'
        };
    }

    if (min < 0 || max < 0) {
        return {
            valid: false,
            error: 'Hop frequency values must be non-negative'
        };
    }

    const clamped = clampMinMax(min, max);
    return {
        valid: true,
        min: clamped.min,
        max: clamped.max,
        adjusted: clamped.adjusted
    };
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
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
    };
}

// Export for browser (make available globally)
if (typeof window !== 'undefined') {
    window.ConfigValidators = {
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
    };
}
