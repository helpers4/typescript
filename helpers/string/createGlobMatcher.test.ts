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

describe('createGlobMatcher — prefixes are plain text', () => {
  it('never reads re: or glob: as a prefix, and never throws', () => {
    expect(createGlobMatcher('re:(')('re:(')).toBe(true);
    expect(createGlobMatcher('re:a')('re:a')).toBe(true);
    expect(createGlobMatcher('re:a')('a')).toBe(false);
    expect(createGlobMatcher('glob:x')('glob:x')).toBe(true);
  });
});
