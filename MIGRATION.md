# Webpack to Vite Migration

This project has been migrated from Webpack to Vite. Here's what changed:

## Key Changes

1. **Build Tool**: Replaced Webpack with Vite for faster development and builds
2. **Configuration**: Replaced webpack.\*.js files with vite.config.ts
3. **HTML Template**: Moved from src/index.html.tmpl to index.html in root
4. **Scripts**: Updated package.json scripts to use Vite commands
5. **Dependencies**: Removed Webpack-related dependencies, added Vite dependencies

## New Commands

- `yarn dev` - Start development server (replaces `yarn watch`)
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally
- `yarn test` - Run tests (unchanged)

## Files to Remove

After confirming everything works, you can safely delete these files:

- webpack.common.js
- webpack.dev.js
- webpack.prod.js
- babel.config.js (if not needed for tests)
- src/index.html.tmpl

## Environment Variables

The same environment variable logic is preserved:

- `BASENAME` is set based on `TRAVIS_BRANCH`
- `VERSION` is set to "now"
- `process.env.NODE_ENV` is set appropriately

## Module Resolution

The alias `ctrack_config` is preserved and works the same way, pointing to:

- `src/config/config.dev.js` in development
- `src/config/config.prod.js` in production
- `src/config/config.jest.js` in tests

## Testing

Jest configuration has been updated to work with the new setup while maintaining the same test functionality.
