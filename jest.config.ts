
const {defaults} = require('jest-config');
const tsPreset = require('ts-jest/jest-preset')


module.exports = {
  ...tsPreset,
  testEnvironment: 'node',
  testRegex: './test/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  "roots": [
    "<rootDir>/test",
  ]
};
