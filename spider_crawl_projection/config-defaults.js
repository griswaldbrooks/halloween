// config-defaults.js
// Configuration defaults and validation for spider animation
//
// BROWSER COMPATIBILITY PATTERN:
// - NO ES6 'export' keywords (breaks in browser <script> tags)
// - Define with 'const' and 'function' normally
// - Conditional exports at bottom for both Node.js and browser
// - Browser access: window.ConfigDefaults.DEFAULT_CONFIG
//
// CRITICAL: Do NOT use 'export const' or 'export function' syntax!
// See: PHASE1_LESSONS_LEARNED.md for why this matters

/**
 * Default configuration values for spider animation
 */
const DEFAULT_CONFIG = {
    spiderCount: 5,
    spiderSpeed: 1.0,
    spiderSizeMin: 0.5,
    spiderSizeMax: 3.0,
    sizeVariation: 0.5,      // 0 = all same size, 1 = full range
    speedVariation: 0.5,     // 0 = all same speed, 1 = full range
    paused: false,
    animationMode: 'procedural', // 'procedural' or 'hopping'
    // Hopping parameters
    hopDistanceMin: 6.0,     // Minimum hop distance multiplier (× body size)
    hopDistanceMax: 10.0,    // Maximum hop distance multiplier (× body size)
    hopFrequencyMin: 1,      // Minimum crawl cycles between hops
    hopFrequencyMax: 13,     // Maximum crawl cycles between hops
    hopFlightDuration: 60    // Flight phase duration in ms
};

/**
 * Create a configuration object with optional overrides
 * @param {Object} overrides - Values to override defaults
 * @returns {Object} Merged configuration
 */
function createConfig(overrides = {}) {
    return { ...DEFAULT_CONFIG, ...overrides };
}

/**
 * Validate configuration values
 * @param {Object} config - Configuration to validate
 * @returns {string[]} Array of error messages (empty if valid)
 */
function validateConfig(config) {
    const errors = [];

    if (config.spiderSizeMin > config.spiderSizeMax) {
        errors.push('spiderSizeMin must be <= spiderSizeMax');
    }

    if (config.hopDistanceMin > config.hopDistanceMax) {
        errors.push('hopDistanceMin must be <= hopDistanceMax');
    }

    if (config.hopFrequencyMin > config.hopFrequencyMax) {
        errors.push('hopFrequencyMin must be <= hopFrequencyMax');
    }

    return errors;
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DEFAULT_CONFIG, createConfig, validateConfig };
}

// Export for browser (make available globally)
if (typeof window !== 'undefined') {
    window.ConfigDefaults = { DEFAULT_CONFIG, createConfig, validateConfig };
}
