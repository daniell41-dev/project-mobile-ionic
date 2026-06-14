// Configuración de Jest (convive con Karma/Jasmine).
// - Karma ejecuta los spec de src (suite principal, 94 tests).
// - Jest ejecuta los tests/jest (este runner), aislado por tsconfig.jest.json
//   para evitar el choque de globals jasmine/jest.
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['<rootDir>/tests/jest/**/*.jest.ts'],
  moduleNameMapper: {
    '^biometric-auth$': '<rootDir>/plugins/biometric-auth/src/index.ts',
  },
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
};
