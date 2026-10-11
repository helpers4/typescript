/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isIJson } from './isIJson';

describe('isIJson', () => {
  it.each(['{"id":1,"name":"app"}', '[1.5,-2,true,null]', '"text"', '9007199254740991'])('is true for %j', (value) => {
    expect(isIJson(value)).toBe(true);
  });

  it.each([
    ['{"id":1,"id":2}', 'duplicate key'],
    ['"\\uD800"', 'lone surrogate'],
    ['"\\uFFFF"', 'noncharacter'],
    ['1e400', 'beyond a double'],
    ['0.123456789012345678', 'more than 17 significant digits'],
    ['9007199254740993', 'integer beyond 2^53 - 1'],
    ['{"a":1} // c', 'not strict JSON'],
    ["{a:1}", 'JSON5'],
  ])('is false for %j (%s)', (value) => {
    expect(isIJson(value)).toBe(false);
  });

  it.each([42, null, undefined, { a: 1 }])('is false for the non-string %j', (value) => {
    expect(isIJson(value)).toBe(false);
  });
});
