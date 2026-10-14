---
name: jest-config-no-vendor-paths
description: Never map a package to a hard-coded dist path or allow-list ESM deps in jest.config.cjs without first proving the default resolution fails on the current lockfile
type: feedback
---

`jest.config.cjs` runs the utils suites with ts-jest. Keep it to `preset`, `roots`,
`modulePaths` and the ts-jest transform. Do not add `moduleNameMapper` entries pointing
at `node_modules/<pkg>/dist/...` or `transformIgnorePatterns` allow-lists unless the
default config demonstrably fails, and re-check after every dependency bump.

**Why:** the first config (22d3996) mapped `@turf/turf` to `dist/cjs/index.cjs` and
transformed four ESM-only packages to get `geo.test.ts` running. A turf bump in the same
branch removed those packages, so the mapping became dead weight that would break the
moment turf changed its layout, and the allow-list regex missed nested `node_modules`
copies anyway. All 7 suites pass with the default config.

**How to apply:** when a suite fails on `Unexpected token 'export'`, first check whether
the package has a `require` export condition (`node -e "require.resolve('<pkg>')"`); jest
honours it. Only then consider a transform, and prefer a resolver tweak over a path. After
`package.json` changes, run `npm test` with any mapping removed before keeping it.
Related: [[unit-tests-runner]].
