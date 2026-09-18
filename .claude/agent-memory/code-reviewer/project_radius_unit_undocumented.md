---
name: radiusUnit is undocumented in the public Repliers API reference
description: API contract — as of 2026-09-18 `radiusUnit` appears nowhere in the Repliers public API docs; `radius` is documented as "in KM" for /listings, /locations, /locations/autocomplete and /buildings
metadata:
  type: project
---

`radiusUnit` is NOT present in the Repliers public API reference (checked
https://raw.githubusercontent.com/Repliers-io/api-docs/main/llms-full.txt on 2026-09-18 —
zero matches). Every documented `radius` param on `/listings`, `/locations`,
`/locations/autocomplete` and `/buildings` is described as "Accepts a value for radius in KM",
with no unit override and no documented max. The playground added it anyway on branch
`feat/radiusUnit` (commit 04dd65c) with allowed values `m | km | mi | yd`.

**Why:** The docs repo lags behind the API server for newly shipped params, so absence from the
docs is not proof the param does not exist — but it does mean the allowed-value list, the default,
and any max-radius constraint in this repo are unverified guesses, not a contract.

**How to apply:** When reviewing or extending radius/unit handling, do not treat
`radiusUnitOptions` in `src/providers/ParamsFormProvider/types.ts` as authoritative. Re-grep
llms-full.txt (and the API Server Changelog at help.repliers.com) before adding units or raising
the slider max; ask the user to confirm against the live API if it still is not documented.
Related: [[project_locations_name_param]] — same lesson about verifying per-endpoint param tables.
