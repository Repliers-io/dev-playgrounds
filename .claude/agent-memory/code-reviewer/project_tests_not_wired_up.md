---
name: unit-tests-exist-but-no-runner
description: Testing reality check — src/utils/*.test.ts files exist but there is no test script or vitest config, so no test in this repo actually runs
metadata:
  type: project
---

`src/utils/*.test.ts` (formatters, geo, numbers, path, strings, validators, locationView)
are written with bare `describe`/`it` globals and no `import ... from 'vitest'`. There is no
`test` script in package.json, no `vitest.config.*`, and `vite.config.ts` has no `test` block.
Running `npx vitest run src/utils/<x>.test.ts` fails with `ReferenceError: describe is not defined`.

**Why:** the suite was written against an assumed globals setup that was never added. Verified
2026-09-21 while reviewing branch `feat/exrtend-presets` — the new `src/utils/locationView.test.ts`
could not be executed.

**How to apply:** when reviewing a PR that adds tests, do not treat "tests added" as "behaviour
verified" — nothing runs them. Follow the existing globals-style convention in new test files
(consistency beats a one-off `import { describe } from 'vitest'`), and if the user wants the
tests to actually run, the fix is a `test: { globals: true, environment: 'jsdom' }` block in
vite.config.ts plus a `test` script — flag that as a separate change, not review churn.
