# Copilot Coding Agent Instructions — Repliers Developer Playground

## Project Overview

This is **Repliers Developer Playground**, a React + TypeScript single-page application built with Vite. It provides an interactive UI for exploring and testing the [Repliers real estate API](https://docs.repliers.io/). The app includes property search, map visualization (Mapbox), listing details, statistics/charts, and an AI chat interface.

Hosted version: <https://playgrounds.repliers.com/>

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript 5.6.x |
| Build Tool | Vite 6 (with SWC plugin for React) |
| UI Library | Material-UI (MUI) v6 + Emotion CSS-in-JS |
| Forms | react-hook-form + Joi validation |
| Maps | Mapbox GL JS + @mapbox/mapbox-gl-draw + Turf.js |
| Charts | Recharts + MUI X Charts |
| State Management | React Context + custom hooks (no Redux) |
| Linting | ESLint 8 (Airbnb-based config) + Prettier |
| Testing | Jest 29 + ts-jest (see known issues below) |
| Node Version | v22.x (see `.nvmrc`) |
| Package Manager | npm |

## Getting Started

```bash
npm install
npm run dev        # Start dev server on port 3003
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3003, opens browser) |
| `npm run build` | Production build |
| `npm run build:github` | Build for GitHub Pages deployment |
| `npm run preview` | Preview GitHub Pages build locally |
| `npm run eslint` | Run ESLint on all TS/TSX/JS files |
| `npm run eslint:fix` | Auto-fix ESLint issues |
| `npm run prettier` | Check Prettier formatting |
| `npm run prettier:fix` | Auto-fix Prettier formatting |
| `npm run clean` | Remove `dist/` directory |

## Environment Variables

The app uses Vite's `import.meta.env` with the `VITE_` prefix. Create a `.env` file in the project root:

| Variable | Description |
|----------|-------------|
| `VITE_REPLIERS_API_KEY` | Repliers API key (get at https://login.repliers.com/) |
| `VITE_REPLIERS_API_URL` | Repliers API base URL (default: `https://api.repliers.io`) |
| `VITE_MAPBOX_KEY` | Mapbox GL API key (get at https://mapbox.com/) |
| `VITE_GTM_KEY` | Google Tag Manager key (optional, production only) |

## Project Structure

```
src/
├── main.tsx                 # App entry point with ErrorBoundary
├── App.tsx                  # Root component with provider tree
├── utils.ts                 # URL param parsing helpers
├── components/              # UI components
│   ├── PageContent.tsx      # Main layout
│   ├── ContentPanel.tsx     # Content area wrapper
│   ├── Autosuggest/         # Location autocomplete
│   ├── Chat/                # AI chat interface
│   ├── Listing/             # Property detail view
│   ├── Map/                 # Mapbox map integration
│   ├── ParamsPanel/         # Search parameters sidebar
│   ├── ResponsePanel/       # API response JSON viewer
│   ├── Statistics/          # Charts and data visualization
│   └── ProTip/              # Tip display component
├── providers/               # React Context providers
│   ├── SearchProvider/      # Search state & API calls to listings
│   ├── ChatProvider/        # Chat state & NLP API calls
│   ├── ListingProvider/     # Selected listing details
│   ├── LocationsProvider/   # Cities, neighborhoods, areas
│   ├── ParamsFormProvider/  # Form state (react-hook-form + Joi)
│   ├── MapOptionsProvider.tsx
│   └── SelectOptionsProvider.tsx
├── services/                # API types and service utilities
│   ├── API/types.ts         # Repliers API type definitions
│   ├── Map/                 # Map service logic
│   └── Search/              # Search params and utilities
├── hooks/                   # Custom React hooks
│   ├── useDeepCompareEffect.ts
│   └── useIntersectionObserver.ts
├── constants/               # Application configuration
│   ├── colors.ts            # Color palette
│   ├── common.ts            # Site name, URL
│   ├── form.ts              # Form defaults
│   ├── i18n.ts              # Internationalization
│   ├── map.ts               # Mapbox config
│   ├── map-styles.ts        # Mapbox layer styles
│   ├── params-presets.ts    # Search filter presets
│   ├── search.ts            # Search defaults
│   ├── stat-presets.ts      # Statistics presets
│   └── storage.ts           # Cookie/localStorage key names
├── styles/                  # MUI theme configuration
│   ├── theme.ts             # Theme entry point
│   └── theme/               # palette, typography, breakpoints, etc.
├── utils/                   # Utility functions (with tests)
│   ├── api.ts               # apiFetch() — generic HTTP client
│   ├── dom.ts               # DOM helpers
│   ├── formatters.ts        # Number/price formatting
│   ├── geo.ts               # Geolocation utilities
│   ├── map.ts               # Map data helpers
│   ├── numbers.ts           # Numeric utilities
│   ├── path.ts              # Object path traversal
│   ├── strings.ts           # String manipulation
│   ├── tokens.ts            # JWT/cookie token management
│   ├── validators.ts        # Input validation
│   └── theme.ts             # Theme helper utilities
└── assets/
    └── icons/               # SVG icons (loaded via vite-plugin-svgr)
```

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

### Path Aliases

Both `tsconfig.json` (via `baseUrl: "./src/"`) and `vite.config.ts` (via `resolve.alias`) define path aliases. Use bare imports for these directories:

```typescript
import SomeComponent from 'components/SomeComponent'
import { apiFetch } from 'utils/api'
import { colors } from 'constants/colors'
```

Available aliases: `components`, `constants`, `providers`, `services`, `styles`, `assets`, `hooks`, `utils`.

## Code Style & Conventions

### Formatting (Prettier)

- Single quotes, no semicolons, 2-space indent, trailing commas: none
- Print width: 80
- Arrow parens: always
- LF line endings

### Linting (ESLint)

- Based on Airbnb config with TypeScript extensions
- `simple-import-sort` plugin enforces import ordering: React first, then external packages, then internal aliases, then relative imports
- `console.log` is forbidden (`no-console` error); use `console.error` only
- `@typescript-eslint/consistent-type-imports` requires inline type imports: `import { type Foo } from 'bar'`
- `@typescript-eslint/no-explicit-any` is a warning (not error)
- `@typescript-eslint/no-unused-vars` is an error

### Component Conventions

- **Function components only** (arrow functions or function declarations)
- Components are colocated in directories with barrel `index.ts` exports
- Presentational components consume context via custom hooks (e.g., `useSearch()`, `useParamsForm()`)
- Config-driven rendering (e.g., Listing uses `config.ts` to define section order)

### TypeScript

- Strict mode enabled
- Use `type` keyword for type-only imports: `import { type MyType } from '...'`
- Avoid `any` where possible; use `unknown` or specific types
- Target: ESNext, Module: ESNext, Module resolution: bundler

## Testing

### Current State

Test files exist in `src/utils/` using Jest:
- `formatters.test.ts`, `geo.test.ts`, `numbers.test.ts`, `path.test.ts`, `strings.test.ts`, `validators.test.ts`

### Known Issue: Jest Is Not Configured

**Jest does not have a config file** (`jest.config.js` / `jest.config.ts` is missing), and there is no `test` script in `package.json`. Running `npx jest` fails because Jest cannot parse TypeScript ES module imports without a transformer configured.

The error is:
```
SyntaxError: Cannot use import statement outside a module
```

**Workaround**: To run existing tests, create a temporary `jest.config.ts` that configures `ts-jest`:

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^constants/(.*)$': '<rootDir>/src/constants/$1',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  roots: ['<rootDir>/src'],
}
```

Then run: `npx jest`

**Note**: The test files are well-structured and follow a `describe('module/name', () => { it('should ...') })` pattern. When adding new utility tests, follow this same pattern and colocate test files next to their source files with a `.test.ts` suffix.

## CI / Workflows

There are no custom CI workflow files in the repository (no `.github/workflows/` directory). The following dynamic/managed workflows are active on GitHub:

- **Copilot code review** — Automated PR review
- **Copilot coding agent** — Agent-based coding
- **CodeQL** — Security scanning

Since there are no build/test CI checks, validate changes locally using:
1. `npm run eslint` — Must pass with zero errors (warnings are acceptable)
2. `npm run build` — Must complete successfully
3. `npm run prettier` — Must pass (checks formatting)

## Build Notes

- The production build produces a single large JS chunk (>3 MB). This triggers a Vite warning about chunk size but is not a build failure.
- The `build:github` mode sets `base: '/gh-api-tool/'` for GitHub Pages.
- SVG files in `src/assets/icons/` are imported as React components via `vite-plugin-svgr`.

## Common Tasks

### Adding a New Utility Function

1. Add the function to the appropriate file in `src/utils/`
2. Add a colocated `.test.ts` file with Jest tests (follow existing patterns)
3. Run `npm run eslint` to verify no lint errors

### Adding a New Component

1. Create a directory under `src/components/` with the component file and an `index.ts` barrel export
2. Use MUI components for UI elements and Emotion for custom styling
3. Consume state from context providers via their custom hooks
4. Import using path aliases: `import Foo from 'components/Foo'`

### Adding a New Provider

1. Create a directory under `src/providers/` with the provider, types, and `index.ts`
2. Export a custom hook for consumers (e.g., `useMyContext()`)
3. Add the provider to the tree in `App.tsx` (order matters for dependencies)

### Modifying Search Parameters

1. Update the Joi schema in `src/providers/ParamsFormProvider/schema.ts`
2. Update defaults in `src/providers/ParamsFormProvider/defaults.ts`
3. Add UI controls in `src/components/ParamsPanel/`
