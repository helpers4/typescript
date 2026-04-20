/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const hasDashboardKey = Boolean(process.env.STRYKER_DASHBOARD_API_KEY);

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  tsconfigFile: 'tsconfig.json',
  plugins: [
    '@stryker-mutator/vitest-runner',
  ],
  // Pass --harmony-temporal to Stryker's child test-runner processes so that
  // Temporal API is available (Node.js 24 requires this flag). Worker threads
  // spawned by vitest inside those processes inherit the flag automatically.
  // vitest.config.ts detects this and skips passing it again via execArgv
  // (ERR_WORKER_INVALID_EXEC_ARGV in Node.js 24).
  testRunnerNodeArgs: ['--harmony-temporal'],
  mutate: [
    'helpers/**/!(*.test|*.spec|*.bench|*.example|index).ts',
  ],
  reporters: ['clear-text', 'html', 'json', 'progress', ...(hasDashboardKey ? ['dashboard'] : [])],
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
