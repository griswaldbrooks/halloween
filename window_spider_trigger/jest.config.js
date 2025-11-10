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
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
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
