/**
 * Compilation Database Helper for SonarCloud C++ Analysis
 *
 * PURPOSE:
 * This file exists solely to ensure header files appear in the compilation
 * database (compile_commands.json) for SonarCloud analysis.
 *
 * WHY:
 * SonarCloud needs files in the compilation database to analyze them.
 * Test files (test_*.cpp) are excluded from analysis, so we need a way
 * to include the header files directly.
 *
 * HOW IT WORKS:
 * - This file #includes all header files
 * - bear captures compilation of this file
 * - Headers appear in compile_commands.json
 * - SonarCloud analyzes headers
 *
 * CURRENT ISSUE (2025-11-11):
 * - Compilation database working (headers included)
 * - SonarCloud analyzing files (issues detected)
 * - .gcov files generated and parsed
 * - But coverage NOT displayed in dashboard
 * - Likely path mismatch issue
 *
 * VERIFICATION:
 * Run: python tools/sonarcloud_verify.py --component hatching_egg
 * Look for: Header files with coverage data
 *
 * DO NOT DELETE THIS FILE - it's critical for SonarCloud C++ analysis
 */

#include "arduino/servo_mapping.h"
#include "arduino/servo_tester_logic.h"
#include "arduino/servo_sweep_test_logic.h"

int main() {
    return 0;
}
