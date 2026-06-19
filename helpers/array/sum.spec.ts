/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { sum } from './sum';

describe('sum — property-based', () => {
  it('sum([]) === 0', () => {
    expect(sum([])).toBe(0);
  });

  it('sum([n]) === n for any finite number', () => {
    fc.assert(
      fc.property(fc.integer({ min: -1_000_000, max: 1_000_000 }), (n) => {
        expect(sum([n])).toBe(n);
      })
    );
  });

  it('sum(a.concat(b)) === sum(a) + sum(b) for integer arrays', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -1000, max: 1000 })),
        fc.array(fc.integer({ min: -1000, max: 1000 })),
        (a, b) => {
          // Use integers to avoid floating-point precision issues
          expect(sum([...a, ...b])).toBe(sum(a) + sum(b));
        }
      )
    );
  });
});

describe('sum — contract', () => {
  it('[] → 0', () => {
    expect(sum([])).toBe(0);
  });

  it('[0] → 0', () => {
    expect(sum([0])).toBe(0);
  });

  it('negative numbers', () => {
    expect(sum([-1, -2, -3])).toBe(-6);
  });

  it('mixed positive and negative', () => {
    expect(sum([-5, 10, -3, 2])).toBe(4);
  });

  it('large numbers', () => {
    expect(sum([1e15, 2e15, 3e15])).toBe(6e15);
  });

  it('[Infinity] → Infinity', () => {
    expect(sum([Infinity])).toBe(Infinity);
  });

  it('[1, Infinity] → Infinity', () => {
    expect(sum([1, Infinity])).toBe(Infinity);
  });

  it('[NaN] → NaN', () => {
    expect(sum([NaN])).toBeNaN();
  });

  it('[1, NaN, 2] → NaN', () => {
    expect(sum([1, NaN, 2])).toBeNaN();
  });
});
