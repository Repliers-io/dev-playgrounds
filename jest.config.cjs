// the utils tests are plain TypeScript: ts-jest compiles them and `modulePaths`
// resolves the tsconfig `baseUrl` imports such as 'constants/map'.
// CommonJS on purpose: package.json is `type: module` and a .ts config would
// need ts-node, which the project does not carry
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  // jest resolves the turf bundle to its ESM sources, which it cannot parse;
  // the CommonJS build alongside requires its sub-packages the normal way
  moduleNameMapper: {
    '^@turf/turf$': '<rootDir>/node_modules/@turf/turf/dist/cjs/index.cjs'
  },
  // the few ESM-only packages that build still pulls in get compiled to
  // CommonJS by ts-jest like the sources are (`allowJs` covers their .js)
  transformIgnorePatterns: [
    '/node_modules/(?!(kdbush|geokdbush|tinyqueue|polyclip-ts|splaytree-ts)/)'
  ],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: { module: 'commonjs', jsx: 'react-jsx', allowJs: true },
        diagnostics: false
      }
    ]
  }
}
