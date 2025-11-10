// animation-math.js
// Animation math functions for spider crawling and hopping
// Phase 2 extraction: Pure math functions with no DOM/canvas dependencies

/**
 * Calculate swing target position for procedural crawling
 * @param {number} currentBodyX - Current X position of spider body
 * @param {number} bodyY - Y position of spider body
 * @param {object} relativeFootPosition - Relative foot position {x, y}
 * @param {number} lurchDistance - Distance body will lurch
 * @param {number} scale - Body size scale factor
 * @returns {object} Target position {x, y}
 */
function calculateSwingTarget(currentBodyX, bodyY, relativeFootPosition, lurchDistance, scale) {
    const futureBodyX = currentBodyX + lurchDistance;
    return {
        x: futureBodyX + relativeFootPosition.x * scale,
        y: bodyY + relativeFootPosition.y * scale
    };
}

/**
 * Interpolate between two positions based on progress
 * @param {object} startPos - Start position {x, y}
 * @param {object} targetPos - Target position {x, y}
 * @param {number} progress - Progress from 0.0 to 1.0
 * @returns {object} Interpolated position {x, y}
 */
function interpolatePosition(startPos, targetPos, progress) {
    return {
        x: startPos.x + (targetPos.x - startPos.x) * progress,
        y: startPos.y + (targetPos.y - startPos.y) * progress
    };
}

/**
 * Calculate lurch distance based on body size
 * @param {number} bodySize - Body size
 * @param {number} lurchFactor - Lurch factor (default 0.4)
 * @returns {number} Lurch distance
 */
function calculateLurchDistance(bodySize, lurchFactor = 0.4) {
    return bodySize * lurchFactor;
}

/**
 * Calculate lurch speed based on body size and phase duration
 * @param {number} bodySize - Body size
 * @param {number} phaseDuration - Duration of lurch phase in ms
 * @param {number} lurchFactor - Lurch factor (default 0.4)
 * @returns {number} Lurch speed
 */
function calculateLurchSpeed(bodySize, phaseDuration, lurchFactor = 0.4) {
    return (bodySize * lurchFactor) / phaseDuration;
}

/**
 * Scale a relative foot position based on body size
 * @param {object} relativePosition - Relative position {x, y}
 * @param {number} bodySize - Current body size
 * @param {number} baseSize - Base size for scaling (default 100)
 * @returns {object} Scaled position {x, y}
 */
function scaledFootPosition(relativePosition, bodySize, baseSize = 100) {
    const scale = bodySize / baseSize;
    return {
        x: relativePosition.x * scale,
        y: relativePosition.y * scale
    };
}

/**
 * Smooth transition between current and target values
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} smoothFactor - Smoothing factor (0.0 to 1.0)
 * @returns {number} Smoothed value
 */
function smoothTransition(current, target, smoothFactor) {
    return current + (target - current) * smoothFactor;
}

/**
 * Calculate swing position for crawling (procedural gait)
 * Merges swing detection and interpolation logic from lines 433-465
 * @param {string} legGroup - Leg group ('A' or 'B')
 * @param {number} crawlPhase - Current crawl phase (0-5)
 * @param {number} stepProgress - Step progress (0.0 to 1.0)
 * @param {number} currentFootX - Current foot X position
 * @param {number} currentFootY - Current foot Y position
 * @param {number} bodyX - Body X position
 * @param {number} bodyY - Body Y position
 * @param {object} relativeFootPos - Relative foot position {x, y}
 * @param {number} bodySize - Body size
 * @returns {object} New foot position {x, y, isSwinging}
 */
function calculateSwingPositionForCrawl(
    legGroup,
    crawlPhase,
    stepProgress,
    currentFootX,
    currentFootY,
    bodyX,
    bodyY,
    relativeFootPos,
    bodySize
) {
    const isSwinging = (crawlPhase === 0 && legGroup === 'A') ||
                      (crawlPhase === 3 && legGroup === 'B');

    if (!isSwinging) {
        return {
            x: currentFootX,
            y: currentFootY,
            isSwinging: false
        };
    }

    // Calculate swing target
    const scale = bodySize / 100;
    const lurchDistance = bodySize * 0.4;
    const futureBodyX = bodyX + lurchDistance;

    const swingTargetX = futureBodyX + relativeFootPos.x * scale;
    const swingTargetY = bodyY + relativeFootPos.y * scale;

    // Interpolate
    return {
        x: currentFootX + (swingTargetX - currentFootX) * stepProgress,
        y: currentFootY + (swingTargetY - currentFootY) * stepProgress,
        isSwinging: true
    };
}

// Export for Node.js (tests)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSwingTarget,
        interpolatePosition,
        calculateLurchDistance,
        calculateLurchSpeed,
        scaledFootPosition,
        smoothTransition,
        calculateSwingPositionForCrawl
    };
}

// Export for browser (make available globally)
if (typeof window !== 'undefined') {
    window.AnimationMath = {
        calculateSwingTarget,
        interpolatePosition,
        calculateLurchDistance,
        calculateLurchSpeed,
        scaledFootPosition,
        smoothTransition,
        calculateSwingPositionForCrawl
    };
}
