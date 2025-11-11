#!/bin/bash
# Verify all tests across all Halloween projects

set -e  # Exit on first error

echo "════════════════════════════════════════════════════════════════════════════════"
echo "🧪 Running All Tests and Verification"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""

# Track overall success
ALL_PASSED=true

# Function to run tests for a project
run_project_tests() {
    local project=$1
    echo "──────────────────────────────────────────────────────────────────────────────"
    echo "Testing: $project"
    echo "──────────────────────────────────────────────────────────────────────────────"

    if [ -d "$project" ]; then
        cd "$project"

        # Run tests
        if pixi run test; then
            echo "✅ $project tests passed"
        else
            echo "❌ $project tests failed"
            ALL_PASSED=false
        fi

        cd ..
        echo ""
    else
        echo "⚠️  Directory $project not found, skipping"
        echo ""
    fi
}

# Run tests for each project
run_project_tests "hatching_egg"
run_project_tests "window_spider_trigger"
run_project_tests "spider_crawl_projection"

echo "════════════════════════════════════════════════════════════════════════════════"
echo "📊 Coverage Summary"
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
echo "Run coverage for each project:"
echo "  cd hatching_egg && pixi run coverage-all"
echo "  cd window_spider_trigger && pixi run test-coverage"
echo "  cd spider_crawl_projection && pixi run coverage"
echo ""
echo "Or verify SonarCloud state:"
echo "  python tools/sonarcloud_verify.py --project griswaldbrooks_halloween"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"

if [ "$ALL_PASSED" = true ]; then
    echo "✅ All Tests Passed"
    echo "════════════════════════════════════════════════════════════════════════════════"
    exit 0
else
    echo "❌ Some Tests Failed"
    echo "════════════════════════════════════════════════════════════════════════════════"
    exit 1
fi
