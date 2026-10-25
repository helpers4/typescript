/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { ViteUserConfig } from 'vitest/config';

/** Options of {@link vitestConfig}. */
export interface VitestConfigOptions {
  /** Minimum coverage, in percent, for branches, functions, lines and statements. Default: `100`. */
  coverage?: number;
  /** Test files. Default: `['src/**\/*.{test,spec}.ts']`. */
  include?: string[];
  /** Files measured by coverage. Default: `['src/**\/*.ts']`. */
  coverageInclude?: string[];
  /** Files left out of coverage. Default: test, spec, bench and example files, and `index.ts`. */
  coverageExclude?: string[];
  /** Test environment. Default: `'node'`. */
  environment?: string;
}

/**
 * Build the Vitest configuration shared by helpers4 projects: v8 coverage with a threshold on
 * every metric, and reporters for the terminal, CI summaries and Codecov.
 *
 * File lists are options rather than something to merge afterwards: `mergeConfig` concatenates
 * arrays, so it could add test files but never replace the defaults.
 * @param options - The options
 * @returns The Vitest configuration, to export as is or to pass to `mergeConfig`
 */
export function vitestConfig(options: VitestConfigOptions = {}): ViteUserConfig {
  const threshold = options.coverage ?? 100;
  return {
    test: {
      coverage: {
        exclude: options.coverageExclude ?? ['**/*.{test,spec,bench,example}.ts', '**/index.ts'],
        include: options.coverageInclude ?? ['src/**/*.ts'],
        provider: 'v8',
        reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
        thresholds: {
          branches: threshold,
          functions: threshold,
          lines: threshold,
          statements: threshold
        }
      },
      environment: options.environment ?? 'node',
      include: options.include ?? ['src/**/*.{test,spec}.ts']
    }
  };
}
