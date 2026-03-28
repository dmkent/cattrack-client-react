# CLAUDE.md

## Project Overview

cattrack-client-react — React-based client for the cattrack app. Built with TypeScript, React 19, Vite, and Bootstrap 5.

## Environment Setup

- **Package manager**: Yarn (do NOT use npm)
- **Conda environment**: Activate with `conda activate yarn-node20` before running commands
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
- **Charts**: plotly.js-basic-dist
- **Linting**: ESLint 9 (flat config) + typescript-eslint
- **Formatting**: Prettier with import sorting (@trivago/prettier-plugin-sort-imports)

## Project Structure

- `src/` — Application source
  - `components/` — React components
  - `services/` — API/service layer
  - `hooks/` — Custom React hooks
  - `client/` — API client code
  - `config/` — Environment configs (dev/prod/jest)
  - `data/` — Data types/models
  - `styles/` — CSS/styling
  - `utils/` — Utility functions
- `utils/` — Test utilities (test setup)
- `vite.config.ts` — Vite + Vitest configuration

## Config Aliases

- `ctrack_config` resolves to `src/config/config.dev.js` (dev), `src/config/config.prod.js` (build), or `src/config/config.jest.js` (test)
