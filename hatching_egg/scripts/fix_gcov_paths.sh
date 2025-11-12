#!/bin/bash
# Fix .gcov Source: paths for SonarCloud integration
# ACTIVE (2025-11-11): Used with native .gcov format for CFamily sensor
#
# CONTEXT:
#   - SonarCloud CFamily sensor processes native .gcov files during analysis phase
#   - This solves timing issue: Generic Coverage Report runs BEFORE file indexing
#   - Native .gcov files are processed AS files are indexed (coverage applies correctly)
#
# PURPOSE:
#   Transform absolute paths in .gcov files to project-relative format for SonarCloud
#
# PROBLEM:
#   gcov generates files with different Source: path formats:
#   - Local builds: "arduino/servo_mapping.h"
#   - CI builds: "/home/runner/work/halloween/halloween/hatching_egg/arduino/servo_mapping.h"
#   SonarCloud expects: "hatching_egg/arduino/servo_mapping.h"
#
# SOLUTION:
#   Post-process .gcov files to transform Source: paths to project-relative format
#   Handles both CI absolute paths and local relative paths
#
# USAGE:
#   (DEPRECATED - use gcovr instead)
#   Run from hatching_egg/ directory after gcov generation
#   Called automatically by pixi run test-cpp-coverage

set -e

echo "Fixing .gcov Source: paths for SonarCloud..."

# Fix paths in all .gcov files that contain our project files
for gcov_file in *.gcov; do
    if [ -f "$gcov_file" ]; then
        # Transform CI absolute paths (GitHub Actions)
        # Pattern: /home/runner/work/halloween/halloween/hatching_egg/... → hatching_egg/...
        if grep -q "^        -:    0:Source:/home/runner/work/halloween/halloween/hatching_egg/" "$gcov_file" 2>/dev/null; then
            sed -i 's|^        -:    0:Source:/home/runner/work/halloween/halloween/hatching_egg/|        -:    0:Source:hatching_egg/|' "$gcov_file"
            echo "  ✓ Fixed (CI): $gcov_file"
        fi

        # Transform local absolute paths
        # Pattern: /home/<user>/personal/halloween/hatching_egg/... → hatching_egg/...
        # Uses regex to match any local path that ends with hatching_egg/
        if grep -q "^        -:    0:Source:.*/hatching_egg/" "$gcov_file" 2>/dev/null; then
            sed -i 's|^        -:    0:Source:.*/hatching_egg/|        -:    0:Source:hatching_egg/|' "$gcov_file"
            echo "  ✓ Fixed (local abs): $gcov_file"
        fi

        # Transform local relative paths
        # Pattern: arduino/... → hatching_egg/arduino/...
        if grep -q "^        -:    0:Source:arduino/" "$gcov_file" 2>/dev/null; then
            sed -i 's|^        -:    0:Source:arduino/|        -:    0:Source:hatching_egg/arduino/|' "$gcov_file"
            echo "  ✓ Fixed (local rel): $gcov_file"
        fi
    fi
done

echo "✅ .gcov Source: paths fixed for SonarCloud integration"
echo ""
echo "Verification:"
echo "  Local check: grep 'Source:hatching_egg' *.gcov"
echo "  After push:  python ../tools/sonarcloud_verify.py --component hatching_egg"
