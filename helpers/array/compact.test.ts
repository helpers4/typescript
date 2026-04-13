/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { compact } from './compact';

describe('compact', () => {
  it('should remove all falsy values', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
  });

  it('should return empty array for all-falsy input', () => {
    expect(compact([0, false, null, undefined, '', NaN])).toEqual([]);
  });

  it('should return same values for all-truthy input', () => {
    expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('should work with strings', () => {
    expect(compact(['a', '', 'b', null, 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('should work with empty array', () => {
    expect(compact([])).toEqual([]);
  });

  it('should preserve object references', () => {
    const obj = { a: 1 };
    expect(compact([null, obj, undefined])).toEqual([obj]);
  });

  it('should keep -1 and other truthy numbers', () => {
    expect(compact([0, -1, 1, NaN, 2])).toEqual([-1, 1, 2]);
  });
});
