/**
 * Hopping Logic for Spider Animation
 *
 * Manages the 5-phase hopping state machine and crawl cycling for jumping spider locomotion.
 * Hopping phases: CROUCH (0), TAKEOFF (1), FLIGHT (2), LANDING (3), CRAWL (4)
 *
 * Extracted from spider-animation.js for unit testing (Phase 3B).
 */

/**
 * Hopping phase constants
 */
const HOP_PHASE = {
    CROUCH: 0,
    TAKEOFF: 1,
    FLIGHT: 2,
    LANDING: 3,
    CRAWL: 4
};

/**
 * Get hop phase duration (CROUCH, TAKEOFF, FLIGHT, LANDING - does not include CRAWL)
 * @param {number} phase - Hop phase (0-3)
 * @param {Object} config - Configuration object with hopFlightDuration
 * @returns {number} Duration in milliseconds
 */
function getHopPhaseDuration(phase, config) {
    const durations = [
        100,  // CROUCH
        200,  // TAKEOFF
        config.hopFlightDuration || 60,  // FLIGHT
        200   // LANDING
    ];

    if (phase < 0 || phase >= durations.length) {
        return durations[0]; // Default
    }

    return durations[phase];
}

/**
 * Get all hop phase durations (excluding CRAWL)
 * @param {Object} config - Configuration object with hopFlightDuration
 * @returns {number[]} Array of phase durations
 */
function getAllHopPhaseDurations(config) {
    return [
        100,
        200,
        config.hopFlightDuration || 60,
        200
    ];
}

/**
 * Get the next hop phase
 * @param {number} currentPhase - Current hop phase (0-3)
 * @returns {number} Next hop phase (0-3, wraps back to 0 after 3)
 */
function getNextHopPhase(currentPhase) {
    // Only cycles through phases 0-3 (CRAWL phase is handled separately)
    return (currentPhase + 1) % 4;
}

/**
 * Calculate hop distance based on configuration
 * @param {Object} config - Configuration with hopDistanceMin, hopDistanceMax
 * @returns {number} Random hop distance multiplier
 */
function calculateHopDistance(config) {
    const distanceRange = config.hopDistanceMax - config.hopDistanceMin;
    return config.hopDistanceMin + (Math.random() * distanceRange);
}

/**
 * Calculate hop target X position
 * @param {number} currentX - Current spider X position
 * @param {number} bodySize - Spider body size
 * @param {Object} config - Configuration with hopDistanceMin, hopDistanceMax
 * @returns {number} Target X position after hop
 */
function calculateHopTargetX(currentX, bodySize, config) {
    const hopDistanceMultiplier = calculateHopDistance(config);
    return currentX + (bodySize * hopDistanceMultiplier);
}

/**
 * Calculate random crawl cycles based on configuration
 * @param {Object} config - Configuration with hopFrequencyMin, hopFrequencyMax
 * @returns {number} Random number of crawl cycles before next hop
 */
function calculateCrawlCycles(config) {
    const cycleRange = config.hopFrequencyMax - config.hopFrequencyMin;
    return Math.floor(Math.random() * cycleRange) + config.hopFrequencyMin;
}

/**
 * Check if spider should start hopping (crawl cycles exhausted)
 * @param {number} crawlCyclesRemaining - Number of crawl cycles left
 * @returns {boolean} True if should transition to hopping
 */
function shouldStartHopping(crawlCyclesRemaining) {
    return crawlCyclesRemaining <= 0;
}

/**
 * Update hop state for phases 0-3 (CROUCH, TAKEOFF, FLIGHT, LANDING)
 * @param {Object} state - Current hop state { hopPhase, hopTimer, hopProgress, hopStartX, hopTargetX }
 * @param {number} deltaTime - Time elapsed since last update (ms)
 * @param {number} speedMultiplier - Animation speed multiplier
 * @param {Object} config - Configuration object
 * @returns {Object} Updated state with phaseChanged flag
 */
function updateHopPhase(state, deltaTime, speedMultiplier, config) {
    const { hopPhase, hopTimer } = state;

    // Increment timer
    const newTimer = hopTimer + (deltaTime * speedMultiplier);
    const phaseDuration = getHopPhaseDuration(hopPhase, config);

    let newPhase = hopPhase;
    let finalTimer = newTimer;
    let phaseChanged = false;
    let newHopStartX = state.hopStartX;
    let newHopTargetX = state.hopTargetX;

    if (newTimer >= phaseDuration) {
        finalTimer = 0;
        newPhase = getNextHopPhase(hopPhase);
        phaseChanged = true;

        // Initialize hop distance at start of takeoff (when entering phase 1)
        if (newPhase === HOP_PHASE.TAKEOFF) {
            newHopStartX = state.spiderX || 0;
            newHopTargetX = state.hopTargetX; // Will be set separately
        }

        // After landing (phase 3 → 0), switch to CRAWL mode
        if (newPhase === HOP_PHASE.CROUCH) {
            newPhase = HOP_PHASE.CRAWL;
        }
    }

    const hopProgress = finalTimer / phaseDuration;

    return {
        hopPhase: newPhase,
        hopTimer: finalTimer,
        hopProgress: hopProgress,
        hopStartX: newHopStartX,
        hopTargetX: newHopTargetX,
        phaseChanged: phaseChanged
    };
}

/**
 * Update crawl state during CRAWL phase (phase 4)
 * @param {Object} state - Current state { crawlPhase, crawlTimer, crawlCyclesRemaining }
 * @param {number} deltaTime - Time elapsed since last update (ms)
 * @param {number} speedMultiplier - Animation speed multiplier
 * @param {Object} config - Configuration object
 * @returns {Object} Updated state with shouldTransitionToHop flag
 */
function updateCrawlPhase(state, deltaTime, speedMultiplier, config) {
    const crawlPhaseDurations = [200, 150, 100, 200, 150, 100]; // Same as procedural gait
    const { crawlPhase, crawlTimer, crawlCyclesRemaining } = state;

    // Increment timer
    const newTimer = crawlTimer + (deltaTime * speedMultiplier);
    const phaseDuration = crawlPhaseDurations[crawlPhase];

    let newPhase = crawlPhase;
    let finalTimer = newTimer;
    let newCyclesRemaining = crawlCyclesRemaining;
    let shouldTransitionToHop = false;
    let phaseChanged = false;

    if (newTimer >= phaseDuration) {
        finalTimer = 0;
        newPhase = (crawlPhase + 1) % 6;
        phaseChanged = true;

        // Completed one crawl cycle (back to phase 0)?
        if (newPhase === 0) {
            newCyclesRemaining--;
            if (newCyclesRemaining <= 0) {
                // Done crawling, prepare to hop again
                shouldTransitionToHop = true;
                newCyclesRemaining = calculateCrawlCycles(config);
            }
        }
    }

    const stepProgress = finalTimer / phaseDuration;

    return {
        crawlPhase: newPhase,
        crawlTimer: finalTimer,
        crawlCyclesRemaining: newCyclesRemaining,
        stepProgress: stepProgress,
        shouldTransitionToHop: shouldTransitionToHop,
        phaseChanged: phaseChanged
    };
}

/**
 * Create initial hopping state
 * @param {Object} config - Configuration object
 * @param {number} canvasHeight - Canvas height for random Y position
 * @returns {Object} Initial state
 */
function createInitialHoppingState(config, canvasHeight = 800) {
    const crawlCycleRange = config.hopFrequencyMax - config.hopFrequencyMin;

    return {
        hopPhase: Math.floor(Math.random() * 5), // Random phase 0-4
        hopTimer: Math.random() * 200,
        hopProgress: 0,
        hopStartX: 0,
        hopTargetX: 0,
        crawlPhase: 0,
        crawlTimer: 0,
        crawlCyclesRemaining: Math.floor(Math.random() * crawlCycleRange) + config.hopFrequencyMin
    };
}

/**
 * Check if current phase is the flight phase
 * @param {number} hopPhase - Current hop phase
 * @returns {boolean} True if in flight phase
 */
function isFlightPhase(hopPhase) {
    return hopPhase === HOP_PHASE.FLIGHT;
}

/**
 * Check if current phase is crawl mode
 * @param {number} hopPhase - Current hop phase
 * @returns {boolean} True if in crawl mode
 */
function isCrawlMode(hopPhase) {
    return hopPhase === HOP_PHASE.CRAWL;
}

/**
 * Get crawl phase durations (same as procedural gait)
 * @returns {number[]} Array of crawl phase durations
 */
function getCrawlPhaseDurations() {
    return [200, 150, 100, 200, 150, 100];
}

/**
 * Check if leg is in swing phase during crawl
 * @param {string} legGroup - Leg group ('A' or 'B')
 * @param {number} crawlPhase - Current crawl phase (0-5)
 * @returns {boolean} True if leg should be swinging
 */
function isLegSwingingInCrawl(legGroup, crawlPhase) {
    return (crawlPhase === 0 && legGroup === 'A') ||
           (crawlPhase === 3 && legGroup === 'B');
}

/**
 * Check if current crawl phase is a lurch phase
 * @param {number} crawlPhase - Current crawl phase (0-5)
 * @returns {boolean} True if this is a lurch phase
 */
function isCrawlLurchPhase(crawlPhase) {
    return crawlPhase === 1 || crawlPhase === 4;
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HOP_PHASE,
        getHopPhaseDuration,
        getAllHopPhaseDurations,
        getNextHopPhase,
        calculateHopDistance,
        calculateHopTargetX,
        calculateCrawlCycles,
        shouldStartHopping,
        updateHopPhase,
        updateCrawlPhase,
        createInitialHoppingState,
        isFlightPhase,
        isCrawlMode,
        getCrawlPhaseDurations,
        isLegSwingingInCrawl,
        isCrawlLurchPhase
    };
}

// Browser export - MUST use typeof for safety (learned from Phase 1)
if (typeof window !== 'undefined') {
    window.HoppingLogic = {
        HOP_PHASE,
        getHopPhaseDuration,
        getAllHopPhaseDurations,
        getNextHopPhase,
        calculateHopDistance,
        calculateHopTargetX,
        calculateCrawlCycles,
        shouldStartHopping,
        updateHopPhase,
        updateCrawlPhase,
        createInitialHoppingState,
        isFlightPhase,
        isCrawlMode,
        getCrawlPhaseDurations,
        isLegSwingingInCrawl,
        isCrawlLurchPhase
    };
}
