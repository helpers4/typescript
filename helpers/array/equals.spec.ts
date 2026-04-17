/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { equals } from './equals';

describe('equals — property-based', () => {
  it('reflexive: equals(a, a) is always true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equals(arr, arr)).toBe(true);
      }),
    );
  });

  it('symmetric: equals(a, b) === equals(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(equals(a, b)).toBe(equals(b, a));
      }),
    );
  });

  it('equals([], []) is true', () => {
    expect(equals([], [])).toBe(true);
  });

  it('equal arrays with same content return true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equals([...arr], [...arr])).toBe(true);
      }),
    );
  });
});

describe('equals — contract', () => {
  it('[1,2] vs [2,1] returns true (order-independent)', () => {
    expect(equals([1, 2], [2, 1])).toBe(true);
  });

  it('[{a:1}] vs [{a:1}] returns true via shallowEquals', () => {
    expect(equals([{ a: 1 }], [{ a: 1 }])).toBe(true);
  });

  it('[[1,2]] vs [[2,1]] returns true (recursive order-independent check)', () => {
    // equals recurses for nested arrays: [1,2] vs [2,1] would be true
    expect(equals([[1, 2]], [[2, 1]])).toBe(true);
  });

  it('different lengths return false', () => {
    expect(equals([1, 2, 3], [1, 2])).toBe(false);
  });

  it('empty arrays are equal', () => {
    expect(equals([], [])).toBe(true);
  });

  it('arrays with no matching items return false', () => {
    expect(equals([1, 2], [3, 4])).toBe(false);
  });

  it('objects compared with shallowEquals: different values return false', () => {
    expect(equals([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });
});
