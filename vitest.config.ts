/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      include: ['helpers/**/*.ts'],
      exclude: ['helpers/**/*.{test,spec,bench,example}.ts', 'helpers/**/index.ts'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    },
    benchmark: {
      include: ['helpers/**/*.bench.ts'],
      exclude: ['**/.stryker-tmp/**']
    }
  }
});
