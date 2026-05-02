/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { equalsShallow } from './equalsShallow';

describe('equalsShallow — property-based', () => {
  it('reflexive: equalsShallow(a, a) is always true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equalsShallow(arr, arr)).toBe(true);
      }),
    );
  });

  it('symmetric: equalsShallow(a, b) === equalsShallow(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(equalsShallow(a, b)).toBe(equalsShallow(b, a));
      }),
    );
  });

  it('equal arrays return true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(equalsShallow([...arr], [...arr])).toBe(true);
      }),
    );
  });
});

describe('equalsShallow — contract', () => {
  it('two empty arrays are equal', () => {
    expect(equalsShallow([], [])).toBe(true);
  });

  it('[1,2,3] vs [1,2,3] are equal', () => {
    expect(equalsShallow([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('[1,2] vs [2,1] are not equal (order matters)', () => {
    expect(equalsShallow([1, 2], [2, 1])).toBe(false);
  });

  it('different lengths are not equal', () => {
    expect(equalsShallow([1, 2, 3], [1, 2])).toBe(false);
  });

  it('arrays with functions fall back to reference equality', () => {
    const fn = () => 42;
    const a = [fn];
    const b = [fn];
    // JSON.stringify([fn]) === JSON.stringify([fn]) since functions become undefined => "[]"
    // So both become [] in JSON and are "equal"
    expect(equalsShallow(a, b)).toBe(true);
  });

  it('same reference with circular structure falls back to reference equality', () => {
    const a: unknown[] = [1, 2];
    (a as unknown[]).push(a);
    expect(equalsShallow(a, a)).toBe(true);
  });

  it('two different circular references are not equal', () => {
    const a: unknown[] = [1];
    const b: unknown[] = [1];
    (a as unknown[]).push(a);
    (b as unknown[]).push(b);
    expect(equalsShallow(a, b)).toBe(false);
  });
});
