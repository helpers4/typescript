/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { findMap } from './findMap';

describe('findMap — property-based', () => {
  it('matches map(fn).find(v => v !== undefined) for any array/mapper', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer({ min: 0, max: 5 }), (array, threshold) => {
        const fn = (n: number) => (n > threshold ? n : undefined);
        expect(findMap(array, fn)).toBe(array.map(fn).find((v) => v !== undefined));
      }),
    );
  });

  it('never calls fn on indices beyond the first match', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        fc.nat(),
        (array, seed) => {
          const matchIndex = seed % array.length;
          let lastCalledIndex = -1;
          findMap(array, (_item, index) => {
            lastCalledIndex = index;
            return index === matchIndex ? 'match' : undefined;
          });
          expect(lastCalledIndex).toBe(matchIndex);
        },
      ),
    );
  });

  it('returns undefined when fn always returns undefined', () => {
    fc.assert(
      fc.property(fc.array(fc.anything()), (array) => {
        expect(findMap(array, () => undefined)).toBeUndefined();
      }),
    );
  });
});

describe('findMap — contract', () => {
  it('returns undefined for null/undefined input without throwing', () => {
    expect(() => findMap(null, () => 'x')).not.toThrow();
    expect(() => findMap(undefined, () => 'x')).not.toThrow();
  });
});
