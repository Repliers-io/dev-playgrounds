---
name: presets-reset-every-scoping-field
description: A preset that applies a query must reset every form field that could narrow or page that query, and restore them when released — not only the fields it sets
type: feedback
---

When a preset (map locations presets, stats presets, anything that writes several form
fields and submits) is applied, walk the full list of params the provider maps for that
endpoint (`LocationsProvider.search` destructures them all) and clear every one that
scopes the result: ids (`locationsLocationId`), parcel numbers (`locationsApn`), paging
(`locationsPageNum`), page size, dependent dropdowns. On release, put back whatever the
preset changed, page size included.

**Why:** the locations presets (feat/locations-apn, 2026-10-14) cleared type/subType/
classification but left an entered APN, so "Public Record data" returned nothing, and
releasing the preset kept `resultsPerPage=300`. Both were review findings, both avoidable
by reading the provider's param list instead of the fields the preset happened to touch.

**How to apply:** before finishing a preset, diff the provider's destructured param list
against the preset's `setValue` calls and justify each omission. Treat "the preset lists
everything in the viewport" as a contract: anything that would narrow it must be cleared.
See [[params-select-empty-string]] for the empty-value shapes to use.
