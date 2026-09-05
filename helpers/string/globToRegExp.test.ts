/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { globToRegExp } from './globToRegExp';

describe('globToRegExp', () => {
  it('matches a literal pattern with no wildcards', () => {
    expect(globToRegExp('hello.ts').test('hello.ts')).toBe(true);
    expect(globToRegExp('hello.ts').test('hello.txt')).toBe(false);
  });

  it('matches * as any sequence of characters, including none', () => {
    const re = globToRegExp('*.test.ts');
    expect(re.test('helper.test.ts')).toBe(true);
    expect(re.test('.test.ts')).toBe(true);
    expect(re.test('helper.test.js')).toBe(false);
  });

  it('matches ? as exactly one character', () => {
    const re = globToRegExp('report-????.csv');
    expect(re.test('report-2026.csv')).toBe(true);
    expect(re.test('report-26.csv')).toBe(false);
    expect(re.test('report-20267.csv')).toBe(false);
  });

  it('escapes regex metacharacters in the literal parts', () => {
    expect(globToRegExp('a.b(c)*').test('a.b(c)XYZ')).toBe(true);
    expect(globToRegExp('a.b(c)*').test('aXb(c)XYZ')).toBe(false);
  });

  it('is case-sensitive by default', () => {
    expect(globToRegExp('Hello*').test('hello world')).toBe(false);
  });

  it('is case-insensitive when caseSensitive is false', () => {
    expect(globToRegExp('Hello*', false).test('hello world')).toBe(true);
  });

  it('anchors the match to the whole string, not a substring', () => {
    expect(globToRegExp('test').test('a test b')).toBe(false);
  });

  it('matches an empty pattern only against an empty string', () => {
    expect(globToRegExp('').test('')).toBe(true);
    expect(globToRegExp('').test('x')).toBe(false);
  });

  it('"?" matches one UTF-16 code unit, not one Unicode code point', () => {
    // '😀' (U+1F600) is outside the Basic Multilingual Plane, so it's a surrogate pair — two
    // code units. "?" matches only one, so it does not match the whole emoji.
    expect(globToRegExp('?').test('😀')).toBe(false);
    expect(globToRegExp('??').test('😀')).toBe(true);
  });

  it('supports multiple wildcards in one pattern', () => {
    expect(globToRegExp('*-?-*').test('left-x-right')).toBe(true);
    expect(globToRegExp('*-?-*').test('left-xy-right')).toBe(false);
  });
});
