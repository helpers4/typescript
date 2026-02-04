/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
      exclude: ['helpers/**/*.{test,spec}.ts', 'helpers/**/*.bench.ts', 'helpers/**/index.ts'],
      // Target: 100% coverage
      // Current thresholds are set to warn but not fail
      // Remove these comments and set all to 100 when ready
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
});
