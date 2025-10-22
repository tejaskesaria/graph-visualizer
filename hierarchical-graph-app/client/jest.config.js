module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!d3|internmap|delaunator|robust-predicates)', // Transform d3 and its dependencies
  ],
  moduleFileExtensions: ['js', 'json', 'vue'],
  setupFiles: ['<rootDir>/test/jest.setup.js'],
  testMatch: ['**/test/**/*.spec.js', '**/test/**/*.test.js'],
};