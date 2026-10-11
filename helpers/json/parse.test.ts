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
    ["{'a':1}", 'single quotes'],
    ['{a:1}', 'unquoted key'],
    ['0x1F', 'hexadecimal'],
    ['NaN', 'NaN'],
    ['[1,,]', 'two trailing commas'],
    ['', 'empty text'],
    ['// only a comment', 'no value'],
  ])('throws a SyntaxError on %j (%s)', (text) => {
    expect(() => parse(text)).toThrow(SyntaxError);
  });

  it('reports the error from reading the text as JSONC', () => {
    expect(() => parse('{\n  // comment\n  "a": ?\n}')).toThrow(/'\?'/);
  });
});
