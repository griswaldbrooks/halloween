// Spider Animation - Integration Layer
// This file contains browser-specific code that cannot be unit tested (canvas, DOM, events).
// For testable logic extraction opportunities, see REFACTORING_PROPOSAL.md
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load dependencies with proper load tracking
let scriptsLoaded = 0;
const scriptsToLoad = [
    'leg-kinematics.js',
    'spider-model.js',
    'config-defaults.js',
    'foot-positions.js',
    'animation-math.js',
    'gait-state-machine.js',
    'hopping-logic.js',
    'leg-state-calculator.js',
    'boundary-utils.js',
    'spider-factory.js',
    'position-utils.js',
    'mode-controller.js',
    'keyboard-controller.js'
];

function onScriptLoaded() {
    scriptsLoaded++;
    console.log(`Script loaded (${scriptsLoaded}/${scriptsToLoad.length})`);

    if (scriptsLoaded === scriptsToLoad.length) {
        // All scripts loaded, verify classes are available
        console.log('All scripts loaded, checking class availability...');
        console.log('SpiderBody available:', typeof SpiderBody !== 'undefined');
        console.log('Leg2D available:', typeof Leg2D !== 'undefined');
        console.log('ConfigDefaults available:', typeof window.ConfigDefaults !== 'undefined');
        console.log('FootPositions available:', typeof window.FootPositions !== 'undefined');
        console.log('AnimationMath available:', typeof window.AnimationMath !== 'undefined');
        console.log('GaitStateMachine available:', typeof window.GaitStateMachine !== 'undefined');
        console.log('HoppingLogic available:', typeof window.HoppingLogic !== 'undefined');
        console.log('LegStateCalculator available:', typeof window.LegStateCalculator !== 'undefined');

        if (typeof SpiderBody === 'undefined' || typeof Leg2D === 'undefined' ||
            typeof window.ConfigDefaults === 'undefined' || typeof window.FootPositions === 'undefined' ||
            typeof window.AnimationMath === 'undefined' || typeof window.GaitStateMachine === 'undefined' ||
            typeof window.HoppingLogic === 'undefined' || typeof window.LegStateCalculator === 'undefined' ||
            typeof window.BoundaryUtils === 'undefined' || typeof window.SpiderFactory === 'undefined' ||
            typeof window.PositionUtils === 'undefined' || typeof window.ModeController === 'undefined' ||
            typeof window.KeyboardController === 'undefined') {
            console.error('ERROR: Required classes not available after script load!');
            return;
        }

        // Initialize config from library
        config = window.ConfigDefaults.createConfig();

        // All scripts loaded and classes available, start animation
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
        console.log('🕷️ Spider Animation V2 (Kinematics) Started');
    }
}

scriptsToLoad.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = onScriptLoaded;
    script.onerror = () => console.error(`Failed to load ${src}`);
    document.head.appendChild(script);
});

// Configuration (initialized after scripts load)
let config;

// Animation state
let spiders = [];
let animationId = null;

// FPS tracking
let fps = 0;
let frameCount = 0;
let lastFpsUpdate = Date.now();

// Resize canvas to window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetSpiders();
}

// Spider class with proper kinematics
// Foot positions now imported from foot-positions.js library

class Spider {
    constructor(index) {
        this.index = index;
        this.reset();
    }

    reset() {
        // Position
        this.x = -50;
        this.y = Math.random() * canvas.height;
        this.vy = (Math.random() - 0.5) * 0.3;

        // Individual speed based on variation setting
        // speedVariation: 0 = all spiders same speed, 1 = full range of speeds
        const speedRange = config.speedVariation;
        const baseSpeed = config.spiderSpeed;
        this.speedMultiplier = baseSpeed * (1 - speedRange * 0.5 + Math.random() * speedRange);

        // Individual size based on variation setting
        // sizeVariation: 0 = all spiders same size, 1 = full range between min/max
        const sizeRange = config.sizeVariation;
        const avgSize = (config.spiderSizeMin + config.spiderSizeMax) / 2;
        const sizeSpread = (config.spiderSizeMax - config.spiderSizeMin) / 2;
        this.bodySize = (8 + Math.random() * 8) * (avgSize + (Math.random() * 2 - 1) * sizeSpread * sizeRange);
        this.body = new SpiderBody(this.bodySize);

        // Animation state
        this.gaitPhase = 0;           // Procedural gait phase (0-5)
        this.gaitTimer = 0;           // Procedural phase timer
        this.stepProgress = 0;        // Procedural step progress (0-1)

        // Hopping state - using HoppingLogic library (Phase 3B)
        const hoppingState = window.HoppingLogic.createInitialHoppingState(config, canvas.height);
        this.hopPhase = hoppingState.hopPhase;
        this.hopTimer = hoppingState.hopTimer;
        this.hopProgress = hoppingState.hopProgress;
        this.hopStartX = hoppingState.hopStartX;
        this.hopTargetX = hoppingState.hopTargetX;
        this.crawlPhase = hoppingState.crawlPhase;
        this.crawlTimer = hoppingState.crawlTimer;
        this.crawlCyclesRemaining = hoppingState.crawlCyclesRemaining;

        // Create 8 legs using body model
        this.legs = [];
        const groupA = [1, 2, 5, 6]; // L1, R2, L3, R4

        for (let i = 0; i < 8; i++) {
            const attachment = this.body.getAttachment(i);

            // TOP-DOWN VIEW: Elbow bias determines which IK solution (knee position)
            const elbowBiasPattern = [-1, 1, -1, 1, 1, -1, 1, -1];
            const elbowBias = elbowBiasPattern[i];

            const leg = new Leg2D({
                attachX: attachment.x,
                attachY: attachment.y,
                upperLength: this.body.legUpperLength,
                lowerLength: this.body.legLowerLength,
                side: attachment.side,
                baseAngle: attachment.baseAngle,
                elbowBias: elbowBias
            });

            leg.index = i; // Track which leg this is (0-7)
            leg.group = groupA.includes(i) ? 'A' : 'B';
            leg.pairIndex = attachment.pair;
            leg.baseAngle = attachment.baseAngle;
            leg.worldFootX = 0;
            leg.worldFootY = 0;

            this.legs.push(leg);
        }

        this.initializeLegPositions();
        this.color = '#000000';
    }

    initializeLegPositions() {
        // Scale custom positions based on spider's actual body size
        const scale = this.bodySize / 100;

        for (let i = 0; i < this.legs.length; i++) {
            const leg = this.legs[i];
            const relPos = window.FootPositions.CUSTOM_FOOT_POSITIONS[i];

            // Scale and position relative to this spider's center
            leg.worldFootX = this.x + relPos.x * scale;
            leg.worldFootY = this.y + relPos.y * scale;
        }
    }

    update() {
        if (config.paused) return;

        // Use individual spider's speed multiplier
        const speedMultiplier = this.speedMultiplier;
        const dt = 16.67; // ~60fps

        if (config.animationMode === 'hopping') {
            this.updateHopping(dt, speedMultiplier);
        } else {
            this.updateProcedural(dt, speedMultiplier);
        }

        // Common movement and wrapping - using BoundaryUtils (Phase 5B)
        const verticalResult = window.BoundaryUtils.handleVerticalBoundary(this.y, this.vy, canvas.height);
        this.y = verticalResult.y;
        this.vy = verticalResult.vy;

        const horizontalResult = window.BoundaryUtils.handleHorizontalWrap(this.x, canvas.width, 50);
        if (horizontalResult.wrapped) {
            this.x = horizontalResult.x;
            this.y = window.BoundaryUtils.randomYPosition(canvas.height);
            this.initializeLegPositions();
        }
    }


    updateProcedural(dt, speedMultiplier) {
        // Gait timing (6-phase alternating tetrapod) - using GaitStateMachine library (Phase 3A)
        const gaitState = window.GaitStateMachine.updateGaitState(
            { gaitPhase: this.gaitPhase, gaitTimer: this.gaitTimer, stepProgress: this.stepProgress },
            dt,
            speedMultiplier
        );

        this.gaitPhase = gaitState.gaitPhase;
        this.gaitTimer = gaitState.gaitTimer;
        this.stepProgress = gaitState.stepProgress;

        // Update legs based on gait phase
        for (const leg of this.legs) {
            this.updateLegProcedural(leg);
        }

        // Phase 1 and 4 (lurch): Body moves forward
        if (window.GaitStateMachine.isLurchPhase(this.gaitPhase)) {
            const phaseDuration = window.GaitStateMachine.getGaitPhaseDuration(this.gaitPhase);
            const lurchSpeed = window.GaitStateMachine.calculateLurchSpeed(this.bodySize, phaseDuration);
            this.x += lurchSpeed * dt * speedMultiplier;
        }

        // Small lateral drift
        this.y += this.vy * speedMultiplier;
    }

    updateLegProcedural(leg) {
        // Use AnimationMath library for swing calculations (Phase 2 extraction)
        const relPos = window.FootPositions.CUSTOM_FOOT_POSITIONS[leg.index];

        const result = window.AnimationMath.calculateSwingPositionForCrawl(
            leg.group,
            this.gaitPhase,
            this.stepProgress,
            leg.worldFootX,
            leg.worldFootY,
            this.x,
            this.y,
            relPos,
            this.bodySize
        );

        if (result.isSwinging) {
            // SWING: Store start position at beginning of swing
            if (this.stepProgress === 0 || !leg.swingStartX) {
                leg.swingStartX = leg.worldFootX;
                leg.swingStartY = leg.worldFootY;
            }

            leg.worldFootX = result.x;
            leg.worldFootY = result.y;
        } else {
            // STANCE: Foot stays fixed in world space
            leg.swingStartX = null;
            leg.swingStartY = null;
        }
    }

    updateHopping(dt, speedMultiplier) {
        // Hopping gait with crawling in between - using HoppingLogic library (Phase 3B)
        const crawlPhaseDurations = window.HoppingLogic.getCrawlPhaseDurations();

        if (window.HoppingLogic.isCrawlMode(this.hopPhase)) {
            // CRAWL MODE: Use procedural gait
            const crawlState = window.HoppingLogic.updateCrawlPhase(
                {
                    crawlPhase: this.crawlPhase,
                    crawlTimer: this.crawlTimer,
                    crawlCyclesRemaining: this.crawlCyclesRemaining
                },
                dt,
                speedMultiplier,
                config
            );

            this.crawlPhase = crawlState.crawlPhase;
            this.crawlTimer = crawlState.crawlTimer;
            this.crawlCyclesRemaining = crawlState.crawlCyclesRemaining;
            const stepProgress = crawlState.stepProgress;

            // Transition to hopping if cycles exhausted
            if (crawlState.shouldTransitionToHop) {
                this.hopPhase = window.HoppingLogic.HOP_PHASE.CROUCH;
                this.hopTimer = 0;
            }

            // Update legs using procedural crawl
            for (const leg of this.legs) {
                this.updateLegProceduralForHopping(leg, this.crawlPhase, stepProgress);
            }

            // Body movement during crawl lurch phases
            if (window.HoppingLogic.isCrawlLurchPhase(this.crawlPhase)) {
                const lurchDistance = this.bodySize * 0.4;
                const lurchDelta = (lurchDistance / crawlPhaseDurations[this.crawlPhase]) * dt * speedMultiplier;
                this.x += lurchDelta;
                this.y += this.vy * speedMultiplier;
            }

        } else {
            // HOP MODE: Phases 0-3
            const hopState = window.HoppingLogic.updateHopPhase(
                {
                    hopPhase: this.hopPhase,
                    hopTimer: this.hopTimer,
                    hopProgress: this.hopProgress,
                    hopStartX: this.hopStartX,
                    hopTargetX: this.hopTargetX,
                    spiderX: this.x
                },
                dt,
                speedMultiplier,
                config
            );

            this.hopPhase = hopState.hopPhase;
            this.hopTimer = hopState.hopTimer;
            this.hopProgress = hopState.hopProgress;
            this.hopStartX = hopState.hopStartX;

            // Initialize hop distance at start of takeoff (when phase changes to TAKEOFF)
            if (hopState.phaseChanged && this.hopPhase === window.HoppingLogic.HOP_PHASE.TAKEOFF) {
                this.hopStartX = this.x;
                this.hopTargetX = window.HoppingLogic.calculateHopTargetX(this.x, this.bodySize, config);
            }

            // Transition to crawl mode if needed
            if (window.HoppingLogic.isCrawlMode(this.hopPhase)) {
                this.crawlPhase = 0;
                this.crawlTimer = 0;
            }

            // Update legs based on hop phase
            for (const leg of this.legs) {
                this.updateLegHopping(leg);
            }

            // Body movement during flight phase
            if (window.HoppingLogic.isFlightPhase(this.hopPhase)) {
                const hopPhaseDurations = window.HoppingLogic.getAllHopPhaseDurations(config);
                const hopDistance = this.hopTargetX - this.hopStartX;
                const hopDelta = (hopDistance / hopPhaseDurations[2]) * dt * speedMultiplier;
                this.x += hopDelta;
                this.y += this.vy * speedMultiplier;
            }
        }
    }

    updateLegHopping(leg) {
        // Using LegStateCalculator library (Phase 5A)
        const relPos = window.FootPositions.CUSTOM_FOOT_POSITIONS[leg.index];

        // Calculate target state based on hop phase
        const state = window.LegStateCalculator.calculateLegHopState(
            this.hopPhase,
            leg.index,
            relPos,
            this.x,
            this.y,
            this.bodySize
        );

        // Apply smoothing to move towards target
        const newPos = window.LegStateCalculator.applyLegSmoothing(
            leg.worldFootX,
            leg.worldFootY,
            state.targetX,
            state.targetY,
            state.smoothing
        );

        leg.worldFootX = newPos.x;
        leg.worldFootY = newPos.y;
    }

    updateLegProceduralForHopping(leg, crawlPhase, stepProgress) {
        // Same as updateLegProcedural but uses crawlPhase instead of this.gaitPhase
        // Using HoppingLogic library helper (Phase 3B)
        const isSwinging = window.HoppingLogic.isLegSwingingInCrawl(leg.group, crawlPhase);

        if (isSwinging) {
            // SWING: Foot swings forward in TOP-DOWN view (X-Y plane)
            const scale = this.bodySize / 100;
            const relPos = window.FootPositions.CUSTOM_FOOT_POSITIONS[leg.index];

            // Predict where body will be after the upcoming lurch phase
            const lurchDistance = this.bodySize * 0.4;
            const futureBodyX = this.x + lurchDistance;

            // Calculate swing target
            const swingTargetX = futureBodyX + relPos.x * scale;
            const swingTargetY = this.y + relPos.y * scale;

            // Store swing start position at beginning of swing
            if (stepProgress === 0 || !leg.swingStartX) {
                leg.swingStartX = leg.worldFootX;
                leg.swingStartY = leg.worldFootY;
            }

            // Interpolate from start to target
            leg.worldFootX = leg.swingStartX + (swingTargetX - leg.swingStartX) * stepProgress;
            leg.worldFootY = leg.swingStartY + (swingTargetY - leg.swingStartY) * stepProgress;
        } else {
            // STANCE: Foot stays fixed in world space
            leg.swingStartX = null;
            leg.swingStartY = null;
        }
    }


    draw() {
        // INTEGRATION CODE: Cannot unit test (requires real canvas context)
        // In hopping mode, spider is invisible during flight phase (phase 2)
        if (config.animationMode === 'hopping' && this.hopPhase === 2) {
            return; // Don't draw anything - spider disappears mid-hop!
        }

        ctx.save();
        ctx.translate(this.x, this.y);

        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = this.bodySize * 0.1;
        ctx.lineCap = 'round';

        // Draw legs
        for (const leg of this.legs) {
            this.drawLeg(leg);
        }

        // Draw cephalothorax
        ctx.beginPath();
        ctx.ellipse(
            this.body.cephalothorax.center, 0,
            this.body.cephalothorax.length / 2,
            this.body.cephalothorax.width / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        // Draw abdomen
        ctx.beginPath();
        ctx.ellipse(
            this.body.abdomen.center, 0,
            this.body.abdomen.length / 2,
            this.body.abdomen.width / 2,
            0, 0, Math.PI * 2
        );
        ctx.fill();

        ctx.restore();
    }

    drawLeg(leg) {
        // Target position for foot (in world space)
        const targetX = leg.worldFootX - this.x;
        const targetY = leg.worldFootY - this.y;

        // Use inverse kinematics to calculate joint angles
        leg.setFootPosition(targetX, targetY);

        // Use forward kinematics to get actual positions
        const positions = leg.forwardKinematics();

        // Draw upper segment
        ctx.beginPath();
        ctx.moveTo(leg.attachX, leg.attachY);
        ctx.lineTo(positions.knee.x, positions.knee.y);
        ctx.stroke();

        // Draw lower segment
        ctx.beginPath();
        ctx.moveTo(positions.knee.x, positions.knee.y);
        ctx.lineTo(positions.foot.x, positions.foot.y);
        ctx.stroke();
    }
}

// Initialize spiders
function resetSpiders() {
    spiders = [];
    for (let i = 0; i < config.spiderCount; i++) {
        spiders.push(new Spider(i));
    }
    console.log(`Created ${spiders.length} spiders`);
    if (spiders.length > 0) {
        const s = spiders[0];
        console.log(`First spider: x=${s.x}, y=${s.y}, bodySize=${s.bodySize}, legs=${s.legs.length}`);
    }
}

// Main animation loop
// INTEGRATION CODE: Cannot unit test (requires requestAnimationFrame)
let animateFrameCount = 0;
function animate() {
    animateFrameCount++;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Debug: Draw a test circle to verify canvas is working
    if (animateFrameCount === 1) {
        console.log(`Animation starting: canvas ${canvas.width}x${canvas.height}, ${spiders.length} spiders`);
    }

    // Update and draw spiders
    for (const spider of spiders) {
        spider.update();
        spider.draw();
    }

    // Debug first frame
    if (animateFrameCount === 1 && spiders.length > 0) {
        console.log(`After first draw: spider 0 at (${spiders[0].x}, ${spiders[0].y})`);
    }

    // Update FPS
    frameCount++;
    const now = Date.now();
    if (now - lastFpsUpdate >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFpsUpdate = now;

        document.getElementById('fps').textContent = fps;
        document.getElementById('activeSpiders').textContent = spiders.length;
    }

    animationId = requestAnimationFrame(animate);
}

// Control functions (keep existing from original)
function toggleControls() {
    document.getElementById('controls').classList.toggle('hidden');
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function updateSpiderCount(value) {
    config.spiderCount = parseInt(value);
    document.getElementById('spiderCountLabel').textContent = value;
    resetSpiders();
}

function updateSpeed(value) {
    config.spiderSpeed = parseFloat(value);
    document.getElementById('speedLabel').textContent = value + 'x';
    resetSpiders(); // Reset to apply new speed distribution
}

function updateSpeedVariation(value) {
    config.speedVariation = parseFloat(value);
    document.getElementById('speedVariationLabel').textContent = value;
    resetSpiders(); // Reset to apply new speed variation
}

function updateSizeMin(value) {
    // NOTE: Config management could be extracted to config-manager.js if DOM manipulation grows.
    // See REFACTORING_PROPOSAL.md for details. Current implementation is adequate for project scope.
    config.spiderSizeMin = parseFloat(value);
    document.getElementById('sizeMinLabel').textContent = value + 'x';
    // Make sure min doesn't exceed max
    if (config.spiderSizeMin > config.spiderSizeMax) {
        config.spiderSizeMax = config.spiderSizeMin;
        document.getElementById('sizeMax').value = config.spiderSizeMax;
        document.getElementById('sizeMaxLabel').textContent = config.spiderSizeMax + 'x';
    }
    resetSpiders();
}

function updateSizeMax(value) {
    config.spiderSizeMax = parseFloat(value);
    document.getElementById('sizeMaxLabel').textContent = value + 'x';
    // Make sure max doesn't go below min
    if (config.spiderSizeMax < config.spiderSizeMin) {
        config.spiderSizeMin = config.spiderSizeMax;
        document.getElementById('sizeMin').value = config.spiderSizeMin;
        document.getElementById('sizeMinLabel').textContent = config.spiderSizeMin + 'x';
    }
    resetSpiders();
}

function updateSizeVariation(value) {
    config.sizeVariation = parseFloat(value);
    document.getElementById('sizeVariationLabel').textContent = value;
    resetSpiders(); // Reset to apply new size variation
}

function updateAnimationMode(mode) {
    config.animationMode = mode;
    console.log('🕷️ Animation mode:', mode);

    // Show/hide hopping controls - using ModeController library (Phase 5E)
    const hoppingControls = document.getElementById('hoppingControls');
    if (hoppingControls) {
        hoppingControls.style.display = window.ModeController.shouldShowHoppingControls(mode) ? 'block' : 'none';
    }

    // Reset spiders to reinitialize their state for the new mode
    resetSpiders();
}

function updateHopDistanceMin(value) {
    config.hopDistanceMin = parseFloat(value);
    document.getElementById('hopDistanceMinLabel').textContent = value + 'x';
    if (config.hopDistanceMin > config.hopDistanceMax) {
        config.hopDistanceMax = config.hopDistanceMin;
        document.getElementById('hopDistanceMax').value = config.hopDistanceMax;
        document.getElementById('hopDistanceMaxLabel').textContent = config.hopDistanceMax + 'x';
    }
}

function updateHopDistanceMax(value) {
    config.hopDistanceMax = parseFloat(value);
    document.getElementById('hopDistanceMaxLabel').textContent = value + 'x';
    if (config.hopDistanceMax < config.hopDistanceMin) {
        config.hopDistanceMin = config.hopDistanceMax;
        document.getElementById('hopDistanceMin').value = config.hopDistanceMin;
        document.getElementById('hopDistanceMinLabel').textContent = config.hopDistanceMin + 'x';
    }
}

function updateHopFrequencyMin(value) {
    config.hopFrequencyMin = parseInt(value);
    document.getElementById('hopFrequencyMinLabel').textContent = value;
    if (config.hopFrequencyMin > config.hopFrequencyMax) {
        config.hopFrequencyMax = config.hopFrequencyMin;
        document.getElementById('hopFrequencyMax').value = config.hopFrequencyMax;
        document.getElementById('hopFrequencyMaxLabel').textContent = config.hopFrequencyMax;
    }
}

function updateHopFrequencyMax(value) {
    config.hopFrequencyMax = parseInt(value);
    document.getElementById('hopFrequencyMaxLabel').textContent = value;
    if (config.hopFrequencyMax < config.hopFrequencyMin) {
        config.hopFrequencyMin = config.hopFrequencyMax;
        document.getElementById('hopFrequencyMin').value = config.hopFrequencyMin;
        document.getElementById('hopFrequencyMinLabel').textContent = config.hopFrequencyMin;
    }
}

function updateHopFlightDuration(value) {
    config.hopFlightDuration = parseInt(value);
    document.getElementById('hopFlightDurationLabel').textContent = value;
}

// Keyboard shortcuts - using KeyboardController library (Phase 5F)
// INTEGRATION CODE: Cannot unit test (requires real DOM events)
document.addEventListener('keydown', (e) => {
    const action = window.KeyboardController.getKeyboardAction(e.key);

    if (action === 'toggleControls') {
        toggleControls();
    } else if (action === 'toggleFullscreen') {
        toggleFullscreen();
    } else if (action === 'resetSpiders') {
        resetSpiders();
    } else if (action === 'togglePause') {
        config.paused = !config.paused;
        e.preventDefault();
    }
});

// Animation starts after scripts load (see onScriptLoaded() above)
