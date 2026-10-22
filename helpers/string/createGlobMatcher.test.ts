/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createGlobMatcher } from './createGlobMatcher';

describe('createGlobMatcher', () => {
  it('reads every string as a glob, even /…/flags', () => {
    expect(createGlobMatcher('/usr/lib/img')('/usr/lib/img')).toBe(true);
    expect(createGlobMatcher('/(/')('/(/')).toBe(true);
  });

  it('supports arrays, exclusions and case-insensitivity', () => {
    const isSource = createGlobMatcher(['/src/*.ts', '!*.test.ts']);
    expect(isSource('/src/index.ts')).toBe(true);
    expect(isSource('/src/index.test.ts')).toBe(false);
    expect(createGlobMatcher('*.FIG', { caseSensitive: false })('a.fig')).toBe(true);
  });
});
