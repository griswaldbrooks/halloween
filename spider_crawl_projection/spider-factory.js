/**
 * Spider Factory
 *
 * Functions for creating and initializing spider state.
 * Extracted from spider-animation.js Spider.reset method (Phase 5C)
 */

/**
 * Calculate speed multiplier based on base speed and variation
 *
 * @param {number} baseSpeed - Base spider speed
 * @param {number} speedVariation - Variation amount (0-1)
 * @returns {number} Speed multiplier
 */
function calculateSpeedMultiplier(baseSpeed, speedVariation) {
    return baseSpeed * (1 - speedVariation * 0.5 + Math.random() * speedVariation);
}

/**
 * Calculate body size based on size range and variation
 *
 * @param {number} sizeMin - Minimum size
 * @param {number} sizeMax - Maximum size
 * @param {number} sizeVariation - Variation amount (0-1)
 * @returns {number} Body size
 */
function calculateBodySize(sizeMin, sizeMax, sizeVariation) {
    const avgSize = (sizeMin + sizeMax) / 2;
    const sizeSpread = (sizeMax - sizeMin) / 2;
    return (8 + Math.random() * 8) * (avgSize + (Math.random() * 2 - 1) * sizeSpread * sizeVariation);
}

/**
 * Assign legs to groups A or B for alternating gait
 *
 * @param {number} legCount - Number of legs (default 8)
 * @returns {Array<string>} Array of 'A' or 'B' for each leg
 */
function assignLegGroups(legCount = 8) {
    const groupA = [1, 2, 5, 6]; // L1, R2, L3, R4
    const groups = [];
    for (let i = 0; i < legCount; i++) {
        groups.push(groupA.includes(i) ? 'A' : 'B');
    }
    return groups;
}

/**
 * Get elbow bias pattern for IK solution selection
 *
 * @param {number} legCount - Number of legs (default 8)
 * @returns {Array<number>} Array of -1 or 1 for each leg
 */
function getElbowBiasPattern(legCount = 8) {
    // TOP-DOWN VIEW: Elbow bias determines which IK solution (knee position)
    // Pattern: [-1, 1, -1, 1, 1, -1, 1, -1]
    return [-1, 1, -1, 1, 1, -1, 1, -1].slice(0, legCount);
}

/**
 * Create initial spider state
 *
 * @param {number} index - Spider index
 * @param {Object} config - Configuration object
 * @param {number} canvasHeight - Canvas height
 * @returns {Object} Initial spider state
 */
function createInitialSpiderState(index, config, canvasHeight) {
    // Position
    const x = -50;
    const y = Math.random() * canvasHeight;
    const vy = (Math.random() - 0.5) * 0.3;

    // Individual speed based on variation setting
    const speedMultiplier = calculateSpeedMultiplier(config.spiderSpeed, config.speedVariation);

    // Individual size based on variation setting
    const bodySize = calculateBodySize(config.spiderSizeMin, config.spiderSizeMax, config.sizeVariation);

    // Animation state - procedural gait
    const gaitPhase = 0;
    const gaitTimer = 0;
    const stepProgress = 0;

    // Hopping state - ranges from config
    const hopPhase = 0; // Start in CROUCH phase
    const hopTimer = 0;
    const crawlPhase = 0; // Start at beginning of crawl cycle
    const crawlTimer = 0;
    const crawlCyclesRemaining = Math.floor(
        Math.random() * (config.hopFrequencyMax - config.hopFrequencyMin + 1) + config.hopFrequencyMin
    );
    const hopStartX = x;
    const hopTargetX = x + (Math.random() * (config.hopDistanceMax - config.hopDistanceMin) + config.hopDistanceMin);

    return {
        index,
        x,
        y,
        vy,
        speedMultiplier,
        bodySize,
        gaitPhase,
        gaitTimer,
        stepProgress,
        hopPhase,
        hopTimer,
        crawlPhase,
        crawlTimer,
        crawlCyclesRemaining,
        hopStartX,
        hopTargetX
    };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateSpeedMultiplier,
        calculateBodySize,
        assignLegGroups,
        getElbowBiasPattern,
        createInitialSpiderState
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.SpiderFactory = {
        calculateSpeedMultiplier,
        calculateBodySize,
        assignLegGroups,
        getElbowBiasPattern,
        createInitialSpiderState
    };
}
