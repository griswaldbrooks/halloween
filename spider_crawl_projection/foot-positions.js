// foot-positions.js
// User-verified non-intersecting foot positions for spider legs
//
// BROWSER COMPATIBILITY PATTERN:
// - NO ES6 'export' keywords (breaks in browser <script> tags)
// - Define with 'const' and 'function' normally
// - Conditional exports at bottom for both Node.js and browser
// - Browser access: window.FootPositions.CUSTOM_FOOT_POSITIONS
//
// CRITICAL: Do NOT use 'export const' or 'export function' syntax!
// See: PHASE1_LESSONS_LEARNED.md for why this matters

/**
 * User-verified non-intersecting foot positions
 * Coordinates are relative to body center at bodySize=100
 * See test-user-config.js for intersection validation
 */
const CUSTOM_FOOT_POSITIONS = [
    { x: 160.2, y: 100.2 },  // Leg 0
    { x: 160.2, y: -100.2 }, // Leg 1
    { x: 115.2, y: 130.4 },  // Leg 2
    { x: 115.2, y: -130.4 }, // Leg 3
    { x: -60.2, y: 130.4 },  // Leg 4
    { x: -60.2, y: -130.4 }, // Leg 5
    { x: -100.2, y: 100.2 }, // Leg 6
    { x: -100.2, y: -100.2 } // Leg 7
];

/**
 * Get foot position for a specific leg, scaled to body size
 * @param {number} legIndex - Index of the leg (0-7)
 * @param {number} bodySize - Body size to scale to (default: 100)
 * @returns {Object} Position with x and y properties
 */
function getFootPosition(legIndex, bodySize = 100) {
    const scale = bodySize / 100;
    const pos = CUSTOM_FOOT_POSITIONS[legIndex];
    return {
        x: pos.x * scale,
        y: pos.y * scale
    };
}

/**
 * Get total number of legs
 * @returns {number} Number of legs (8)
 */
function getLegCount() {
    return CUSTOM_FOOT_POSITIONS.length;
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CUSTOM_FOOT_POSITIONS, getFootPosition, getLegCount };
}

// Export for browser (make available globally)
if (typeof window !== 'undefined') {
    window.FootPositions = { CUSTOM_FOOT_POSITIONS, getFootPosition, getLegCount };
}
