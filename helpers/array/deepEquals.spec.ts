/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { deepEquals } from './deepEquals';

describe('deepEquals — property-based', () => {
  it('reflexive: deepEquals(a, a) is always true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(deepEquals(arr, arr)).toBe(true);
      }),
    );
  });

  it('symmetric: deepEquals(a, b) === deepEquals(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(deepEquals(a, b)).toBe(deepEquals(b, a));
      }),
    );
  });

  it('equal arrays return true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(deepEquals([...arr], [...arr])).toBe(true);
      }),
    );
  });
});

describe('deepEquals — contract', () => {
  it('two empty arrays are equal', () => {
    expect(deepEquals([], [])).toBe(true);
  });

  it('nested arrays with same structure are equal', () => {
    expect(deepEquals([[1, 2], [3, 4]], [[1, 2], [3, 4]])).toBe(true);
  });

  it('different order returns false', () => {
    expect(deepEquals([1, 2], [2, 1])).toBe(false);
  });

  it('same reference is equal', () => {
    const arr = [1, [2, 3]];
    expect(deepEquals(arr, arr)).toBe(true);
  });

  it('deeply nested equal arrays', () => {
    expect(deepEquals([[[1]]], [[[1]]])).toBe(true);
  });

  it('deeply nested unequal arrays', () => {
    expect(deepEquals([[[1]]], [[[2]]])).toBe(false);
  });

  it('different lengths are not equal', () => {
    expect(deepEquals([1, 2, 3], [1, 2])).toBe(false);
  });
});
