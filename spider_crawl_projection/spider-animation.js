// Spider Animation V2 - Proper kinematics + body model
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Load dependencies with proper load tracking
// IMPORTANT: This replaces setTimeout(100ms) which caused race conditions!
// BUG FIX (Nov 2025): Scripts must load completely before animation starts
let scriptsLoaded = 0;
const scriptsToLoad = ['leg-kinematics.js', 'spider-model.js'];

function onScriptLoaded() {
    scriptsLoaded++;
    console.log(`Script loaded (${scriptsLoaded}/${scriptsToLoad.length})`);

    if (scriptsLoaded === scriptsToLoad.length) {
        // All scripts loaded, verify classes are available
        console.log('All scripts loaded, checking class availability...');
        console.log('SpiderBody available:', typeof SpiderBody !== 'undefined');
        console.log('Leg2D available:', typeof Leg2D !== 'undefined');

        // BUG FIX (Nov 2025): Verify classes are exported to window for browser
        if (typeof SpiderBody === 'undefined' || typeof Leg2D === 'undefined') {
            console.error('ERROR: Required classes not available after script load!');
            return;
        }

        // All scripts loaded and classes available, start animation
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
        console.log('🕷️ Spider Animation V2 (Kinematics) Started');
    }
}

for (const src of scriptsToLoad) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = onScriptLoaded;
    script.onerror = () => console.error(`Failed to load ${src}`);
    document.head.appendChild(script);
}

// Configuration
let config = {
    spiderCount: 5,
    spiderSpeed: 1,
    spiderSizeMin: 0.5,
    spiderSizeMax: 3,
    sizeVariation: 0.5,      // 0 = all same size, 1 = full range
    speedVariation: 0.5,     // 0 = all same speed, 1 = full range
    paused: false,
    animationMode: 'procedural', // 'procedural' or 'hopping'
    // Hopping parameters
    hopDistanceMin: 6,     // Minimum hop distance multiplier (× body size)
    hopDistanceMax: 10,    // Maximum hop distance multiplier (× body size)
    hopFrequencyMin: 1,      // Minimum crawl cycles between hops
    hopFrequencyMax: 13,     // Maximum crawl cycles between hops
    hopFlightDuration: 60    // Flight phase duration in ms
};

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
// User's verified non-intersecting foot positions (relative to body center, bodySize=100)
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

        // Hopping state
        this.hopPhase = Math.floor(Math.random() * 5); // Start at random phase
        this.hopTimer = Math.random() * 200;           // Random offset in phase
        this.hopProgress = 0;
        this.hopStartX = 0;
        this.hopTargetX = 0;
        // Random crawl cycles between hops (based on config)
        const cycleRange = config.hopFrequencyMax - config.hopFrequencyMin;
        this.crawlCyclesRemaining = Math.floor(Math.random() * cycleRange) + config.hopFrequencyMin;
        this.crawlPhase = 0;
        this.crawlTimer = 0;

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
            const relPos = CUSTOM_FOOT_POSITIONS[i];

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

        // Common movement and wrapping
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -1;
            this.y = Math.max(0, Math.min(canvas.height, this.y));
        }

        if (this.x > canvas.width + 50) {
            this.x = -50;
            this.y = Math.random() * canvas.height;
            this.initializeLegPositions();
        }
    }


    // BUG FIX (Nov 2025): This method was accidentally deleted in commit 331c522
    // when removing the keyframe feature. The call site remained in update(),
    // causing: TypeError: this.updateProcedural is not a function
    // CRITICAL: If you modify this method, ensure update() still calls it!
    updateProcedural(dt, speedMultiplier) {
        // Gait timing (6-phase alternating tetrapod)
        const phaseDurations = [200, 150, 100, 200, 150, 100]; // ms

        this.gaitTimer += dt * speedMultiplier;

        if (this.gaitTimer >= phaseDurations[this.gaitPhase]) {
            this.gaitTimer = 0;
            this.gaitPhase = (this.gaitPhase + 1) % 6;
            this.stepProgress = 0;
        }

        this.stepProgress = this.gaitTimer / phaseDurations[this.gaitPhase];

        // Update legs based on gait phase
        for (const leg of this.legs) {
            this.updateLegProcedural(leg);
        }

        // Phase 1 (lurch): Body moves forward
        // Phase 4 (lurch): Body moves forward
        if (this.gaitPhase === 1 || this.gaitPhase === 4) {
            const lurchSpeed = (this.bodySize * 0.4) / phaseDurations[this.gaitPhase];
            this.x += lurchSpeed * dt * speedMultiplier;
        }

        // Small lateral drift
        this.y += this.vy * speedMultiplier;
    }

    updateLegProcedural(leg) {
        const isSwinging = (this.gaitPhase === 0 && leg.group === 'A') ||
                          (this.gaitPhase === 3 && leg.group === 'B');

        if (isSwinging) {
            // SWING: Foot swings forward in TOP-DOWN view (X-Y plane)
            const scale = this.bodySize / 100;
            const relPos = CUSTOM_FOOT_POSITIONS[leg.index];

            // Predict where body will be after the upcoming lurch phase
            const lurchDistance = this.bodySize * 0.4;
            const futureBodyX = this.x + lurchDistance;

            // Calculate swing target
            const swingTargetX = futureBodyX + relPos.x * scale;
            const swingTargetY = this.y + relPos.y * scale;

            // Store swing start position at beginning of swing
            if (this.stepProgress === 0 || !leg.swingStartX) {
                leg.swingStartX = leg.worldFootX;
                leg.swingStartY = leg.worldFootY;
            }

            // Interpolate from start to target
            leg.worldFootX = leg.swingStartX + (swingTargetX - leg.swingStartX) * this.stepProgress;
            leg.worldFootY = leg.swingStartY + (swingTargetY - leg.swingStartY) * this.stepProgress;
        } else {
            // STANCE: Foot stays fixed in world space
            leg.swingStartX = null;
            leg.swingStartY = null;
        }
    }

    updateHopping(dt, speedMultiplier) {
        // Hopping gait with crawling in between
        // Phase 4 is now "crawl mode" - spider crawls for configurable cycles before next hop
        const hopPhaseDurations = [100, 200, config.hopFlightDuration, 200]; // Crouch, Takeoff, Flight, Landing
        const crawlPhaseDurations = [200, 150, 100, 200, 150, 100]; // Same as procedural gait

        if (this.hopPhase === 4) {
            // CRAWL MODE: Use procedural gait
            this.crawlTimer += dt * speedMultiplier;

            if (this.crawlTimer >= crawlPhaseDurations[this.crawlPhase]) {
                this.crawlTimer = 0;
                this.crawlPhase = (this.crawlPhase + 1) % 6;

                // Completed one crawl cycle?
                if (this.crawlPhase === 0) {
                    this.crawlCyclesRemaining--;
                    if (this.crawlCyclesRemaining <= 0) {
                        // Done crawling, prepare to hop again
                        this.hopPhase = 0;
                        this.hopTimer = 0;
                        // New random crawl count based on config
                        const cycleRange = config.hopFrequencyMax - config.hopFrequencyMin;
                        this.crawlCyclesRemaining = Math.floor(Math.random() * cycleRange) + config.hopFrequencyMin;
                    }
                }
            }

            const stepProgress = this.crawlTimer / crawlPhaseDurations[this.crawlPhase];

            // Update legs using procedural crawl
            for (const leg of this.legs) {
                this.updateLegProceduralForHopping(leg, this.crawlPhase, stepProgress);
            }

            // Body movement during crawl lurch phases
            if (this.crawlPhase === 1 || this.crawlPhase === 4) {
                const lurchDistance = this.bodySize * 0.4;
                const lurchDelta = (lurchDistance / crawlPhaseDurations[this.crawlPhase]) * dt * speedMultiplier;
                this.x += lurchDelta;
                this.y += this.vy * speedMultiplier;
            }

        } else {
            // HOP MODE: Phases 0-3
            this.hopTimer += dt * speedMultiplier;

            if (this.hopTimer >= hopPhaseDurations[this.hopPhase]) {
                this.hopTimer = 0;
                this.hopPhase = (this.hopPhase + 1) % 4;
                this.hopProgress = 0;

                // Initialize hop distance at start of takeoff
                if (this.hopPhase === 1) {
                    this.hopStartX = this.x;
                    // Hop distance based on config range
                    const distanceRange = config.hopDistanceMax - config.hopDistanceMin;
                    const hopMultiplier = config.hopDistanceMin + Math.random() * distanceRange;
                    this.hopTargetX = this.x + (this.bodySize * hopMultiplier);
                }

                // After landing, switch to crawl mode
                if (this.hopPhase === 0) {
                    this.hopPhase = 4;
                    this.crawlPhase = 0;
                    this.crawlTimer = 0;
                }
            }

            this.hopProgress = this.hopTimer / hopPhaseDurations[this.hopPhase];

            // Update legs based on hop phase
            for (const leg of this.legs) {
                this.updateLegHopping(leg);
            }

            // Body movement during flight phase
            if (this.hopPhase === 2) {
                const hopDistance = this.hopTargetX - this.hopStartX;
                const hopDelta = (hopDistance / hopPhaseDurations[2]) * dt * speedMultiplier;
                this.x += hopDelta;
                this.y += this.vy * speedMultiplier;
            }
        }
    }

    updateLegHopping(leg) {
        const scale = this.bodySize / 100;
        const relPos = CUSTOM_FOOT_POSITIONS[leg.index];

        // Back legs are pairs 2 and 3 (indices 4,5,6,7)
        const isBackLeg = leg.index >= 4;

        if (this.hopPhase === 0) {
            // CROUCH: Legs draw in slightly (0.8x normal reach)
            const crouchFactor = 0.8;
            const targetX = this.x + relPos.x * scale * crouchFactor;
            const targetY = this.y + relPos.y * scale * crouchFactor;

            // Smooth transition into crouch
            leg.worldFootX += (targetX - leg.worldFootX) * 0.3;
            leg.worldFootY += (targetY - leg.worldFootY) * 0.3;

        } else if (this.hopPhase === 1) {
            // TAKEOFF: Back legs extend, front legs retract
            if (isBackLeg) {
                // Back legs push out (1.2x reach)
                const pushFactor = 1.2;
                const targetX = this.x + relPos.x * scale * pushFactor;
                const targetY = this.y + relPos.y * scale * pushFactor;
                leg.worldFootX += (targetX - leg.worldFootX) * 0.5;
                leg.worldFootY += (targetY - leg.worldFootY) * 0.5;
            } else {
                // Front legs tuck in (0.5x reach)
                const tuckFactor = 0.5;
                const targetX = this.x + relPos.x * scale * tuckFactor;
                const targetY = this.y + relPos.y * scale * tuckFactor;
                leg.worldFootX += (targetX - leg.worldFootX) * 0.5;
                leg.worldFootY += (targetY - leg.worldFootY) * 0.5;
            }

        } else if (this.hopPhase === 2) {
            // FLIGHT: All legs tucked close to body (0.4x reach)
            const tuckFactor = 0.4;
            const targetX = this.x + relPos.x * scale * tuckFactor;
            const targetY = this.y + relPos.y * scale * tuckFactor;

            // Keep legs tucked as body moves
            leg.worldFootX = targetX;
            leg.worldFootY = targetY;

        } else if (this.hopPhase === 3) {
            // LANDING: Front legs extend first, back legs follow
            if (!isBackLeg) {
                // Front legs extend to catch landing (1.1x reach)
                const extendFactor = 1.1;
                const targetX = this.x + relPos.x * scale * extendFactor;
                const targetY = this.y + relPos.y * scale * extendFactor;
                leg.worldFootX += (targetX - leg.worldFootX) * 0.6;
                leg.worldFootY += (targetY - leg.worldFootY) * 0.6;
            } else {
                // Back legs prepare to land (0.9x reach)
                const landFactor = 0.9;
                const targetX = this.x + relPos.x * scale * landFactor;
                const targetY = this.y + relPos.y * scale * landFactor;
                leg.worldFootX += (targetX - leg.worldFootX) * 0.4;
                leg.worldFootY += (targetY - leg.worldFootY) * 0.4;
            }

        } else {
            // PAUSE: Return to normal stance (1.0x reach)
            const targetX = this.x + relPos.x * scale;
            const targetY = this.y + relPos.y * scale;

            leg.worldFootX += (targetX - leg.worldFootX) * 0.2;
            leg.worldFootY += (targetY - leg.worldFootY) * 0.2;
        }
    }

    updateLegProceduralForHopping(leg, crawlPhase, stepProgress) {
        // Same as updateLegProcedural but uses crawlPhase instead of this.gaitPhase
        const isSwinging = (crawlPhase === 0 && leg.group === 'A') ||
                          (crawlPhase === 3 && leg.group === 'B');

        if (isSwinging) {
            // SWING: Foot swings forward in TOP-DOWN view (X-Y plane)
            const scale = this.bodySize / 100;
            const relPos = CUSTOM_FOOT_POSITIONS[leg.index];

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
    config.spiderCount = Number.parseInt(value);
    document.getElementById('spiderCountLabel').textContent = value;
    resetSpiders();
}

function updateSpeed(value) {
    config.spiderSpeed = Number.parseFloat(value);
    document.getElementById('speedLabel').textContent = value + 'x';
    resetSpiders(); // Reset to apply new speed distribution
}

function updateSpeedVariation(value) {
    config.speedVariation = Number.parseFloat(value);
    document.getElementById('speedVariationLabel').textContent = value;
    resetSpiders(); // Reset to apply new speed variation
}

function updateSizeMin(value) {
    config.spiderSizeMin = Number.parseFloat(value);
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
    config.spiderSizeMax = Number.parseFloat(value);
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
    config.sizeVariation = Number.parseFloat(value);
    document.getElementById('sizeVariationLabel').textContent = value;
    resetSpiders(); // Reset to apply new size variation
}

function updateAnimationMode(mode) {
    config.animationMode = mode;
    console.log('🕷️ Animation mode:', mode);

    // Show/hide hopping controls
    const hoppingControls = document.getElementById('hoppingControls');
    if (hoppingControls) {
        hoppingControls.style.display = mode === 'hopping' ? 'block' : 'none';
    }

    // Reset spiders to reinitialize their state for the new mode
    resetSpiders();
}

function updateHopDistanceMin(value) {
    config.hopDistanceMin = Number.parseFloat(value);
    document.getElementById('hopDistanceMinLabel').textContent = value + 'x';
    if (config.hopDistanceMin > config.hopDistanceMax) {
        config.hopDistanceMax = config.hopDistanceMin;
        document.getElementById('hopDistanceMax').value = config.hopDistanceMax;
        document.getElementById('hopDistanceMaxLabel').textContent = config.hopDistanceMax + 'x';
    }
}

function updateHopDistanceMax(value) {
    config.hopDistanceMax = Number.parseFloat(value);
    document.getElementById('hopDistanceMaxLabel').textContent = value + 'x';
    if (config.hopDistanceMax < config.hopDistanceMin) {
        config.hopDistanceMin = config.hopDistanceMax;
        document.getElementById('hopDistanceMin').value = config.hopDistanceMin;
        document.getElementById('hopDistanceMinLabel').textContent = config.hopDistanceMin + 'x';
    }
}

function updateHopFrequencyMin(value) {
    config.hopFrequencyMin = Number.parseInt(value);
    document.getElementById('hopFrequencyMinLabel').textContent = value;
    if (config.hopFrequencyMin > config.hopFrequencyMax) {
        config.hopFrequencyMax = config.hopFrequencyMin;
        document.getElementById('hopFrequencyMax').value = config.hopFrequencyMax;
        document.getElementById('hopFrequencyMaxLabel').textContent = config.hopFrequencyMax;
    }
}

function updateHopFrequencyMax(value) {
    config.hopFrequencyMax = Number.parseInt(value);
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'h':
            toggleControls();
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'r':
            resetSpiders();
            break;
        case ' ':
            config.paused = !config.paused;
            e.preventDefault();
            break;
    }
});

// Animation starts after scripts load (see onScriptLoaded() above)
