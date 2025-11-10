/**
 * Boundary Utilities
 *
 * Handles spider boundary conditions (wrapping and bounce) for canvas edges.
 * Extracted from spider-animation.js Spider.update method (Phase 5B)
 */

/**
 * Handle vertical boundary conditions (top and bottom bounce)
 *
 * @param {number} y - Current Y position
 * @param {number} vy - Current Y velocity
 * @param {number} canvasHeight - Canvas height
 * @returns {Object} New Y position, velocity, and bounce status
 */
function handleVerticalBoundary(y, vy, canvasHeight) {
    if (y < 0 || y > canvasHeight) {
        return {
            y: Math.max(0, Math.min(canvasHeight, y)),
            vy: vy * -1,
            bounced: true
        };
    }
    return { y, vy, bounced: false };
}

/**
 * Handle horizontal boundary conditions (right edge wrap)
 *
 * @param {number} x - Current X position
 * @param {number} canvasWidth - Canvas width
 * @param {number} threshold - Wrap threshold (default 50)
 * @returns {Object} New X position and wrap status
 */
function handleHorizontalWrap(x, canvasWidth, threshold = 50) {
    if (x > canvasWidth + threshold) {
        return {
            x: -threshold,
            wrapped: true
        };
    }
    return { x, wrapped: false };
}

/**
 * Generate random Y position within canvas bounds
 *
 * @param {number} canvasHeight - Canvas height
 * @returns {number} Random Y position
 */
function randomYPosition(canvasHeight) {
    return Math.random() * canvasHeight;
}

/**
 * Check if position is out of vertical bounds
 *
 * @param {number} y - Y position
 * @param {number} canvasHeight - Canvas height
 * @returns {boolean} True if out of bounds
 */
function isOutOfVerticalBounds(y, canvasHeight) {
    return y < 0 || y > canvasHeight;
}

/**
 * Check if position is past horizontal wrap threshold
 *
 * @param {number} x - X position
 * @param {number} canvasWidth - Canvas width
 * @param {number} threshold - Wrap threshold (default 50)
 * @returns {boolean} True if past threshold
 */
function isPastWrapThreshold(x, canvasWidth, threshold = 50) {
    return x > canvasWidth + threshold;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleVerticalBoundary,
        handleHorizontalWrap,
        randomYPosition,
        isOutOfVerticalBounds,
        isPastWrapThreshold
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.BoundaryUtils = {
        handleVerticalBoundary,
        handleHorizontalWrap,
        randomYPosition,
        isOutOfVerticalBounds,
        isPastWrapThreshold
    };
}
