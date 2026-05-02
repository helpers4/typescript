/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { equalsUnordered } from './equalsUnordered';

describe('equalsUnordered — property-based', () => {
  it('reflexive: equalsUnordered(a, a) is always true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equalsUnordered(arr, arr)).toBe(true);
      }),
    );
  });

  it('symmetric: equalsUnordered(a, b) === equalsUnordered(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(equalsUnordered(a, b)).toBe(equalsUnordered(b, a));
      }),
    );
  });

  it('equalsUnordered([], []) is true', () => {
    expect(equalsUnordered([], [])).toBe(true);
  });

  it('equal arrays with same content return true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equalsUnordered([...arr], [...arr])).toBe(true);
      }),
    );
  });
});

describe('equalsUnordered — contract', () => {
  it('[1,2] vs [2,1] returns true (order-independent)', () => {
    expect(equalsUnordered([1, 2], [2, 1])).toBe(true);
  });

  it('[{a:1}] vs [{a:1}] returns true via equalsShallow', () => {
    expect(equalsUnordered([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('[[1,2]] vs [[2,1]] returns true (recursive order-independent check)', () => {
    expect(equalsUnordered([[1, 2]], [[2, 1]])).toBe(true);
  });

  it('different lengths return false', () => {
    expect(equalsUnordered([1, 2, 3], [1, 2])).toBe(false);
  });

  it('empty arrays are equal', () => {
    expect(equalsUnordered([], [])).toBe(true);
  });

  it('arrays with no matching items return false', () => {
    expect(equalsUnordered([1, 2], [3, 4])).toBe(false);
  });

  it('objects compared with equalsShallow: different values return false', () => {
    expect(equalsUnordered([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });
});
