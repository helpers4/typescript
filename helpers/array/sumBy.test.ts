/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { sumBy } from './sumBy';

describe('sumBy', () => {
  it('sums a derived value across items', () => {
    expect(sumBy([{ price: 10 }, { price: 20 }, { price: 5 }], (item) => item.price)).toBe(35);
  });

  it('returns 0 for an empty array', () => {
    expect(sumBy([], (n: number) => n)).toBe(0);
  });

  it('returns 0 for null', () => {
    expect(sumBy(null, (n: number) => n)).toBe(0);
  });

  it('returns 0 for undefined', () => {
    expect(sumBy(undefined, (n: number) => n)).toBe(0);
  });

  it('accepts a string property path instead of a function', () => {
    expect(sumBy([{ price: 10 }, { price: 20 }], 'price')).toBe(30);
  });

  it('accepts a dot-notation nested path', () => {
    expect(sumBy([{ stats: { score: 3 } }, { stats: { score: 7 } }], 'stats.score')).toBe(10);
  });

  it('accepts a key array path', () => {
    expect(sumBy([{ stats: { score: 3 } }, { stats: { score: 7 } }], ['stats', 'score'])).toBe(10);
  });
});
