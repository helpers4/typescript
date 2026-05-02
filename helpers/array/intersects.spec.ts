/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { intersects } from './intersects';

describe('intersects — property-based', () => {
  it('intersects(a, a) is true if a.length > 0', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (a) => {
        expect(intersects(a, a)).toBe(true);
      }),
    );
  });

  it('intersects(a, []) is false for any a', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(intersects(a, [])).toBe(false);
      }),
    );
  });

  it('symmetric: intersects(a, b) === intersects(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(intersects(a, b)).toBe(intersects(b, a));
      }),
    );
  });
});

describe('intersects — contract', () => {
  it('empty arrays have nothing in common', () => {
    expect(intersects([], [])).toBe(false);
  });

  it('[1] vs [2] returns false', () => {
    expect(intersects([1], [2])).toBe(false);
  });

  it('[1] vs [1] returns true', () => {
    expect(intersects([1], [1])).toBe(true);
  });

  it('one common element among many', () => {
    expect(intersects([1, 2, 3], [4, 5, 3])).toBe(true);
  });

  it('completely disjoint arrays return false', () => {
    expect(intersects([1, 2], [3, 4])).toBe(false);
  });
});
