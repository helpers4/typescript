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
      exclude: ['helpers/**/*.{test,spec,bench,example}.ts', 'helpers/**/index.ts'],
      include: ['helpers/**/*.ts'],
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts']
  }
});
