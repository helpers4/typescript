/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defineConfig, mergeConfig } from 'vitest/config';
import { vitestConfig } from './presets/vitest';

export default mergeConfig(
  vitestConfig({
    coverage: 100,
    // `scripts/**` isn't held to the helpers/ 100%-coverage bar (see scripts/**/*.test.ts
    // below) — excluded explicitly because `helpers/**/*.ts` isn't root-anchored and also
    // matches scripts/publish/helpers/*.ts (a coincidentally-named subdirectory), which only
    // started showing up in the coverage report once a test first imported those files.
    coverageExclude: ['helpers/**/*.{test,spec,bench,example,model}.ts', 'helpers/**/index.ts', 'scripts/**'],
    coverageInclude: ['helpers/**/*.ts'],
    environment: 'happy-dom',
    include: ['helpers/**/*.{test,spec}.ts', 'scripts/**/*.test.ts', 'presets/**/*.test.ts']
  }),
  defineConfig({
    test: {
      benchmark: {
        exclude: ['**/.stryker-tmp/**'],
        include: ['helpers/**/*.bench.ts']
      }
    }
  })
);
