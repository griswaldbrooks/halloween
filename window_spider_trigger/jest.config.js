/**
 * Jest Configuration for window_spider_trigger
 *
 * Coverage: 98.62% local (93 tests passing, 0 skipped)
 *
 * IMPORTANT: This generates lcov.info with relative paths (SF:server.js)
 * which are then fixed by ../scripts/fix-lcov-paths.sh in CI to add the
 * project prefix (SF:window_spider_trigger/server.js) for SonarCloud.
 *
 * NOTE: SonarCloud currently shows 0% coverage despite correct generation.
 * See SONARCLOUD_COVERAGE_ISSUE.md for investigation status.
 */
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',  // Main server file
    'lib/**/*.js',  // Library files (SerialPortManager, SocketIOHandler)
    '!lib/**/*.test.js',  // Exclude test files
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/public/**',  // Exclude browser client code
    '!jest.config.js'
  ],
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  passWithNoTests: true,
  coverageThreshold: {
    global: {
      branches: 80,  // Increased from 55 to 80
      functions: 90,  // Increased from 60 to 90
      lines: 95,  // Increased from 64 to 95
      statements: 95  // Increased from 65 to 95
    }
  }
};
