process.env.TZ = 'UTC';

/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  transform: {
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
};

module.exports = config;
