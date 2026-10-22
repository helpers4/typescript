/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parse } from './parse';

describe('parse', () => {
  it('parses strict JSON', () => {
    expect(parse('{"a":[1,2],"b":"x"}')).toEqual({ a: [1, 2], b: 'x' });
  });

  it('parses line and block comments', () => {
    expect(parse('{\n  // line\n  "a": /* block */ 1\n}')).toEqual({ a: 1 });
  });

  it('parses trailing commas in objects and arrays', () => {
    expect(parse('{"a":[1,2,],}')).toEqual({ a: [1, 2] });
  });

  it('keeps comment-like text inside strings', () => {
    expect(parse('{"url":"http://x/*y*/"} // c')).toEqual({ url: 'http://x/*y*/' });
  });

  it('ignores a leading byte order mark', () => {
    expect(parse('\ufeff{"a":1}')).toEqual({ a: 1 });
    expect(parse('\ufeff{"a":1,}')).toEqual({ a: 1 });
  });

  it.each([
    ["{'a':1}", { a: 1 }, 'single quotes'],
    ['{a:1, $b:2, _c:3}', { a: 1, $b: 2, _c: 3 }, 'unquoted keys'],
    ['0x1F', 31, 'hexadecimal'],
    ['[+1, .5, 5., -Infinity]', [1, 0.5, 5, -Infinity], 'JSON5 numbers'],
    ["'line \\\ncontinued'", 'line continued', 'line continuation'],
  ] as [string, unknown, string][])('parses JSON5: %j (%s)', (text, expected) => {
    expect(parse(text)).toEqual(expected);
  });

  it('parses NaN', () => {
    expect(parse('NaN')).toBeNaN();
  });

  it.each([
    ['[1,,]', 'two trailing commas'],
    ['01', 'leading zero'],
    ['{ my-key: 1 }', 'key that is not an identifier'],
    ['"a\nb"', 'raw line break in a string'],
    ['/* unterminated', 'unterminated comment'],
    ['undefined', 'undefined'],
    ['1 2', 'two values'],
    ['', 'empty text'],
    ['// only a comment', 'no value'],
  ])('throws a SyntaxError on %j (%s)', (text) => {
    expect(() => parse(text)).toThrow(SyntaxError);
  });

  it('names the line and column of the problem', () => {
    expect(() => parse('{\n  // comment\n  a: ?\n}')).toThrow('parse: unexpected character "?" at line 3, column 6');
  });

});
