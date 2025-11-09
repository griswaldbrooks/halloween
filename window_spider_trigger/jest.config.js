module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',  // Only test server-side code
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
      branches: 55,
      functions: 60,
      lines: 64,
      statements: 65
    }
  }
};
