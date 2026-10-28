/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { matchGlob } from './matchGlob';
import { parsePatternOrRegExp } from './parsePatternOrRegExp';

describe('matchGlob', () => {
  it('matches in full with * and ?', () => {
    expect(matchGlob('*.fig', 'design.fig')).toBe(true);
    expect(matchGlob('frame-?', 'frame-1')).toBe(true);
    expect(matchGlob('frame-?', 'frame-12')).toBe(false);
    expect(matchGlob('*.fig', 'design.fig.bak')).toBe(false);
  });

  it('is case-sensitive unless told otherwise', () => {
    expect(matchGlob('screen *', 'Screen 2')).toBe(false);
    expect(matchGlob('screen *', 'Screen 2', { caseInsensitive: true })).toBe(true);
  });

  it('reads path globs when extended', () => {
    expect(matchGlob('src/**/*.ts', 'src/a/b.ts', { extended: true })).toBe(true);
    expect(matchGlob('src/*', 'src/a/b.ts', { extended: true })).toBe(false);
    expect(matchGlob('{a,b}.ts', 'b.ts', { extended: true })).toBe(true);
  });
});

describe('parsePatternOrRegExp', () => {
  it('reads /source/flags as a regular expression with its flags', () => {
    const regexp = parsePatternOrRegExp('/^SF Pro/i');
    expect(regexp.flags).toBe('i');
    expect(regexp.test('sf pro text')).toBe(true);
    expect(parsePatternOrRegExp('/a.c/s').test('a\nc')).toBe(true);
  });

  it('reads anything else as a glob', () => {
    expect(parsePatternOrRegExp('SF Pro*').test('SF Pro Display')).toBe(true);
    expect(parsePatternOrRegExp('SF Pro*').test('xSF Pro')).toBe(false);
    expect(parsePatternOrRegExp('/src/*.ts').test('/src/a.ts')).toBe(true);
  });

  it('applies the glob options, not the regular expression ones', () => {
    expect(parsePatternOrRegExp('sf*', { caseInsensitive: true }).test('SF Pro')).toBe(true);
    expect(parsePatternOrRegExp('/^sf/', { caseInsensitive: true }).test('SF Pro')).toBe(false);
    expect(parsePatternOrRegExp('a/**', { extended: true }).test('a/b/c')).toBe(true);
  });

  it('rejects an invalid regular expression', () => {
    expect(() => parsePatternOrRegExp('/(/')).toThrow(SyntaxError);
    expect(() => parsePatternOrRegExp('/(/')).toThrow(/invalid regular expression/);
  });
});
