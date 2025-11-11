#!/bin/bash
# Fix .gcov Source: paths for SonarCloud integration
#
# PROBLEM:
#   gcov generates files with Source: paths like "arduino/servo_mapping.h"
#   SonarCloud expects paths like "hatching_egg/arduino/servo_mapping.h"
#
# SOLUTION:
#   Post-process .gcov files to add "hatching_egg/" prefix to Source: paths
#   for our project files (not system headers)
#
# USAGE:
#   Run from hatching_egg/ directory after gcov generation
#   Called automatically by pixi run test-cpp-coverage

set -e

echo "Fixing .gcov Source: paths for SonarCloud..."

# Fix paths in all .gcov files that contain our project files
# Only fix lines starting with "Source:" that reference arduino/ directory
for gcov_file in *.gcov; do
    if [ -f "$gcov_file" ]; then
        # Check if this file has an arduino/ source path
        if grep -q "^        -:    0:Source:arduino/" "$gcov_file" 2>/dev/null; then
            # Add hatching_egg/ prefix to Source: line
            sed -i 's|^        -:    0:Source:arduino/|        -:    0:Source:hatching_egg/arduino/|' "$gcov_file"
            echo "  ✓ Fixed: $gcov_file"
        fi
    fi
done

echo "✅ .gcov Source: paths fixed for SonarCloud integration"
echo ""
echo "Verification:"
echo "  Local check: grep 'Source:hatching_egg' *.gcov"
echo "  After push:  python ../tools/sonarcloud_verify.py --component hatching_egg"
