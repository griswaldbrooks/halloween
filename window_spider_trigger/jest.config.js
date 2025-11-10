module.exports = {
  testEnvironment: 'node',
  // Set rootDir to parent directory so coverage paths are relative to repo root
  rootDir: '..',
  // Coverage directory relative to rootDir
  coverageDirectory: 'window_spider_trigger/coverage',
  // Adjust testMatch to find tests in window_spider_trigger
  testMatch: [
    '**/window_spider_trigger/**/__tests__/**/*.js',
    '**/window_spider_trigger/**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'window_spider_trigger/server.js',  // Main server file
    'window_spider_trigger/lib/**/*.js',  // Library files (SerialPortManager, SocketIOHandler)
    '!window_spider_trigger/lib/**/*.test.js',  // Exclude test files
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/window_spider_trigger/public/**',  // Exclude browser client code
    '!**/jest.config.js'
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
