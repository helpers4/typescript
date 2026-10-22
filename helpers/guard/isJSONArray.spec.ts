/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isJSONArray } from './isJSONArray';

describe('isJSONArray — property-based', () => {
  it('any array from fc.jsonValue() elements is valid', () => {
    fc.assert(
      fc.property(fc.array(fc.jsonValue()), (arr) => {
        expect(isJSONArray(arr)).toBe(true);
      }),
    );
  });
});

describe('isJSONArray — contract', () => {
  it('non-arrays are always false', () => {
    expect(isJSONArray({})).toBe(false);
    expect(isJSONArray(null)).toBe(false);
    expect(isJSONArray('str')).toBe(false);
  });

  it('empty array is valid', () => {
    expect(isJSONArray([])).toBe(true);
  });
});
