/**
 * Gait State Machine for Spider Animation
 *
 * Manages tetrapod gait phase transitions and timing for procedural spider crawling.
 * The gait uses 6 phases with alternating leg groups (A and B).
 *
 * Extracted from spider-animation.js for unit testing (Phase 3A).
 */

/**
 * Phase durations for the 6-phase gait cycle
 * Phases: 0 (swing A), 1 (lurch), 2 (swing B), 3 (lurch), 4 (swing A), 5 (swing B)
 */
const PHASE_DURATIONS = [200, 150, 100, 200, 150, 100];

/**
 * Get the duration for a specific gait phase
 * @param {number} phase - Gait phase (0-5)
 * @returns {number} Duration in milliseconds
 */
function getGaitPhaseDuration(phase) {
    if (phase < 0 || phase >= PHASE_DURATIONS.length) {
        return PHASE_DURATIONS[0]; // Default to first phase
    }
    return PHASE_DURATIONS[phase];
}

/**
 * Get all phase durations
 * @returns {number[]} Array of phase durations
 */
function getAllPhaseDurations() {
    return [...PHASE_DURATIONS];
}

/**
 * Calculate the next gait phase (cycles 0-5)
 * @param {number} currentPhase - Current gait phase (0-5)
 * @returns {number} Next gait phase (0-5)
 */
function getNextGaitPhase(currentPhase) {
    return (currentPhase + 1) % 6;
}

/**
 * Calculate step progress through the current phase
 * @param {number} timer - Current phase timer value
 * @param {number} phaseDuration - Duration of the current phase
 * @returns {number} Progress from 0.0 to 1.0
 */
function calculateStepProgress(timer, phaseDuration) {
    if (phaseDuration <= 0) {
        return 0;
    }
    const progress = timer / phaseDuration;
    return Math.max(0, Math.min(1, progress)); // Clamp to [0, 1]
}

/**
 * Update gait state based on elapsed time
 * @param {Object} state - Current gait state { gaitPhase, gaitTimer, stepProgress }
 * @param {number} deltaTime - Time elapsed since last update (ms)
 * @param {number} speedMultiplier - Animation speed multiplier (default 1.0)
 * @returns {Object} Updated state { gaitPhase, gaitTimer, stepProgress, phaseChanged }
 */
function updateGaitState(state, deltaTime, speedMultiplier = 1) {
    const { gaitPhase, gaitTimer } = state;

    // Increment timer
    const newTimer = gaitTimer + (deltaTime * speedMultiplier);
    const phaseDuration = getGaitPhaseDuration(gaitPhase);

    // Check if phase should transition
    let newPhase = gaitPhase;
    let finalTimer = newTimer;
    let phaseChanged = false;

    if (newTimer >= phaseDuration) {
        newPhase = getNextGaitPhase(gaitPhase);
        finalTimer = 0;
        phaseChanged = true;
    }

    // Calculate step progress
    const newPhaseDuration = getGaitPhaseDuration(newPhase);
    const stepProgress = calculateStepProgress(finalTimer, newPhaseDuration);

    return {
        gaitPhase: newPhase,
        gaitTimer: finalTimer,
        stepProgress: stepProgress,
        phaseChanged: phaseChanged
    };
}

/**
 * Check if the current phase is a "lurch" phase (body moves forward)
 * Lurch phases are 1 and 4 in the 6-phase gait
 * @param {number} phase - Gait phase (0-5)
 * @returns {boolean} True if this is a lurch phase
 */
function isLurchPhase(phase) {
    return phase === 1 || phase === 4;
}

/**
 * Calculate the lurch speed for body movement during a lurch phase
 * @param {number} bodySize - Spider body size
 * @param {number} phaseDuration - Duration of the lurch phase
 * @returns {number} Lurch speed (distance per millisecond)
 */
function calculateLurchSpeed(bodySize, phaseDuration) {
    const lurchDistance = bodySize * 0.4;
    return lurchDistance / phaseDuration;
}

/**
 * Create initial gait state
 * @param {number} initialPhase - Starting phase (default 0)
 * @returns {Object} Initial state { gaitPhase, gaitTimer, stepProgress }
 */
function createInitialGaitState(initialPhase = 0) {
    return {
        gaitPhase: initialPhase,
        gaitTimer: 0,
        stepProgress: 0
    };
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getGaitPhaseDuration,
        getAllPhaseDurations,
        getNextGaitPhase,
        calculateStepProgress,
        updateGaitState,
        isLurchPhase,
        calculateLurchSpeed,
        createInitialGaitState,
        PHASE_DURATIONS
    };
}

// Browser export - MUST use typeof for safety (learned from Phase 1)
if (typeof window !== 'undefined') {
    window.GaitStateMachine = {
        getGaitPhaseDuration,
        getAllPhaseDurations,
        getNextGaitPhase,
        calculateStepProgress,
        updateGaitState,
        isLurchPhase,
        calculateLurchSpeed,
        createInitialGaitState,
        PHASE_DURATIONS
    };
}
