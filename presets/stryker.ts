/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { PartialStrykerOptions, ReportType } from '@stryker-mutator/api/core';

/** Options of {@link strykerConfig}. */
export interface StrykerConfigOptions {
  /** Files to mutate. Default: `['src/**\/!(*.test|*.spec|*.bench|*.example|index).ts']`. */
  mutate?: string[];
  /** Stryker Dashboard project (e.g. `github.com/owner/repo`), used when `STRYKER_DASHBOARD_API_KEY` is set. */
  dashboardProject?: string;
}

/**
 * Build the Stryker configuration shared by helpers4 projects: Vitest runner, incremental runs,
 * HTML and JSON reports under `reports/mutation/`, and the dashboard reporter when a key is set.
 * @param options - The options
 * @returns The Stryker configuration
 */
export function strykerConfig(options: StrykerConfigOptions = {}): PartialStrykerOptions {
  const hasDashboardKey = Boolean(process.env.STRYKER_DASHBOARD_API_KEY) && options.dashboardProject !== undefined;
  const isCI = Boolean(process.env.CI);
  return {
    testRunner: 'vitest',
    plugins: ['@stryker-mutator/vitest-runner'],
    // Vitest compiles the mutants: type errors would only show in the initial dry run anyway.
    disableTypeChecks: true,
    incremental: true,
    incrementalFile: 'reports/mutation/incremental.json',
    mutate: options.mutate ?? ['src/**/!(*.test|*.spec|*.bench|*.example|index).ts'],
    // In CI, keep progress so the step shows output, without the long clear-text table.
    reporters: [...(isCI ? ['progress'] : ['clear-text', 'progress']), 'html', 'json', ...(hasDashboardKey ? ['dashboard'] : [])],
    // Cap the time per mutant so a never-resolving Promise cannot hang a worker.
    timeoutMS: 10000,
    htmlReporter: { fileName: 'reports/mutation/index.html' },
    jsonReporter: { fileName: 'reports/mutation/mutation.json' },
    ...(hasDashboardKey && {
      dashboard: {
        project: options.dashboardProject,
        version: process.env.STRYKER_DASHBOARD_VERSION || 'main',
        // ReportType is a const enum: a type-only import keeps @stryker-mutator/api out of the runtime.
        reportType: 'full' as ReportType
      }
    })
  };
}
