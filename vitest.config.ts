/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { defineConfig } from 'vitest/config';

// When running under Stryker, testRunnerNodeArgs injects --harmony-temporal into
// the child process. Worker threads then inherit the V8 flag from the parent,
// so passing it again via execArgv triggers ERR_WORKER_INVALID_EXEC_ARGV in
// Node.js 24. Only set execArgv when the flag is not already present.
const execArgv = process.execArgv.includes('--harmony-temporal')
  ? undefined
  : ['--harmony-temporal'];

export default defineConfig({
  test: {
    benchmark: {
      exclude: ['**/.stryker-tmp/**'],
      include: ['helpers/**/*.bench.ts']
    },
    coverage: {
      exclude: ['helpers/**/*.{test,spec,bench,example,model}.ts', 'helpers/**/index.ts'],
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
    ...(execArgv && { execArgv }),
    include: ['helpers/**/*.{test,spec}.ts']
  }
});
