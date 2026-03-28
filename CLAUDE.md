# CLAUDE.md

## Project Overview

cattrack-client-react — React-based client for the cattrack app. Built with TypeScript, React 19, Vite, and Bootstrap 5.

## Environment Setup

- **Package manager**: Yarn (do NOT use npm)
- **Node**: >=20.0.0

## Common Commands

- `yarn install` — Install dependencies
- `yarn dev` — Start dev server (port 8080)
- `yarn build` — Production build (output: dist/)
- `yarn test` — Run tests (Vitest)
- `yarn test:watch` — Run tests in watch mode
- `yarn test:coverage` — Run tests with coverage

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build**: Vite 7
- **Testing**: Vitest + React Testing Library + jsdom
- **Styling**: Bootstrap 5 via react-bootstrap
- **Routing**: react-router-dom v7
- **Data fetching**: axios + @tanstack/react-query
- **Forms**: react-hook-form
- **Charts**: plotly.js-basic-dist
- **Linting**: ESLint 9 (flat config) + typescript-eslint
- **Formatting**: Prettier with import sorting (@trivago/prettier-plugin-sort-imports)

## Project Structure

- `src/` — Application source
  - `components/` — React components (with `__tests__/` subdirectories)
  - `services/` — API/service layer (auth only)
  - `hooks/` — Custom React hooks (API integration via react-query, context providers)
  - `client/` — API client utilities (`checkStatusAxios`, error parsing)
  - `config/` — Environment configs (dev/prod/jest)
  - `data/` — TypeScript interfaces (pure types, no runtime code)
  - `styles/` — CSS/styling
  - `utils/` — Utility functions
- `utils/` — Test utilities (test setup)
- `vite.config.ts` — Vite + Vitest configuration
- `src/RenderWithProviders.tsx` — Test helper wrapping components with providers + axios-mock-adapter

## Config Aliases

- `ctrack_config` resolves to `src/config/config.dev.js` (dev), `src/config/config.prod.js` (build), or `src/config/config.jest.js` (test)

## Coding Conventions

### Components
- Functional components with TypeScript, named exports (not default)
- Props defined as exported interfaces (e.g., `export interface FooProps { ... }`)
- react-bootstrap for all UI (no Material-UI, Chakra, etc.)
- Native `<input type="date">` for date pickers (no date picker library)
- Loading states return `null` (conditional rendering, not spinners)
- Forms use `react-hook-form` with `useForm<T>()`

### Hooks
- API fetching hooks use `useAxios()` + `checkStatusAxios()` + `useQuery()` from react-query
- Mutation-style hooks (POST/PUT) return plain async functions (not `useMutation`) — see `useUpdateAccounts.ts` as the pattern

### Data Types
- Defined in `src/data/` as pure TypeScript interfaces, no tests needed

### Tests
- Located in `__tests__/` directories, named `Test*.tsx`
- Use `renderWithProviders()` from `src/RenderWithProviders.tsx` for components needing context
- Mocking: `axios-mock-adapter` configured via callback to `renderWithProviders`
- Interactions: `userEvent.setup()` + `await user.click/type/etc.`
- Async assertions: wrap in `waitFor(() => { expect(...) })`
- Date inputs in jsdom: use `fireEvent.change` (not `userEvent.type`)

### Routing
- Routes defined in `src/components/App.tsx` using react-router-dom v7
- Protected routes use `<RequireAuth redirectTo="/login">` wrapper
- Navigation in `src/components/NavComponent.tsx` (react-bootstrap Navbar)
- Remote branch is `origin/master` (not main)
