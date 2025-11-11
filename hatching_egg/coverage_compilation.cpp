/**
 * Compilation Database Generation Helper
 *
 * This file exists solely to include all header files so they appear
 * in the compilation database (compile_commands.json) for SonarCloud.
 *
 * SonarCloud needs files in the compilation database to analyze them
 * and apply coverage data. Without this, header files (.h) with actual
 * implementation won't show up in SonarCloud, even though they have
 * coverage data in the lcov report.
 *
 * Context:
 * - Test files (test_*.cpp) compile and run, generating coverage for header files
 * - Coverage report (coverage-cpp-filtered.info) contains SF: entries for .h files
 * - But compilation database only had test_*.cpp entries (not .h files)
 * - SonarCloud analyzes files in compilation DB and applies coverage from lcov
 * - No match = 0% coverage or file not shown
 *
 * Solution:
 * - This file includes all header files we want analyzed
 * - bear captures this compilation, adding .h files to compile_commands.json
 * - SonarCloud can now match header files between compilation DB and coverage report
 *
 * Date: 2025-11-11
 */

#include "arduino/servo_mapping.h"
#include "arduino/servo_tester_logic.h"
#include "arduino/servo_sweep_test_logic.h"

// Dummy main to make this a valid compilation unit
// This file is never executed - it's only compiled by bear to generate compilation database
int main() {
    return 0;
}
