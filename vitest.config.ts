/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    // Benchmarks import `@helpers4/<category>`, which resolves to the built package (`pnpm build`)
    // rather than to the sources: Vite's module runner wraps every source export in a getter, and
    // calls between source modules go through those getters, which dominates the time of
    // nanosecond helpers. The built bundle is also what users run.
    alias: [{ find: /^@helpers4\/([a-z0-9-]+)$/, replacement: `${import.meta.dirname}/build/$1/lib/index.js` }]
  },
  test: {
    benchmark: {
      exclude: ['**/.stryker-tmp/**'],
      include: ['helpers/**/*.bench.ts']
    },
    coverage: {
      // `scripts/**` isn't held to the helpers/ 100%-coverage bar (see scripts/**/*.test.ts
      // below) — excluded explicitly because `helpers/**/*.ts` isn't root-anchored and also
      // matches scripts/publish/helpers/*.ts (a coincidentally-named subdirectory), which only
      // started showing up in the coverage report once a test first imported those files.
      exclude: ['helpers/**/*.{test,spec,bench,example,model}.ts', 'helpers/**/index.ts', 'scripts/**'],
      include: ['helpers/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    // The built packages run as plain Node.js ESM (see `resolve.alias`), not through Vite's module runner.
    server: { deps: { external: [/\/build\//, /\/scripts\/bench\//] } },
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts', 'scripts/**/*.test.ts']
  }
});
