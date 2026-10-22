/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { meanBy } from './meanBy';

describe('meanBy', () => {
  it('averages a derived value across items', () => {
    expect(meanBy([{ price: 10 }, { price: 20 }], (item) => item.price)).toBe(15);
  });

  it('returns NaN for an empty array', () => {
    expect(meanBy([], (n: number) => n)).toBeNaN();
  });

  it('works with a single item', () => {
    expect(meanBy([{ price: 42 }], (item) => item.price)).toBe(42);
  });

  it('accepts a string property path instead of a function', () => {
    expect(meanBy([{ price: 10 }, { price: 20 }], 'price')).toBe(15);
  });

  it('accepts a key array path', () => {
    expect(meanBy([{ stats: { score: 10 } }, { stats: { score: 20 } }], ['stats', 'score'])).toBe(15);
  });

  it('returns NaN for null, matching sumBy treating it as empty', () => {
    expect(meanBy(null, (n: number) => n)).toBeNaN();
  });

  it('returns NaN for undefined, matching sumBy treating it as empty', () => {
    expect(meanBy(undefined, (n: number) => n)).toBeNaN();
  });
});
