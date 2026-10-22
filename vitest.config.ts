/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
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
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts', 'scripts/**/*.test.ts']
  }
});
