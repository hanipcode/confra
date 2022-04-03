/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  globalTeardown: '<rootDir>/jest.afterEnv.js',
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/__test__/'],
  coverageReporters: ['html'],
  coverageDirectory: './docs/coverage',
};
