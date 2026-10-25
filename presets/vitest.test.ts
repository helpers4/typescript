/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { vitestConfig } from './vitest';

describe('vitestConfig', () => {
  it('defaults to src/, node and a 100% threshold on every metric', () => {
    const { test } = vitestConfig();
    expect(test?.include).toEqual(['src/**/*.{test,spec}.ts']);
    expect(test?.environment).toBe('node');
    expect(test?.coverage).toMatchObject({
      include: ['src/**/*.ts'],
      provider: 'v8',
      thresholds: { branches: 100, functions: 100, lines: 100, statements: 100 }
    });
  });

  it('replaces the file lists and the threshold instead of adding to them', () => {
    const { test } = vitestConfig({
      coverage: 80,
      coverageExclude: ['lib/**/*.test.ts'],
      coverageInclude: ['lib/**/*.ts'],
      environment: 'happy-dom',
      include: ['lib/**/*.test.ts']
    });
    expect(test?.include).toEqual(['lib/**/*.test.ts']);
    expect(test?.environment).toBe('happy-dom');
    expect(test?.coverage).toMatchObject({
      exclude: ['lib/**/*.test.ts'],
      include: ['lib/**/*.ts'],
      thresholds: { branches: 80, functions: 80, lines: 80, statements: 80 }
    });
  });
});
