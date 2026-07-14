/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { symmetricDifference } from './symmetricDifference';

describe('symmetricDifference', () => {
  it('returns items unique to either array', () => {
    expect(symmetricDifference([1, 2, 3], [2, 3, 4])).toEqual([1, 4]);
  });

  it('returns an empty array when both arrays are identical', () => {
    expect(symmetricDifference([1, 2, 3], [1, 2, 3])).toEqual([]);
  });

  it('returns the concatenation when arrays share nothing', () => {
    expect(symmetricDifference([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('treats null as an empty array', () => {
    expect(symmetricDifference(null, [1, 2])).toEqual([1, 2]);
    expect(symmetricDifference([1, 2], null)).toEqual([1, 2]);
  });

  it('treats undefined as an empty array', () => {
    expect(symmetricDifference(undefined, [1, 2])).toEqual([1, 2]);
    expect(symmetricDifference([1, 2], undefined)).toEqual([1, 2]);
  });

  it('returns an empty array when both inputs are null/undefined', () => {
    expect(symmetricDifference(null, undefined)).toEqual([]);
  });

  it('works with strings', () => {
    expect(symmetricDifference(['a', 'b'], ['b', 'c'])).toEqual(['a', 'c']);
  });

  it('preserves duplicate values within the same array, matching difference() behavior', () => {
    expect(symmetricDifference([1, 1, 2], [2])).toEqual([1, 1]);
  });
});
