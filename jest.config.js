module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: './test/.*\\.(test|spec)?\\.(ts|ts)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  "roots": [
    "<rootDir>",
  ]
};
