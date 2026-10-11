/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parseStrict } from './parseStrict';

describe('parseStrict', () => {
  it.each([
    ['{"a":1}', { a: 1 }],
    ['[1,"two",true,null]', [1, 'two', true, null]],
    ['  "text"  ', 'text'],
    ['42', 42],
    ['null', null],
  ])('parses %j', (text, expected) => {
    expect(parseStrict(text)).toEqual(expected);
  });

  it.each([
    ['{"a":1,}', 'trailing comma'],
    ['{"a":1} // note', 'line comment'],
    ['/* c */ 1', 'block comment'],
    ["{'a':1}", 'single quotes'],
    ['{a:1}', 'unquoted key'],
    ['0x1F', 'hexadecimal'],
    ['NaN', 'NaN'],
    ['\ufeff{}', 'byte order mark'],
    ['', 'empty text'],
  ])('throws a SyntaxError on %j (%s)', (text) => {
    expect(() => parseStrict(text)).toThrow(SyntaxError);
  });
});
