/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { randomBetween, randomIntBetween } from './random';

describe('randomBetween — property-based', () => {
  it('result is always >= min and <= max', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        (a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          // Run multiple times to exercise randomness
          for (let i = 0; i < 10; i++) {
            const result = randomBetween(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
          }
        }
      )
    );
  });
});

describe('randomIntBetween — property-based', () => {
  it('result is always an integer', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        (a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          const result = randomIntBetween(min, max);
          expect(Number.isInteger(result)).toBe(true);
        }
      )
    );
  });

  it('result is always within [min, max]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1000, max: 1000 }),
        fc.integer({ min: -1000, max: 1000 }),
        (a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          for (let i = 0; i < 10; i++) {
            const result = randomIntBetween(min, max);
            expect(result).toBeGreaterThanOrEqual(min);
            expect(result).toBeLessThanOrEqual(max);
          }
        }
      )
    );
  });
});

describe('randomBetween — contract', () => {
  it('min === max → always returns min', () => {
    for (let i = 0; i < 20; i++) {
      expect(randomBetween(5, 5)).toBe(5);
    }
  });

  it('min > max behavior: Math.random() * (max - min) + min — may return values outside [max, min]', () => {
    // When min > max, result = Math.random() * (negative) + min
    // Result will be between max and min (i.e., inverted range)
    // Document: the function does NOT swap min/max
    const result = randomBetween(10, 5);
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(10);
  });
});

describe('randomIntBetween — contract', () => {
  it('min === max → always returns min', () => {
    for (let i = 0; i < 20; i++) {
      expect(randomIntBetween(7, 7)).toBe(7);
    }
  });

  it('result covers full range across many calls (smoke test for distribution)', () => {
    const results = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      results.add(randomIntBetween(1, 5));
    }
    // With 1000 trials over 5 values, all values should appear
    expect(results.size).toBe(5);
  });

  it('min > max behavior: may return values in inverted range', () => {
    // floor(random * (min - max + 1)) + max
    // Document: not guaranteed to be in [max, min] when min > max
    // The function does not validate min <= max
    const result = randomIntBetween(10, 5);
    // Result is implementation-defined but should not throw
    expect(typeof result).toBe('number');
  });
});
