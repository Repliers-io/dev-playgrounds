---
name: Locations `name` param is /locations-only, not /locations/autocomplete
description: API contract — the `name` filter is only supported on GET /locations; it must be nulled out for /locations/autocomplete requests
type: project
---

The `name` query param is documented ONLY for `GET /locations`, NOT for `GET /locations/autocomplete`. In `filterSearchParams` (src/components/ParamsPanel/utils.ts), `name` must be nulled out in the `else` branch alongside `schoolType`, `schoolLevel`, `privateSchoolAffiliation`, and `schoolDistrictName`. The UI field in SearchSection.tsx should be gated with `locationsEndpoint && (...)` so users don't see it while the autocomplete endpoint is selected.

**Why:** Authoritative source is the Repliers API reference (e.g. https://raw.githubusercontent.com/Repliers-io/api-docs/main/llms-full.txt). The `/locations` param table lists `name`; the `/locations/autocomplete` param table does not. An earlier version of this memory incorrectly claimed `name` worked on both endpoints, which led to leakage. Fixed by commit on feat/liveby-schools.

**How to apply:** When reviewing new locations params, always cross-check the specific endpoint's param table in the raw API docs, not just the commit message or a summary. Treat WebFetch summaries with suspicion — fetch the raw text and grep it.
