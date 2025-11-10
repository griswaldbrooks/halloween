/**
 * Leg State Calculator
 *
 * Calculates target leg positions during hopping animation phases.
 * Each hop has 5 phases: CROUCH (0), TAKEOFF (1), FLIGHT (2), LANDING (3), PAUSE (4).
 *
 * Extracted from spider-animation.js updateLegHopping method (Phase 5A)
 */

/**
 * Calculate target leg position based on hop phase
 *
 * @param {number} hopPhase - Current hop phase (0-4)
 * @param {number} legIndex - Leg index (0-7)
 * @param {Object} relativePos - Relative foot position {x, y}
 * @param {number} bodyX - Spider body X position
 * @param {number} bodyY - Spider body Y position
 * @param {number} bodySize - Spider body size
 * @returns {Object} Target position and smoothing factor
 */
function calculateLegHopState(hopPhase, legIndex, relativePos, bodyX, bodyY, bodySize) {
    const scale = bodySize / 100;
    const isBackLeg = legIndex >= 4;

    const phaseConfigs = {
        0: { // CROUCH
            backFactor: 0.8,
            frontFactor: 0.8,
            smoothing: 0.3
        },
        1: { // TAKEOFF
            backFactor: 1.2,
            frontFactor: 0.5,
            smoothing: 0.5
        },
        2: { // FLIGHT
            backFactor: 0.4,
            frontFactor: 0.4,
            smoothing: 1.0 // Instant - legs stay tucked
        },
        3: { // LANDING
            backFactor: 0.9,
            frontFactor: 1.1,
            smoothing: isBackLeg ? 0.4 : 0.6
        },
        4: { // PAUSE
            backFactor: 1.0,
            frontFactor: 1.0,
            smoothing: 0.2
        }
    };

    const config = phaseConfigs[hopPhase] || phaseConfigs[4];
    const factor = isBackLeg ? config.backFactor : config.frontFactor;

    return {
        targetX: bodyX + relativePos.x * scale * factor,
        targetY: bodyY + relativePos.y * scale * factor,
        smoothing: config.smoothing,
        isBackLeg,
        factor
    };
}

/**
 * Apply smoothing to leg position (lerp current towards target)
 *
 * @param {number} currentX - Current leg X position
 * @param {number} currentY - Current leg Y position
 * @param {number} targetX - Target leg X position
 * @param {number} targetY - Target leg Y position
 * @param {number} smoothing - Smoothing factor (0-1, higher = faster transition)
 * @returns {Object} New position {x, y}
 */
function applyLegSmoothing(currentX, currentY, targetX, targetY, smoothing) {
    return {
        x: currentX + (targetX - currentX) * smoothing,
        y: currentY + (targetY - currentY) * smoothing
    };
}

/**
 * Get phase configuration for a specific hop phase
 *
 * @param {number} hopPhase - Hop phase (0-4)
 * @returns {Object} Phase config with factors and smoothing
 */
function getPhaseConfig(hopPhase) {
    const configs = {
        0: { name: 'CROUCH', backFactor: 0.8, frontFactor: 0.8, smoothing: 0.3 },
        1: { name: 'TAKEOFF', backFactor: 1.2, frontFactor: 0.5, smoothing: 0.5 },
        2: { name: 'FLIGHT', backFactor: 0.4, frontFactor: 0.4, smoothing: 1.0 },
        3: { name: 'LANDING', backFactor: 0.9, frontFactor: 1.1, smoothing: 0.4 }, // Note: smoothing varies by leg in actual use
        4: { name: 'PAUSE', backFactor: 1.0, frontFactor: 1.0, smoothing: 0.2 }
    };
    return configs[hopPhase] || configs[4];
}

/**
 * Check if a leg is a back leg
 *
 * @param {number} legIndex - Leg index (0-7)
 * @returns {boolean} True if back leg (index >= 4)
 */
function isBackLeg(legIndex) {
    return legIndex >= 4;
}

/**
 * Calculate the leg reach factor for a given phase and leg position
 *
 * @param {number} hopPhase - Hop phase (0-4)
 * @param {boolean} isBackLeg - Whether this is a back leg
 * @returns {number} Reach factor (multiplier for leg extension)
 */
function getLegReachFactor(hopPhase, isBackLeg) {
    const config = getPhaseConfig(hopPhase);
    return isBackLeg ? config.backFactor : config.frontFactor;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateLegHopState,
        applyLegSmoothing,
        getPhaseConfig,
        isBackLeg,
        getLegReachFactor
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.LegStateCalculator = {
        calculateLegHopState,
        applyLegSmoothing,
        getPhaseConfig,
        isBackLeg,
        getLegReachFactor
    };
}
