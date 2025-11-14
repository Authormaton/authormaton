module.exports = {

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|ts|tsx)$': ['babel-jest', {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript', '@babel/preset-react'],
    }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!( @radix-ui|lucide-react|react-icons|jest-environment-jsdom)).+'
  ],
};


