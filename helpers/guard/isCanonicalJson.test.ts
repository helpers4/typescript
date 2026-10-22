/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isCanonicalJson } from './isCanonicalJson';

describe('isCanonicalJson', () => {
  it.each(['{"a":1,"b":[true]}', '1', '"text"', '[]', '{}', 'null'])('is true for %j', (value) => {
    expect(isCanonicalJson(value)).toBe(true);
  });

  it.each([
    ['{"b":1,"a":2}', 'unsorted keys'],
    ['{"a": 1}', 'whitespace'],
    ['1.0', 'non-shortest number'],
    ['1E2', 'exponent form'],
    ['{"a":1,"a":1}', 'duplicate keys'],
    ['12345678901234567890', 'number beyond double precision'],
    ['"\\ud800"', 'lone surrogate'],
    ['"\\u0041"', 'unneeded escape'],
    ['not json', 'invalid JSON'],
  ])('is false for %j (%s)', (value) => {
    expect(isCanonicalJson(value)).toBe(false);
  });

  it.each([42, null, undefined, { a: 1 }])('is false for the non-string %j', (value) => {
    expect(isCanonicalJson(value)).toBe(false);
  });
});
