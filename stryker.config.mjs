/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

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
  reporters: ['clear-text', 'html', 'progress', 'dashboard'],
  htmlReporter: {
    fileName: 'reports/mutation/index.html',
  },
  dashboard: {
    project: 'github.com/helpers4/typescript',
    reportType: 'full',
  },
  thresholds: {
    high: 90,
    low: 70,
    break: 60,
  },
  tempDirName: '.stryker-tmp',
  cleanTempDir: 'always',
};
