/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

const isCI = Boolean(process.env.CI);

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: 'vitest',
  tsconfigFile: 'tsconfig.json',
  plugins: [
    '@stryker-mutator/vitest-runner',
  ],
  mutate: [
    'helpers/**/!(*.test|*.spec|*.bench|*.example|index).ts',
  ],
  reporters: ['clear-text', 'html', 'progress', ...(isCI ? ['dashboard'] : [])],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  ...(isCI && {
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
