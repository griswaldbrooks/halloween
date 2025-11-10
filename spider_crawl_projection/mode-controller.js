// Mode Controller
// Manages animation mode logic (procedural vs hopping)

/**
 * Check if hopping controls should be visible
 * @param {string} animationMode - Current animation mode
 * @returns {boolean} True if hopping controls should be shown
 */
function shouldShowHoppingControls(animationMode) {
    return animationMode === 'hopping';
}

/**
 * Get list of available animation modes
 * @returns {string[]} Array of available mode names
 */
function getAvailableModes() {
    return ['procedural', 'hopping'];
}

/**
 * Validate if a mode is valid
 * @param {string} mode - Mode to validate
 * @returns {boolean} True if mode is valid
 */
function validateMode(mode) {
    return getAvailableModes().includes(mode);
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        shouldShowHoppingControls,
        getAvailableModes,
        validateMode
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.ModeController = {
        shouldShowHoppingControls,
        getAvailableModes,
        validateMode
    };
}
