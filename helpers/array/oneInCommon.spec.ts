/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { oneInCommon } from './oneInCommon';

describe('oneInCommon — property-based', () => {
  it('oneInCommon(a, a) is true if a.length > 0', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (a) => {
        expect(oneInCommon(a, a)).toBe(true);
      }),
    );
  });

  it('oneInCommon(a, []) is false for any a', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (a) => {
        expect(oneInCommon(a, [])).toBe(false);
      }),
    );
  });

  it('symmetric: oneInCommon(a, b) === oneInCommon(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(oneInCommon(a, b)).toBe(oneInCommon(b, a));
      }),
    );
  });
});

describe('oneInCommon — contract', () => {
  it('empty arrays have nothing in common', () => {
    expect(oneInCommon([], [])).toBe(false);
  });

  it('[1] vs [2] returns false', () => {
    expect(oneInCommon([1], [2])).toBe(false);
  });

  it('[1] vs [1] returns true', () => {
    expect(oneInCommon([1], [1])).toBe(true);
  });

  it('one common element among many', () => {
    expect(oneInCommon([1, 2, 3], [4, 5, 3])).toBe(true);
  });

  it('completely disjoint arrays return false', () => {
    expect(oneInCommon([1, 2], [3, 4])).toBe(false);
  });
});
