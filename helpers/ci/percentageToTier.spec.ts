/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { type PercentageTier, percentageToTier } from './percentageToTier';

const tierArb: fc.Arbitrary<PercentageTier> = fc.record({
  min: fc.integer({ min: -100, max: 200 }),
  icon: fc.string({ minLength: 1, maxLength: 3 }),
  color: fc.string({ minLength: 1, maxLength: 10 }),
  label: fc.string({ minLength: 1, maxLength: 10 }),
});

describe('percentageToTier — property-based', () => {
  it('always returns one of the provided tiers', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.array(tierArb, { minLength: 1, maxLength: 8 }),
        (value, tiers) => {
          const result = percentageToTier(value, tiers);
          expect(tiers).toContainEqual(result);
        }
      )
    );
  });

  it('the returned tier\'s min is always <= value, or is the lowest-min tier', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.array(tierArb, { minLength: 1, maxLength: 8 }),
        (value, tiers) => {
          const result = percentageToTier(value, tiers);
          const lowestMin = Math.min(...tiers.map(t => t.min));
          expect(result.min <= value || result.min === lowestMin).toBe(true);
        }
      )
    );
  });

  it('is deterministic for the same inputs', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -1000, max: 1000, noNaN: true }),
        fc.array(tierArb, { minLength: 1, maxLength: 8 }),
        (value, tiers) => {
          expect(percentageToTier(value, tiers)).toEqual(percentageToTier(value, tiers));
        }
      )
    );
  });

  it('always throws for an empty tiers array, regardless of value', () => {
    fc.assert(
      fc.property(fc.double({ noNaN: true }), value => {
        expect(() => percentageToTier(value, [])).toThrow(RangeError);
      })
    );
  });
});
