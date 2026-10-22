/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { meanBy } from './meanBy';

describe('meanBy — property-based', () => {
  it('is always between the min and max of the derived values', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
        const m = meanBy(arr, (n) => n * 2);
        const derived = arr.map((n) => n * 2);
        expect(m).toBeGreaterThanOrEqual(Math.min(...derived));
        expect(m).toBeLessThanOrEqual(Math.max(...derived));
      }),
    );
  });
});

describe('meanBy — contract', () => {
  it('empty array returns NaN', () => {
    expect(meanBy([], (n: number) => n)).toBeNaN();
  });

  it('a string path and an equivalent function give the same result', () => {
    const items = [{ price: 10 }, { price: 20 }, { price: 5 }];
    expect(meanBy(items, 'price')).toBe(meanBy(items, (item) => item.price));
  });
});
