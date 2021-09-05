module.exports = {
  roots: ['<rootDir>'],
  modulePaths: [`<rootDir>`],
  cacheDirectory: '<rootDir>/target/jest-cache',
  coverageDirectory: '<rootDir>/target/test-results/',
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '<rootDir>/target/test-results/',
        outputName: 'TESTS-results-jest.xml',
      },
    ],
  ],
  testMatch: ['<rootDir>/src/**/@(*.)@(spec.ts)'],
  testURL: 'http://localhost/',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transformIgnorePatterns: ['node_modules/(?!(jest-test|@ngrx|ol|@mapbox))'],
};
