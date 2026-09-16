# Architecture & Non-Obvious Internals

This document describes how the Repliers Developer Playground is wired together and
collects the things that are **not** obvious from reading a single file. It complements
[`.github/copilot-instructions.md`](../.github/copilot-instructions.md), which holds the
step-by-step checklist for adding a new search parameter. That checklist is not repeated here.

Everything below was verified against the source at the time of writing. File paths are
relative to the repo root; function names are given instead of line numbers so the doc
survives refactors.

---

## 1. What the app is

A single-page React + TypeScript + Vite tool for poking the [Repliers API](https://docs.repliers.io/).
It has one page with three columns:

```
┌───────────────┬──────────────────────────────┬────────────────────┐
│ ParamsPanel   │ ContentPanel                 │ ResponsePanel      │
│ (280px)       │ Map | Statistics | Listing |  │ (360px, expandable)│
│ form controls │ Chat  — all mounted at once  │ request URL + JSON │
└───────────────┴──────────────────────────────┴────────────────────┘
```

and five tabs (`tab` form param): `locations`, `map` (Listings Search, the default),
`stats`, `chat` (AI Listings Search), `listing` (single listing by MLS number).

There is **no router, no backend, no persistent storage**. The URL query string is the only
state that survives a reload.

---

## 2. Repository layout

```
src/
├── App.tsx                  bootstraps state from window.location.search, builds provider tree
├── main.tsx                 StrictMode + ErrorBoundary (prints error.stack on crash)
├── utils.ts                 URL → form coercion (booleanFields, multiSelectFields)
├── components/
│   ├── PageContent.tsx      header + tabs + 3-column layout
│   ├── ContentPanel.tsx     mounts ALL tab bodies, toggles display:none
│   ├── ParamsPanel/         left column: sections + reusable controls + THE request dispatcher
│   ├── ResponsePanel/       right column: request URL parser/diff + JSON viewer
│   ├── Map/                 Mapbox wrapper, markers, clusters, draw button, carousel, SearchField
│   ├── Statistics/          recharts charts for the `statistics` response block
│   ├── Chat/                NLP chat UI + "Apply Filters" extraction
│   ├── Listing/             single-listing JSON → sectioned view
│   └── Autosuggest/         EMPTY STUB, unused (real autosuggest is Map/components/SearchField)
├── providers/               React contexts (see §3.1)
├── services/
│   ├── API/types.ts         ~1200 lines of API types; header says "THIS FILE SHOULD NOT EXIST"
│   ├── Map/Map.tsx          MapService singleton: DOM markers, cluster bubbles, boundary layers
│   └── Search/              map param builders (getMapRectangle / getMapPolygon) + Filters type
├── constants/               form.ts (endpoint allowlists), map.ts, presets, i18n, ...
├── hooks/                   useDeepCompareEffect, useIntersectionObserver, useValidateDropdownSelections
├── utils/                   api.ts (apiFetch), map.ts, dom.ts, formatters.ts, path.ts, ...
└── styles/                  MUI theme split into 6 files
```

Path aliases (`components/…`, `providers/…`, `utils/…`, …) are declared in **three places**
that must stay in sync: `vite.config.ts` (`resolve.alias`), `tsconfig.json` (`baseUrl: ./src`)
and `package.json` (`"alias"`, a leftover Parcel-style block that nothing reads).

---

## 3. Runtime architecture

### 3.1 Provider tree and why the order matters

```
ThemeProvider
└─ SearchProvider            params (committed state), listings search, polygon
   └─ LocationsProvider      /locations and /locations/autocomplete
      └─ ListingProvider     /listings/{mlsNumber}
         └─ MapOptionsProvider           map position, canRenderMap, focusedMarker, editMode
            └─ SelectOptionsProvider     dropdown options via /listings?aggregates=…
               └─ LocationsSelectOptionsProvider          /locations?aggregates=… (Locations tab)
                  └─ ListingLocationsSelectOptionsProvider /locations?aggregates=… (Listing tab)
                     └─ ParamsFormProvider   react-hook-form + Joi + dayjs LocalizationProvider
                        └─ ChatProvider      /nlp — uses useFormContext(), so MUST be inside the form
                           └─ PageContent
```

Dependencies that fix the order:

- Everything below `SearchProvider` calls `useSearch()` to read `apiKey` / `apiUrl` / `tab`.
- `MapOptionsProvider` needs `useSearch()` for credentials to run `centerMap`.
- `ParamsFormProvider` needs `useSearch()` for `params` and `setParams`.
- `ChatProvider` calls `useFormContext()` (reads `nlp*` fields via `getValues`) so it must be
  inside `ParamsFormProvider`.

Each of `SearchProvider`, `LocationsProvider`, `ListingProvider`, `ChatProvider` exposes the
**same duck-typed response shape** (`request`, `requestMethod`, `requestBody`, `json`, `size`,
`time`, `statusCode`, `loading`, `clearData`). `ResponsePanel` picks one of the four by `tab`
and renders it without knowing which it got.

### 3.2 State lives in three layers

```
URL query string  ──(once, on load)──▶  SearchProvider.params  ◀──setParams──  react-hook-form
       ▲                                        │                                     ▲
       └────── pushState on every change ───────┘──── values: merge(defaults, params) ─┘
```

1. **URL** — `App.tsx` parses `window.location.search` **exactly once**. `lat/lng/zoom` go to
   `MapOptionsProvider`; `imageSearchItems`/`textSearchItems` are dropped (POST-only); the rest
   goes through `formatBooleanFields` + `formatMultiSelectFields` (`src/utils.ts`) and becomes
   the initial `SearchProvider.params`. Later URL changes are never re-read.
2. **`SearchProvider.params`** — the "committed" params. This is what triggers requests and
   what gets written back to the URL.
3. **react-hook-form** (`ParamsFormProvider`) — the draft. `useForm` is created with
   `values: merge(defaultFormState, params)`, so the form **re-syncs from the provider** every
   time `params` changes. Every control calls `useParamsForm().onChange()` which runs
   `handleSubmit(setParams)`. So: control → form → `setParams` → `params` → form (again).

Consequences:

- `merge` is `deepmerge`, which **concatenates arrays**. All array defaults in
  `providers/ParamsFormProvider/defaults.ts` must stay empty (`[]`) or they will be duplicated
  into every submit.
- The Joi resolver runs with `allowUnknown: true`; only ~40 of ~100 fields have schema rules.
  Unlisted fields pass through untouched.
- `apiKey` resolution order in `SearchProvider`: URL `?key=` → URL `?apiKey=` →
  `VITE_REPLIERS_API_KEY`. `key` is an alias that also gets echoed back into the URL.

### 3.3 One effect dispatches every request

`components/ParamsPanel/ParamsPanel.tsx` contains a single `useDeepCompareEffect` (JSON.stringify
based, `hooks/useDeepCompareEffect.ts`) that is **the only place any tab's main request is
fired**. The Map component never calls the API itself.

```
deps: [position, apiKey, params, polygon, canRenderMap, locationsMap, listingTab, chatTab]

if (!canRenderMap) return                         // ← nothing fires until the map has a position
updateUrlState(position, params)                  // ← ALWAYS, for every tab
switch (tab):
  listing   → ListingProvider.search(...)         // GET /listings/{mlsNumber}
  chat      → nothing                             // chat sends on user message only
  locations → LocationsProvider.search(...)       // GET /{endpoint} — ignores polygon
  map/stats → SearchProvider.search(...)          // GET|POST /listings with map= bounds/polygon
```

Non-obvious points:

- **Even the Listing and Locations tabs are gated on `canRenderMap`.** If the map never gets a
  position (no listings for the key, no `lat/lng/zoom` in the URL, `/listings` bootstrap
  failed) no tab will fetch anything.
- `fetchData` (map/stats) additionally bails if there is **neither bounds nor polygon**.
  Bounds only exist after Mapbox fires `load`, which is why the first search happens a beat
  after the map appears.
- There is **no debounce on map movement**. Every `moveend` re-runs the effect. Duplicate
  suppression happens inside each provider instead (see §3.4).
- Zooming re-submits the form: `ClustersSection` has an effect that writes
  `clusterPrecision = Math.round(zoom + 2)` whenever `cluster && dynamicClusterPrecision`, then
  calls `onChange()`.

### 3.4 Request pipeline for the listings search

```
params
 └─ filterQueryParams()        strips customFormParams, listingOnlyParams, and conditionally
 │                             statsOnlyParams (!stats), clusterOnlyParams (!cluster),
 │                             searchOnlyParams (tab !== 'locations'), radius (!center)
 │                             + splits maybeArrays (state/area/city/neighborhood/locationId/…)
 ├─ statistics += ',' + grp    ← `grp` is never sent on its own; it is appended to `statistics`
 ├─ getMapPolygon | getMapRectangle   → map=[[[lng,lat],…]] as a hand-built STRING (not JSON)
 ├─ getCenterPoint()           → lat/long/radius from the MAP CENTER (not a form field)
 └─ ...unknowns                → spread raw into the query (NLP escape hatch)
      └─ SearchProvider.search()
           ├─ POST_BODY_FIELDS (imageSearchItems, textSearchItems) → body; everything else → query
           ├─ method flips GET → POST automatically when the body is non-empty (utils/api.ts)
           ├─ cacheKey = `${method}:${url}${JSON.stringify(body)}`; identical key + same apiKey → skipped
           ├─ previous in-flight request is aborted via AbortController
           └─ response: `aggregates.map.clusters` → clusters, `statistics`, `listings`, `count`, `numPages`
```

Details worth knowing:

- `queryStringOptions` (`utils/api.ts`): `arrayFormat: 'none'`, `skipEmptyString`, `skipNull`.
  Arrays serialize as repeated keys (`status=A&status=U`). Clearing a control to `''`/`null`/`[]`
  makes the param vanish; `false` does **not** vanish, so `stats=false&center=false` is always
  in the URL.
- `map=` is built by `utils/map.ts:toRectangle` in the order NE → NW → SW → SE with `.wrap()`
  applied to longitudes. Polygon wins over bounds when both exist.
- Center/radius: for the listings search `getCenterPoint(..., { requireRadius: true })` drops
  `lat/long` entirely when `radius` is empty. For the Locations tab it sends `lat/long` without
  `radius`. The API param is `long`, not `lng`.
- Response size is read from `content-length`; if the header is missing the body is cloned and
  measured via `Blob`. The panel colors it green < 50 kB, orange < 200 kB, red above.
- `apiFetch` has a `catch` that checks `error.message === '401'`. `fetch` never throws on HTTP
  status, so that branch is dead.
- Each provider has a `disabled` ref that is checked before saving the response but **never set
  to `true` anywhere**. Dead.

### 3.5 URL persistence

`ParamsPanel.updateUrlState` does `window.history.pushState(null, '', '?' + query)` with
`{ lng, lat, zoom, ...params }` minus `imageSearchItems`, `textSearchItems`, `unknowns`,
`nlpId`, `nlpLat`, `nlpLong`.

- **`apiKey` is written to the URL on purpose** (shareable request URLs are the product).
- The drawn **polygon is not persisted** (`// TODO: add polygon to url`). Reload loses it.
- UI-only state (`tab`, `sections`, `stats`, `center`, `dynamicClustering`, …) is in the URL too.
- `utils/map.ts` still contains an older, incompatible URL format (`?43.1,-79.1&z=10` via
  `getMapUrl`/`setMapUrl`/`getCoords`). `setMapUrl` and `getCoords` are dead, but `getMapUrl` is
  still used as the `href` of cluster markers, so middle-clicking a cluster opens a URL nothing
  can read.

### 3.6 What happens on startup (with a valid key)

Before the user touches anything the app issues roughly six requests:

| # | Who | Request | Why |
|---|-----|---------|-----|
| 1 | `MapOptionsProvider.centerMap` | `GET /listings?fields=map,mlsNumber` | No `lat/lng/zoom` in URL → fetch **all** listings to compute a bounding box |
| 2 | `SelectOptionsProvider` | `GET /listings?aggregates=details.style,details.propertyType,lastStatus,standardStatus&listings=false&status=A&status=U` | Dropdown options for the listings form |
| 3 | `LocationsSelectOptionsProvider` phase 1 | `GET /locations?aggregates=source&locations=false` | `source` dropdown |
| 4 | `LocationsSelectOptionsProvider` phase 2 | `GET /locations?aggregates=type,subType,classification,school.*&locations=false[&source=…]` | Remaining Locations dropdowns, filtered by chosen sources |
| 5–6 | `ListingLocationsSelectOptionsProvider` | same two calls again (`type,subType,classification` only) | Independent copy for the Listing tab |
| 7 | the dispatcher effect | the tab's real request | once `canRenderMap` and bounds exist |

Request 1 is skipped when the URL carries `lat/lng/zoom`. Its result is filtered by
`utils/map.ts:getLocations` to **northern + western hemisphere only** (`lat > 0 && lng < 0`);
listings elsewhere are ignored for centering, and with nothing left the map falls back to the
geographic centre of the USA at zoom 4 (`constants/map.ts:defaultMapCenter`).

Dropdown options always get an empty `''` entry injected first and are sorted by descending
count, except fields listed in `constants/form.ts:locationsAlphabeticalFields` (currently only
`type`). `useValidateDropdownSelections` silently removes selected values that are no longer in
the option list (e.g. after changing `locationsSource`).

---

## 4. Tabs

### 4.1 Listings Search (`tab=map`) and Statistics (`tab=stats`)

Both tabs render the **same ParamsPanel branch**; only the centre pane differs. Statistics
has no dedicated params — the `stats` toggle, `statistics` multiselect and `grp` live in the
shared `StatisticsSection`.

**Markers vs clusters** (`components/Map/Map.tsx:showMarkersAndClusters`):

- Clusters are shown when `clusters.length && (!dynamicClustering || count > 100)`
  (`constants/map.ts:markersClusteringThreshold`). Otherwise plain markers.
- A cluster that carries inline listing data (`count === 1 && listing`, or a non-empty
  `listings[]` when `clusterListingsThreshold` is set) is converted into **synthetic `Listing`
  objects and drawn as ordinary markers**. Only the remaining "multi" clusters become bubbles.
- When clusters are on, the response's `listings` array is **ignored for the map** but is
  still what `CardsCarousel` renders, so the carousel and the pins can disagree.
- The cards drawer auto-opens once (`firstTimeLoaded` ref) and every results change calls
  `blurMarker()`.

**Draw mode** (`components/Map/components/MapDrawButton`):

- `mapbox-gl-draw` is created lazily on entering draw mode with all default controls off.
- The polygon of record is `SearchProvider.polygon` (first ring of the first feature), not
  the draw plugin's state. Setting it re-fires the dispatcher.
- Clicking the draw button **always clears the existing polygon first**
  (`// TODO: future task: do not delete existing polygon`). The code that re-hydrates an
  existing polygon into the plugin is therefore practically unreachable.
- While a draw feature is selected the map container gets `disable-pointer-events`, whose CSS
  turns off pointer events on `.mapboxgl-marker` so clicks reach the polygon, not the pins.
- `editMode` has a declared `'highlight'` value that nothing sets or reads.

**Center + radius** (`CenterRadiusSection`): `center` is a boolean UI flag; `lat/long` are
taken from the **current map centre** at request time. The `MapCenterPoint` overlay marks it.

### 4.2 Locations (`tab=locations`)

- `endpoint` toggles `locations` vs `locations/autocomplete`. `SearchSection` gates several
  controls on it; `filterSearchParams` nulls `search` for `/locations` and nulls
  `pageNum/resultsPerPage/name/school*` for `/locations/autocomplete` (the API only documents
  those on `/locations`). The comment there says "remove `q`" — the actual param is `search`.
- Form fields are prefixed `locations*` to avoid clashing with listings params, and
  `LocationsProvider.search` **renames them back** to bare API names (`locationsType → type`,
  `locationsLocationId → locationId`, `locationsHasBoundary → hasBoundary`, …).
- `filterSearchParams` uses an explicit `pick()` allowlist. A new `locations*` field that is
  not added there is silently dropped even if types/defaults/UI are correct.
- `state`, `area`, `city`, `neighborhood`, `locationsLocationId` accept comma-separated lists
  with quoted commas: `York,"Stormont, Dundas and Glengarry"` → two values
  (`ParamsPanel/utils.ts:parseQuotedCommaString`). Quoted items are appended **after** the
  unquoted ones, so input order is not preserved.
- Changing `locationsSource` clears `locationsType/SubType/Classification` and re-submits;
  phase 2 of `LocationsSelectOptionsProvider` refetches the options filtered by source.
- Locations render as boundary polygons (GL layers) when `map.boundary` exists, otherwise as
  small dots. The marker id includes the boundary point count:
  `location-{locationId}-{boundary[0].length || 0}`.
- `SearchField` (only on this tab) is a permanently-open MUI Autocomplete with server-side
  results. Per row there are four actions: click → highlight; crop icon → (autocomplete
  endpoint only) clear `state/area/city/neighborhood`, set `locationsLocationId`, and switch
  `endpoint` to `locations` (the `/locations` branch is commented out); target icon →
  `flyTo` at hardcoded zoom 10; input icon → `tab='map'` + `locationId`. An empty `search`
  with the autocomplete endpoint suppresses the request entirely.

### 4.3 Statistics details

- `statistics` is stored as a **comma-joined string** (multiselect in `stringValue` mode).
  Default is only `med-listPrice,avg-listPrice,sd-listPrice` because the daysOnMarket / soldPrice
  stats error without `status=U` (see the note in `ParamsFormProvider/types.ts`).
- `grp-*` grouping values are appended to `statistics` at request time; `grp` itself is in
  `customFormParams` and never leaves the browser.
- `constants/stat-presets.ts` computes its date windows with `dayjs()` **at module load**, so
  a tab left open overnight has stale preset dates until reload.
- `Statistics.tsx:getColumns` explicitly skips `sqftHigh`/`sqftLow` (`// hardcoded hackery`),
  splits multi-column stats into one chart per column, and renders `StatBarChart` for plain
  numbers vs `StatAreaChart` for grouped objects. Gradient `<defs>` reuse ids `color0..5`
  across charts.
- `DisabledResults` only appears when `stats` is off **and** the response still contains a
  `statistics` block (the API returns min/max by default). `EmptyResults` literally says
  "Loading..." even when there is simply no data.

### 4.4 AI Listings Search (`tab=chat`)

- Always `POST {apiUrl}/nlp?nlpVersion=…`. Only `nlpVersion` is a query param; `prompt`,
  `nlpId`, `clientId`, `listings`, `fields`, `useLocationId`, `locationsSource`, `lat`, `long`
  go in the body, each only when set. `nlpLat/nlpLong` UI is behind
  `constants/featureFlags.ts:ENABLE_NLP_COORDINATES = false`, the only feature flag.
- **Sticky session**: `ChatProvider` keeps `stickySession` (default `true`). After each reply
  `nlpId` is written back into the form; it is sent on the next message only while sticky is
  on. `nlpId` is stripped from the URL, so sessions are not shareable. "Restart" wipes history
  and `nlpId`.
- **"Apply Filters"** (`Chat/utils.ts:extractFilters`) parses the `request.url` and
  `request.body` the NLP endpoint returns. Keys present in `defaultFormState` become filters;
  unknown keys, and **known keys whose values are not in the current dropdown options**, go
  into `unknowns` and show up in the "Other Parameters" section. Applying also forces
  `tab='map'`, enables `stats`/`cluster` if related keys appeared, and sets `center` when a
  `radius` is present.
- The reply text is typed out at 20 ms/char (`TypingText`); the Apply button only appears
  after typing finishes. Scroll-to-bottom is `scrollTo({ top: 1000000 })` after a 100 ms timer.
- Two different `APIChatResponse` types exist (`components/Chat/types.ts` and
  `providers/ChatProvider/types.ts`); the provider uses the latter.

### 4.5 Listing (`tab=listing`)

- `GET {apiUrl}/listings/{mlsNumber}` — the MLS number is a **path segment**. Both
  `ParamsPanel.fetchProperty` and `ListingProvider.search` require `mlsNumber`; a
  `listingBoardId`-only state does nothing.
- All params are `listing*`-prefixed and listed in `constants/form.ts:listingOnlyParams`, which
  is **always** stripped from the listings search. That is also why `mlsNumber` cannot be used
  as a filter on the Listings Search tab.
- `listingLocations` is the **string** `'true' | 'false'`, not a boolean, and gates whether
  `locations`, `locationsSource`, `locationsType` are sent.
- Rendering (`Listing/utils.ts:separateProperties`): every primitive top-level field is hoisted
  into a synthetic `root` section (displayed as `_root`); every object/array field becomes its
  own section. `config.ts:sectionOrder` orders the known ones, unknown sections are appended
  alphabetically, arrays inside `root` are hidden, and the literal strings `'null'` /
  `'undefined'` are treated as empty. Images go through `https://cdn.repliers.io/{file}?class=medium`.

---

## 5. ParamsPanel internals

### 5.1 Controls: what they write and when they submit

| Control | Cleared value | `onChange()` (submit + request) fires |
|---|---|---|
| `ParamsField` | `''` | on **blur** and on **Enter**; never per keystroke |
| `ApiKeyField` | n/a | on blur, Enter, and **immediately on paste**; Esc cancels |
| `ParamsSelect` | `''` (**not** `null`) | immediately |
| `ParamsMultiSelect` | `[]` (or `''` in `stringValue` mode) | only when the dropdown **closes** |
| `ParamsRange` | `null` | on mouse-up (`onChangeCommitted`) |
| `ParamsDate` | `null` | immediately; value format is always `YYYY-MM-DD` |
| `ParamsCheckbox` / `AndroidSwitch` | `false` / `null` | immediately |
| `ParamsToggleGroup` | — | immediately; cannot deselect unless `allowEmpty` |

Gotchas:

- `ParamsSelect` clears to `''`. Guard with a truthy check, not a null check, before sending.
- `ParamsRange` stores `localValue ? localValue : null`, so **0 is unreachable** even where
  `min={0}` (`radius`, `clusterListingsThreshold`).
- `ParamsMultiSelect` calls `useState`/`useEffect` **inside the `Controller` render prop**. It
  works because RHF calls `render` from a component body, but it is a rules-of-hooks landmine.
- `ApiKeyField` keeps two `TextField`s mounted: the RHF-registered one is `display:none` while
  not editing; the visible one is read-only and shows first 4 + last 4 characters.
- The cluster switch writes `true` or `null` (never `false`), so `cluster` disappears from the
  URL when off. `listings` is deliberately **not** boolean-coerced; code compares
  `params.listings === 'false'`.
- Every control renders `<Box id={name}>`. Presets and the chat "Apply" flow rely on those DOM
  ids for scroll/highlight.
- "Clear All" buttons have `type="submit"`, but there is no `<form>` element anywhere. The
  attribute is inert; the click handler does the work.

### 5.2 Section collapse state

`SectionTemplate` stores collapse state in the `sections` form field as a **sparse
comma-joined string** indexed by the hardcoded `index` prop: `''` expanded, `'1'` collapsed.
Collapsing section 5 with everything else open yields `sections=,,,,,1`. Toggling calls
`setValue` without `onChange()`, so it does not fire a request, but the value still reaches the
URL on the next submit.

Current index registry (keep unique per tab):

| idx | section | idx | section |
|---|---|---|---|
| 0 | Credentials | 8 | Quality Scores (`AiImageSection`) |
| 1 | QueryParams / ChatParams (different tabs) | 9 | AI Image Search |
| 2 | Statistics | 10 | ListingParams |
| 3 | Clusters | 11 | Unknown parameters |
| 4 | Bounds | 12 | OpenHouse **and** AiText (dormant collision; AiText is not rendered) |
| 5 | Search (locations) | 13 | Timerange |
| 6 | CenterRadius | 14 | School |
| 7 | LocationParams | | |

### 5.3 Presets

- `ParamsPresets` / `StatPresets` call `setValue(key, value)` for every entry **including
  `undefined`** (that is how a preset clears fields), then `onChange()`, then highlight and
  scroll to the first field's `#id`. `ParamsPresets` force-expands section index 1;
  `StatPresets` also sets `stats=true`.
- `AiImagePresetsSection` replaces the first `imageSearchItems` entry if it is empty,
  otherwise appends. It scrolls to `#ai-image-section`, but the section's id is `ai-section`,
  so the scroll is a silent no-op.
- `AiTextSection` is commented out in `ParamsPanel` ("until generally available"), yet
  `textSearchItems` is still a live POST body field.

---

## 6. ResponsePanel

- Request URL is parsed with an **unguarded `new URL(request)`** in `RequestParser`. A
  malformed `apiUrl` throws into the top-level ErrorBoundary.
- A second, invisible overlay renders `diffString(prevRequest, request)` so changed query
  params flash yellow for 2 s. On the first render the whole URL flashes.
- "Copy request" scrapes `.request-text` `innerText` from the DOM rather than using state.
- Marker ↔ JSON linking: `focusedMarker.split('-')[1]` extracts the MLS number or location id
  from `marker-{mls}-{boardId}` / `location-{id}-{n}`, then `utils/dom.ts` finds the node with
  an XPath `contains(text(), …)` search and toggles `.highlight` on its `closest('ul')` parent.
- `error = statusCode > 200`, so 201/204 would render as an error (the API never returns them
  here).
- JSON viewer is `react-json-view-lite` with nodes auto-expanded to depth 3.

---

## 7. Map internals

- The Mapbox instance is created **once and never destroyed**. `ContentPanel` never unmounts
  `<Map />`; `destroyMap` exists but is never called. Creation waits for
  `canRenderMap && (locationsTab || listingsTab)`.
- `initializeMap` retries on `requestAnimationFrame` up to 120 times while the container is
  0×0 (hidden tab), then gives up silently.
- Position is read only from `load` and `moveend`. `load` is needed because `getBounds()` is
  undefined before it.
- `canRenderMap` means "we know where to put the map", not "the map exists".
- `map.setStyle()` (style switch) **wipes custom sources and layers**; polygon/boundary layers
  are not re-added afterwards.
- `MapService` (`services/Map/Map.tsx`) is a module singleton. Every listing pin is a DOM
  `mapboxgl.Marker` whose element hosts its **own React root** (`createRoot` per marker, never
  unmounted, only `marker.remove()`d). Markers are **write-once**: an existing id is skipped,
  so a pin never re-renders if its data changes. Stale ids are diffed and removed.
- Location boundaries are real GL layers (`{id}`, `{id}-fill`, `{id}-outline`); a fake marker
  object whose `remove()` deletes the layers is stored in the same `markers` registry.
- Cluster keys are `c-{count}-lat-{lat}-lng-{lng}`; a cluster whose count changes is a new
  cluster. Bubble diameter is `20 + label.length * 4` px.
- Focus is by DOM id: `document.getElementById(focusedMarker)`; if nothing is found the id is
  assumed to be a GL polygon and `focusPolygon` recolors it `#ff9800`. Three components
  (`Map`, `CardsCarousel`, `SearchField`) each keep their own `prevFocusedMarker` ref and
  toggle a `.focused` class manually; `.focused` is defined globally in two CSS files.
- `useIntersectionObserver` is a one-way latch (stays `true` after the third intersection); it
  is only used to call `map.resize()` when the tab becomes visible.
- `.mapboxgl-marker` is forced to `position:absolute!important; top:0; left:0` to win a
  styling fight with MUI/emotion.
- API bounds are mixed-axis: `top_left.longitude` + `bottom_right.latitude` form the NE
  corner. `utils/map.ts:toMapboxBounds` exists to untangle that.

---

## 8. Validation (Joi) notes

- Only `apiKey` and `apiUrl` are `required()`; `apiUrl` must be a URI. A bare `trigger()` runs
  on mount so a missing key errors immediately and shows the "Get Valid API Key" link.
- Every array field uses `.single()`, so `?status=A` (a bare string from the URL) validates.
- The idiom `.allow(null, false, '')` on numeric fields means literal `false` is accepted.
- Page-size caps differ: `resultsPerPage` ≤ 100, `locationsResultsPerPage` ≤ 300.
- `minQuality`/`maxQuality` are floats in 1.0–6.0. No date field has any rule.
- Validation mode is `onBlur`, `shouldFocusError: false`, errors go to `console.error`.

---

## 9. Tooling, conventions, deployment

- **ESLint**: `react-hooks/exhaustive-deps` is **off**. Empty dependency arrays are everywhere
  on purpose; the code relies on `useDeepCompareEffect`, refs and closures instead. `no-console`
  allows only `console.error`. `simple-import-sort` enforces custom groups (react → `@mui` →
  bare → `services/providers/hooks/utils/constants` → styles → relative). Type imports must be
  inline (`import { type X }`).
- **Prettier**: no semicolons, single quotes, 80 columns, no trailing commas.
- **TypeScript**: `tsc --noEmit` has pre-existing errors (e.g. `ParamsFormProvider.tsx`,
  `theme.ts`). Grep the output for your own files only.
- **Tests**: `jest` + `ts-jest` are installed and `src/utils/*.test.ts` exist, but there is
  **no `test` script and no `jest.config.js`** (the eslintignore mentions one). Run them with
  `npx jest` if needed; they are not part of any pipeline.
- **Env vars** (`VITE_*`): `VITE_REPLIERS_API_URL`, `VITE_REPLIERS_API_KEY`, `VITE_MAPBOX_KEY`,
  `VITE_GTM_KEY` (GTM injected only when `import.meta.env.PROD`). The README-mentioned
  `.env.example` does not exist in the repo.
- **Dev server**: port 3003, `host: true`, opens the browser automatically.
- **Deployment**: `.github/workflows/deploy-pages.yml` builds `npm run build:github` and deploys
  to GitHub Pages **on push to `dev`**, not `main`. `public/CNAME` pins the custom domain.
  `Procfile` (`npx serve dist/`) exists for Heroku-style hosts. Node version is `v24.x`
  (`.nvmrc`). `getBase()` in `vite.config.ts` returns `/` for every mode, so the mode switch is
  currently a no-op.
- **AI agent config**: `.github/copilot-instructions.md` is the shared instruction file
  (`CLAUDE.md` just `@`-includes it). Durable agent notes go in `.claude/agent-memory/`
  (checked in), not in per-user memory directories.

---

## 10. Dead code and leftovers from the parent project

Several files were copied from a larger Repliers application and are not used here. Knowing
this saves time when grepping:

| Path | Status |
|---|---|
| `utils/tokens.ts` | Unused. Imports `randomUUID` from Node `crypto` with no browser polyfill; importing it would break the bundle. `js-cookie` and `jwt-decode` are only referenced here. The API key is a plain header, never JWT-decoded. |
| `constants/storage.ts` | Seven storage keys; only `tokenKey` is referenced, and only by `tokens.ts`. No localStorage/sessionStorage/cookies are used anywhere. |
| `constants/search.ts` | Only `defaultResultsPerPage` is referenced (by an unused helper). `defaultClusterPrecision=12` / `defaultClusterLimit=200` **contradict** the real defaults (`10` / `100`) in `ParamsFormProvider/defaults.ts`. |
| `constants/map.ts` | `defaultPolygon` (Toronto), `proximitySearch*`, `*Zoom` constants unused. |
| `utils/map.ts` | Roughly half is unused: `getCoords`, `getZoom`, `setMapUrl`, `calcZoomLevel`, `calcBoundsAtZoom`, `addPolygon`/`removePolygon`, `updateMapboxPosition`, `getStatic*`. |
| `utils/geo.ts`, `utils/validators.ts` | Referenced only by their own tests. |
| `components/Autosuggest/` | Empty stub. |
| `Map/components/SearchField/components/OptionGroup.tsx` | Never called (no `groupBy`); the `listing`/`address`/`loader` option types come from another app. |
| `services/Search/params.ts:getPageParams`, `getDefaultRectangle` | Unused. |
| `services/API/types.ts` | Header: "THIS FILE SHOULD NOT EXIST AT ALL". Large type dump including Mapbox autosuggest types nothing uses. |
| `AiTextSection` | Commented out of the panel. |
| `MapOptionsProvider.destroyMap`, `editMode='highlight'` | Never used. |

---

## 11. Sharp edges worth a second look

Not bugs the user will hit every day, but easy to trip over when changing nearby code:

- **Abort/loading race** in every provider's `search`: `setLoading(true)` runs, *then* the
  previous request is aborted. The aborted call's `finally` later sets `loading=false` and
  `abortController.current = null` while the new request is still in flight, so a third
  request cannot abort the second.
- `useDeepCompareEffect` mutates a ref during render and is `JSON.stringify` based: functions
  and `undefined` in deps are invisible, and key order matters.
- `setMapContainerRef(mapContainerRef)` is called in the render body of `Map.tsx`, not in an
  effect.
- `Chat.tsx` "Apply Filters" writes `unknowns` unconditionally, so applying a filter set with
  no unknowns also clears any previously typed unknown params.
- `formatBytes` uses base 1000 and lowercase `mB`/`gB` labels.
- Heights are hardcoded `calc(100vh - 89px)` in `PageContent` but `calc(100svh - 112px)` in
  the tab bodies.
