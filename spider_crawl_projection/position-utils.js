/**
 * Position Utilities
 *
 * Functions for initializing leg world positions.
 * Extracted from spider-animation.js initializeLegPositions method (Phase 5D)
 */

/**
 * Initialize leg world positions based on spider center and body size
 *
 * @param {number} spiderX - Spider X position
 * @param {number} spiderY - Spider Y position
 * @param {number} bodySize - Spider body size
 * @param {Array} customFootPositions - Array of {x, y} relative foot positions
 * @param {number} legCount - Number of legs (default 8)
 * @returns {Array<Object>} Array of {worldFootX, worldFootY, legIndex} for each leg
 */
function initializeLegWorldPositions(spiderX, spiderY, bodySize, customFootPositions, legCount = 8) {
    // Scale custom positions based on spider's actual body size
    const scale = bodySize / 100;

    const positions = [];
    for (let i = 0; i < legCount; i++) {
        const relPos = customFootPositions[i];

        // Scale and position relative to spider's center
        const worldFootX = spiderX + relPos.x * scale;
        const worldFootY = spiderY + relPos.y * scale;

        positions.push({
            worldFootX,
            worldFootY,
            legIndex: i
        });
    }

    return positions;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeLegWorldPositions
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.PositionUtils = {
        initializeLegWorldPositions
    };
}
