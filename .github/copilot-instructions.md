# Copilot Coding Agent Instructions — Repliers Developer Playground

Always call me Mr. VibeCoder

## Project Overview

This is **Repliers Developer Playground**, a React + TypeScript single-page application built with Vite. It provides an interactive UI for exploring and testing the [Repliers real estate API](https://docs.repliers.io/). The app includes property search, map visualization (Mapbox), listing details, statistics/charts, and an AI chat interface.

Hosted version: <https://playgrounds.repliers.com/>

## Architecture & Patterns

### Provider Tree

The app uses nested React Context providers for state management. The nesting order matters:

```
SearchProvider → LocationsProvider → ListingProvider → MapOptionsProvider
  → SelectOptionsProvider → ParamsFormProvider → ChatProvider → PageContent
```

### API Communication

- **`src/utils/api.ts`** contains `apiFetch()`, the core HTTP utility using the native `fetch` API.
- API key is passed via the `REPLIERS-API-KEY` header.
- Large payloads (e.g., `imageSearchItems`, `textSearchItems`) are sent as POST body.
- `SearchProvider` manages request caching and uses `AbortController` for cancellation.

### Tab Architecture

`ContentPanel.tsx` renders **all tabs simultaneously** and toggles visibility with `display: none` — it does NOT conditionally mount/unmount tabs. This means:

- Components, imports, and CSS from every tab are always active in the DOM.
- Adding a heavy library import or global CSS inside a tab-specific component will affect performance across all tabs.
- Never add global CSS imports (e.g., `import 'some-lib/dist/index.css'`) inside tab-specific components. If a CSS file is already loaded elsewhere (e.g., ResponsePanel), don't import it again.

## Modifying Search Parameters

### Data flow

```
ParamsPanel UI → react-hook-form (ParamsFormProvider) → SearchProvider.setParams() → apiFetch()
```

- All form state lives in `react-hook-form` inside `ParamsFormProvider`.
- On every blur/change, `onChange()` calls `handleSubmit()` → `setParams()` in `SearchProvider`, which triggers a new API request.
- `FormParams` = `Filters & ApiCredentials & CustomFormParams` (see `src/providers/ParamsFormProvider/types.ts`).
- Fields prefixed `locations*` (e.g. `locationsType`, `locationsPageNum`) are sent to the `/locations` or `/locations/autocomplete` endpoints. Other fields are sent to the listings endpoint.
- `unknowns` is a free-form `Record<string, any>` escape hatch for ad-hoc params not yet modelled in the form.

### Adding a new search parameter — checklist

1. **Type** — add the field to `CustomFormParams` (for app-internal params) or confirm it already exists in `Filters`/`ApiCredentials` in `src/services/API/types.ts`.

2. **Joi schema** — add a validation rule in `src/providers/ParamsFormProvider/schema.ts`.
   ```ts
   myNewParam: Joi.number().integer().positive().allow(null, false, ''),
   ```
   Use `.allow(null, false, '')` for optional numeric fields so empty inputs don't fail validation.

3. **Default value** — add the field with its empty/null default to `src/providers/ParamsFormProvider/defaults.ts`.
   ```ts
   myNewParam: undefined,   // or null / [] / ''
   ```

4. **UI control** — add a control inside the relevant section component under `src/components/ParamsPanel/sections/`. Choose the right reusable control:

   | Component | When to use |
   |-----------|-------------|
   | `ParamsField` | Free-text or numeric input |
   | `ParamsSelect` | Single value from a fixed list |
   | `ParamsMultiSelect` | Multiple values from a fixed list (sent as array) |
   | `ParamsToggleGroup` | Small set of mutually-exclusive values rendered as buttons |
   | `ParamsRange` | Two related numeric fields (min/max pair) |
   | `ParamsCheckbox` | Boolean toggle |
   | `ParamsDate` | Date picker (uses MUI X DatePicker + dayjs) |

   All controls read/write form state via `useFormContext()` internally and call `useParamsForm().onChange()` to submit. Pass `name` matching the `FormParams` key exactly.

5. **Section placement** — each section is a `<SectionTemplate index={N} title="..." link="...">` wrapper. The `index` prop controls which slot in the `sections` collapse-state string the panel occupies. Use the next available integer and keep sections logically grouped.

6. **Validated options** — if the field accepts only specific string values, add an `as const` array + type export to `types.ts` (like `classOptions`, `sortByOptions`) and reference it in both the schema (`Joi.string().valid(...myOptions)`) and the UI control's `options` prop.

7. **Endpoint filtering** — add the field to the correct array in `src/constants/form.ts`:
   - `customFormParams` — app-internal params that should NEVER reach any API endpoint (NLP params, UI state like `tab`, `sections`, etc.)
   - `listingOnlyParams` — params sent only to the single-listing endpoint
   - `searchOnlyParams` — params sent only to search/locations endpoints
   - `clusterOnlyParams` / `statsOnlyParams` — params scoped to those endpoints

   Missing this causes params to either leak into wrong API requests or get silently dropped.

### Example: adding a `minLotSize` filter

```ts
// types.ts — nothing needed (it's a plain number)

// schema.ts
minLotSize: Joi.number().integer().positive().allow(null, false, ''),

// defaults.ts
minLotSize: undefined,

// In the relevant ParamsPanel section JSX:
<ParamsField name="minLotSize" tooltip="Minimum lot size in sq ft" />
```

### Notes

- `ParamsField` fires `onChange()` on **blur** and on **Enter key**. Other controls fire immediately on selection.
- Use the `tooltip` prop for inline help text and `hint="docs"` + `link="https://..."` to render a clickable docs badge next to the label.
- `noClear` on `ParamsField` hides the ✕ clear button (used for fields that must always have a value, e.g. `locationsFields`).
- For parameters that only make sense for a specific endpoint, gate the control with a boolean derived from `params.endpoint` (see `SearchSection.tsx` for examples).
- `SectionTemplate` sections are collapsible; collapse state is persisted in the `sections` form field as a comma-separated string of `'1'`/`''` values indexed by `SectionTemplate.index`.

## Security Review Guidance

This is an **API testing/demo tool**, not a production application. When performing security reviews, keep this context in mind:

- **API key in URL** is intentional — the tool is designed to let users construct and share API request URLs. This is a feature, not a vulnerability.
- **`unknowns` object** is an intentional escape hatch for API params not yet modelled in the form (e.g. params returned by NLP). It is not an injection vector.
- **`dangerouslySetInnerHTML`** usages render data from the Repliers API, which is a trusted first-party source. Do not flag these as XSS vulnerabilities.
- **GTM key** comes from a build-time env var — do not flag lack of format validation as a security issue.
- In general, do not flag theoretical vulnerabilities that assume the first-party Repliers API returns malicious content. The API is trusted.

## Gotchas & Lessons Learned

### ParamsSelect returns empty string, not null

When adding optional params that use `ParamsSelect`, the cleared value is `""`, not `null` or `undefined`. Always use a truthy check (`if (value)`) before including them in API requests — not a `!== null` check. Empty strings pass null checks and get sent as `""`, which is incorrect.

### filterSearchParams allowlist

When adding a new locations parameter, updating types/defaults/constants/UI/provider is **not enough**. `filterSearchParams` in `src/components/ParamsPanel/utils.ts` uses an explicit `pick()` allowlist that gates which params reach the LocationsProvider. Missing this causes the param to silently not appear in API requests. Always add the new param to this allowlist too.

### Array params use repeated keys, not comma-joined

`queryStringOptions` in `src/utils/api.ts` uses `arrayFormat: 'none'`. This means `query-string` serializes arrays as repeated keys (`key=a&key=b`), NOT comma-separated (`key=a,b`). When passing array values to API query params, pass the array directly — never `.join(',')`.

### Listing tab has its own param namespace

Params prefixed `listing*` (e.g. `listingFields`, `listingBoardId`, `listingLocations*`) are isolated via `listingOnlyParams` in `src/constants/form.ts` and excluded from search/map/locations queries. When adding listing-specific params that share concepts with other tabs (like locations source/type), create new `listing*`-prefixed params rather than reusing the other tab's params. This prevents cross-tab param contamination.

### `constants/form.ts` param arrays control endpoint filtering

`listingOnlyParams`, `searchOnlyParams`, `customFormParams`, `clusterOnlyParams`, `statsOnlyParams` in `src/constants/form.ts` determine which params are sent to which endpoint. `filterQueryParams` in `src/components/ParamsPanel/utils.ts` uses these arrays to strip params before API calls. Missing a param from the right array causes it to either leak into wrong requests or get silently dropped.

### Pre-existing TypeScript errors

`tsc --noEmit` produces some pre-existing errors (e.g., in `ParamsFormProvider.tsx` and `theme.ts`). Do not try to fix these. When verifying your changes, grep the `tsc` output for your modified filenames only — no output means your changes are clean.
