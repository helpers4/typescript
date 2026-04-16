/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { shallowEquals } from './shallowEquals';

describe('shallowEquals — property-based', () => {
  it('reflexive: shallowEquals(a, a) is always true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(shallowEquals(arr, arr)).toBe(true);
      }),
    );
  });

  it('symmetric: shallowEquals(a, b) === shallowEquals(b, a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.array(fc.integer()), (a, b) => {
        expect(shallowEquals(a, b)).toBe(shallowEquals(b, a));
      }),
    );
  });

  it('equal arrays return true', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(shallowEquals([...arr], [...arr])).toBe(true);
      }),
    );
  });
});

describe('shallowEquals — contract', () => {
  it('two empty arrays are equal', () => {
    expect(shallowEquals([], [])).toBe(true);
  });

  it('[1,2,3] vs [1,2,3] are equal', () => {
    expect(shallowEquals([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('[1,2] vs [2,1] are not equal (order matters)', () => {
    expect(shallowEquals([1, 2], [2, 1])).toBe(false);
  });

  it('different lengths are not equal', () => {
    expect(shallowEquals([1, 2, 3], [1, 2])).toBe(false);
  });

  it('arrays with functions fall back to reference equality', () => {
    const fn = () => 42;
    const a = [fn];
    const b = [fn];
    // JSON.stringify([fn]) === JSON.stringify([fn]) since functions become undefined => "[]"
    // So both become [] in JSON and are "equal"
    expect(shallowEquals(a, b)).toBe(true);
  });

  it('same reference with circular structure falls back to reference equality', () => {
    const a: unknown[] = [1, 2];
    (a as unknown[]).push(a);
    expect(shallowEquals(a, a)).toBe(true);
  });

  it('two different circular references are not equal', () => {
    const a: unknown[] = [1];
    const b: unknown[] = [1];
    (a as unknown[]).push(a);
    (b as unknown[]).push(b);
    expect(shallowEquals(a, b)).toBe(false);
  });
});
