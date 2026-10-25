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
  describe('extended', () => {
    const glob = (pattern: string, text: string, caseSensitive = true) =>
      globToRegExp(pattern, { extended: true, caseSensitive }).test(text);

    it('keeps * and ? inside one path segment', () => {
      expect(glob('src/*.ts', 'src/a.ts')).toBe(true);
      expect(glob('src/*.ts', 'src/ui/a.ts')).toBe(false);
      expect(glob('a?c', 'abc')).toBe(true);
      expect(glob('a?c', 'a/c')).toBe(false);
    });

    it('lets ** cross segments, and match no directory before a slash', () => {
      expect(glob('src/**', 'src/ui/deep/a.ts')).toBe(true);
      expect(glob('src/**/*.ts', 'src/a.ts')).toBe(true);
      expect(glob('src/**/*.ts', 'src/ui/deep/a.ts')).toBe(true);
      expect(glob('**/a.ts', 'a.ts')).toBe(true);
      expect(glob('**/a.ts', 'x/y/a.ts')).toBe(true);
      expect(glob('src/**/*.ts', 'lib/a.ts')).toBe(false);
    });

    it('treats ** glued to a name as a plain wildcard', () => {
      expect(glob('a**', 'a/b/c')).toBe(true);
      expect(glob('x**/y', 'x/z/y')).toBe(true);
    });

    it('expands braces, nested ones included', () => {
      expect(glob('*.{ts,tsx}', 'a.tsx')).toBe(true);
      expect(glob('*.{ts,tsx}', 'a.js')).toBe(false);
      expect(glob('{a,b{c,d}}x', 'bdx')).toBe(true);
      expect(glob('{a,b{c,d}}x', 'bx')).toBe(false);
      expect(glob('{,a}b', 'b')).toBe(true);
    });

    it('reads a brace without a comma, or unclosed, literally', () => {
      expect(glob('{a}', '{a}')).toBe(true);
      expect(glob('{a', '{a')).toBe(true);
      expect(glob('a}', 'a}')).toBe(true);
      expect(glob('a,b', 'a,b')).toBe(true);
    });

    it('supports character classes, ranges and negation', () => {
      expect(glob('file[0-9].txt', 'file7.txt')).toBe(true);
      expect(glob('file[0-9].txt', 'filex.txt')).toBe(false);
      expect(glob('[abc]', 'b')).toBe(true);
      expect(glob('[!abc]', 'd')).toBe(true);
      expect(glob('[^abc]', 'a')).toBe(false);
      expect(glob('[!a]', '/')).toBe(false);
      expect(glob('[]]', ']')).toBe(true);
      expect(glob('[a\\]b]', ']')).toBe(true);
      expect(glob('[a[b]', '[')).toBe(true);
      expect(glob('[a^]', '^')).toBe(true);
    });

    it('reads an unclosed or out-of-order class literally', () => {
      expect(glob('[abc', '[abc')).toBe(true);
      expect(glob('[z-a]', '[z-a]')).toBe(true);
      expect(glob('a[', 'a[')).toBe(true);
      expect(glob('[', '[')).toBe(true);
    });

    it('escapes with a backslash', () => {
      expect(glob('a\\*b', 'a*b')).toBe(true);
      expect(glob('a\\*b', 'axb')).toBe(false);
      expect(glob('a\\{b,c}', 'a{b,c}')).toBe(true);
      expect(glob('trailing\\', 'trailing\\')).toBe(true);
      expect(glob('[a\\', '[a\\')).toBe(true);
    });

    it('honours caseSensitive, and a boolean still works', () => {
      expect(glob('SRC/*.TS', 'src/a.ts', false)).toBe(true);
      expect(glob('SRC/*.TS', 'src/a.ts')).toBe(false);
      expect(globToRegExp('A*', false).test('abc')).toBe(true);
      expect(globToRegExp('a*', {}).test('abc')).toBe(true);
    });
  });
});
