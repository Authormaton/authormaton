module.exports = {
  testEnvironment: '<rootDir>/jest-custom-environment.js',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!( @radix-ui|lucide-react|react-icons|jest-environment-jsdom)).+'
  ],
};
