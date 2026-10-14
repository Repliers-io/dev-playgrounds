// the utils tests are plain TypeScript: ts-jest compiles them and `modulePaths`
// resolves the tsconfig `baseUrl` imports such as 'constants/map'.
// CommonJS on purpose: package.json is `type: module` and a .ts config would
// need ts-node, which the project does not carry
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { tsconfig: { module: 'commonjs', jsx: 'react-jsx' }, diagnostics: false }
    ]
  }
}
