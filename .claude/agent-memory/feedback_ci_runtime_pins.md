---
name: ci-runtime-pins
description: Before touching .nvmrc, engines or .npmrc, grep the workflows and Procfile for what reads them, and never pin the runtime to a release-day version under engine-strict
type: feedback
---

`.github/workflows/deploy-pages.yml` reads `.nvmrc` via `node-version-file`. `.npmrc`
sets `engine-strict=true` and `min-release-age=7`, so `engines.node` in `package.json` is
enforced on every `npm ci`, locally and in CI.

**Why:** the CI commits on feat/locations-apn (f8933df) deleted `.nvmrc` while the
workflow still read it, breaking the Pages deploy, and pinned `engines.node` to a Node
release that was zero days old and not LTS, so `npm ci` failed with EBADENGINE on every
Node 24 LTS machine. Both surfaced only in review.

**How to apply:** `grep -rn "nvmrc\|node-version\|engines" .github Procfile package.json`
before changing any of them, and keep them consistent. Pin `engines.node` to the current
LTS line (`>=24` or `^24`), never to a version younger than the `min-release-age` rule
you impose on packages. Run `npm ci` once after the change on the machine's own Node.
