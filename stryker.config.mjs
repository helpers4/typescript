/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const hasDashboardKey = Boolean(process.env.STRYKER_DASHBOARD_API_KEY);
const isCI = Boolean(process.env.CI);

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  tsconfigFile: 'tsconfig.json',
  plugins: [
    '@stryker-mutator/vitest-runner',
  ],
  // Skip TypeScript type-checking on each mutant: Vitest handles compilation
  // and type errors would only be caught in the initial dry run anyway.
  disableTypeChecks: true,
  // Persist results between runs: only re-test mutants affected by changed
  // files since the last run (use --force to rebuild from scratch).
  incremental: true,
  incrementalFile: 'reports/mutation/incremental.json',
  mutate: [
    'helpers/**/!(*.test|*.spec|*.bench|*.example|index).ts',
  ],
  // In CI, skip the verbose clear-text table but keep progress so the step
  // produces visible output (prevents the step from appearing frozen).
  reporters: [...(isCI ? ['progress'] : ['clear-text', 'progress']), 'html', 'json', ...(hasDashboardKey ? ['dashboard'] : [])],
  // Cap the time allowed per mutant: initialDryRunTime × timeoutFactor + timeoutMS.
  // Prevents a never-resolving Promise mutant from hanging a worker indefinitely.
  timeoutMS: 10000,

  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  jsonReporter: {
    fileName: 'reports/mutation/mutation.json',
  },
  ...(hasDashboardKey && {
    dashboard: {
      project: 'github.com/helpers4/typescript',
      version: process.env.STRYKER_DASHBOARD_VERSION || 'main',
      reportType: 'full',
    },
  }),
  thresholds: {
    break: 60,
    high: 90,
    low: 70,
  },
  tempDirName: '.stryker-tmp',
  cleanTempDir: 'always',
};
