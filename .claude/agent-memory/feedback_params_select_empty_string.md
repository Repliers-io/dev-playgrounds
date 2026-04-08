---
name: ParamsSelect empty string guard
description: ParamsSelect returns empty string (not null) when deselected — guard with truthy check, not null check
type: feedback
---

When adding optional params that use `ParamsSelect`, the deselected/cleared value is an empty string `""`, not `null` or `undefined`. Always use a truthy check (`if (value)`) before including them in API request bodies — not a `!== null && !== undefined` check.

**Why:** Empty strings pass null/undefined checks and get sent in the request body as `""`, which is incorrect — the param should be omitted entirely when not selected.

**How to apply:** Any time a new form param is added via `ParamsSelect` and conditionally included in an API request, use `if (value)` to guard it.
