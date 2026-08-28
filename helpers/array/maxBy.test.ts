/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { maxBy } from './maxBy';

describe('maxBy', () => {
  it('returns the item with the greatest derived key', () => {
    const items = [
      { n: 'a', v: 3 },
      { n: 'b', v: 9 },
      { n: 'c', v: 1 },
    ];
    expect(maxBy(items, (item) => item.v)).toBe(items[1]);
  });

  it('empty array → undefined', () => {
    expect(maxBy([], (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('null → undefined', () => {
    expect(maxBy(null, (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('undefined → undefined', () => {
    expect(maxBy(undefined, (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('single element → that element', () => {
    const item = { v: 5 };
    expect(maxBy([item], (i) => i.v)).toBe(item);
  });

  it('on a tie, the earliest element wins', () => {
    const items = [
      { n: 'first', v: 5 },
      { n: 'second', v: 5 },
    ];
    expect(maxBy(items, (item) => item.v)).toBe(items[0]);
  });
});
