#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║             SPIDER GEOMETRY - COMPLETE TEST SUITE         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo

PASS=0
FAIL=0

run_test() {
    local test_name=$1
    local test_file=$2

    echo "Running: $test_name..."
    # Capture output and check exit code
    if node "$test_file" > /tmp/test_output.txt 2>&1; then
        echo "  ✓ PASS"
        ((PASS++))
    else
        echo "  ✗ FAIL (see details above)"
        cat /tmp/test_output.txt
        ((FAIL++))
    fi
    echo
}

# Core Tests
run_test "Kinematics (IK/FK + Elbow Bias)" "test-kinematics.js"
run_test "Body Model" "test-model.js"
run_test "Integration" "test-integration.js"
run_test "Top-Down Geometry" "test-topdown-shape.js"
run_test "IK Accuracy" "test-ik-accuracy.js"
run_test "Rendering Output" "test-rendering.js"
run_test "Leg Drawing" "test-leg-drawing.js"
run_test "Script Loading (Race Condition Prevention)" "test-script-loading.js"

# Configuration Tests
run_test "User Configuration (No Intersections)" "test-user-config.js"

# Phase 1 Library Tests
run_test "Config Defaults" "test-config-defaults.js"
run_test "Foot Positions" "test-foot-positions.js"

# Phase 2 Library Tests
run_test "Animation Math" "test-animation-math.js"

# Phase 3A Library Tests
run_test "Gait State Machine" "test-gait-state-machine.js"

# Phase 3B Library Tests
run_test "Hopping Logic" "test-hopping-logic.js"

# Phase 4 Library Tests (Config Validators - extracted from Phase 5G)
run_test "Config Validators" "test-config-validators.js"

# Phase 5A Library Tests
run_test "Leg State Calculator" "test-leg-state-calculator.js"

# Phase 5B Library Tests
run_test "Boundary Utils" "test-boundary-utils.js"

# Phase 5C Library Tests
run_test "Spider Factory" "test-spider-factory.js"

# Regression Prevention Tests
run_test "Method Call Validation (Static Analysis)" "test-method-calls.js"
run_test "Browser Export Simulation (jsdom)" "test-browser-exports.js"

TOTAL=$((PASS + FAIL))

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                      SUMMARY                               ║"
echo "║  Passed: $PASS / $TOTAL                                            ║"
echo "║  Failed: $FAIL / $TOTAL                                            ║"
if [ $FAIL -eq 0 ]; then
    echo "║                                                            ║"
    echo "║              ✓✓✓ ALL TESTS PASSED! ✓✓✓                   ║"
fi
echo "╚════════════════════════════════════════════════════════════╝"
