---
name: unit-tests-runner
description: Testing reality check — src/utils/*.test.ts run under jest (jest.config.cjs, `npm test`) since commit 22d3996; before that nothing ran them
metadata:
  type: project
---

`src/utils/*.test.ts` (formatters, geo, numbers, path, strings, validators, locationView) use
bare `describe`/`it` globals. Until 2026-10 there was no runner, so "tests added" meant nothing.
Commit 22d3996 (branch feat/locations-apn) added `jest.config.cjs` (ts-jest, `modulePaths: src`)
and a `test` script; all 7 suites / 46 tests pass.

**Why:** the suite was written against a globals setup that was never added; the user chose jest
(@types/jest + ts-jest were already devDependencies) rather than vitest.

**How to apply:** for PRs that add tests, actually run `npx jest <file>` — they are now verifiable.
Keep new tests in the globals style under `src/`. Note the jest.config's turf `moduleNameMapper`
and `transformIgnorePatterns` allowlist were workarounds for @turf 7.3.4; verified on 2026-10-14
that with @turf 7.4.0 the suite passes without either.
