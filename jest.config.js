module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '**/*.ts',
    '!**/*.test.ts'
  ],
  coverageDirectory: 'test-output',
  coverageReporters: [
    'text-summary',
    'lcov'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/app/dist/',
    '<rootDir>/node_modules/',
    '<rootDir>/test-output/',
    '<rootDir>/test/',
    '<rootDir>/jest.config.js',
    '<rootDir>/webpack.config.js'
  ],
  modulePathIgnorePatterns: [
    'node_modules'
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: 'test-output',
        outputName: 'junit.xml'
      }
    ]
  ],
  testEnvironment: 'node',
  testPathIgnorePatterns: [],
  testMatch: [
    '**/__tests__/**/*.+(ts|js)',
    '**/?(*.)+(spec|test).+(ts|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  verbose: true
}
