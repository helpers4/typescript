/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { sumBy } from './sumBy';

describe('sumBy — property-based', () => {
  it('matches summing a mapped array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        expect(sumBy(arr, (n) => n * 2)).toBe(arr.map((n) => n * 2).reduce((a, b) => a + b, 0));
      }),
    );
  });
});

describe('sumBy — contract', () => {
  it('null and undefined both return 0', () => {
    expect(sumBy(null, (n: number) => n)).toBe(0);
    expect(sumBy(undefined, (n: number) => n)).toBe(0);
  });

  it('a string path and an equivalent function give the same result', () => {
    const items = [{ price: 10 }, { price: 20 }, { price: 5 }];
    expect(sumBy(items, 'price')).toBe(sumBy(items, (item) => item.price));
  });
});
