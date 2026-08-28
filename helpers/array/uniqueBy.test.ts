/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { uniqueBy } from './uniqueBy';

describe('uniqueBy', () => {
  it('removes items with a duplicate key, keeping the first by default', () => {
    const items = [
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
      { id: 1, v: 'c' },
    ];
    expect(uniqueBy(items, (item) => item.id)).toEqual([
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
    ]);
  });

  it('keeps the last occurrence when keep: "last"', () => {
    const items = [
      { id: 1, v: 'a' },
      { id: 2, v: 'b' },
      { id: 1, v: 'c' },
    ];
    expect(uniqueBy(items, (item) => item.id, { keep: 'last' })).toEqual([
      { id: 1, v: 'c' },
      { id: 2, v: 'b' },
    ]);
  });

  it('explicit keep: "first" matches the default', () => {
    const items = [
      { id: 1, v: 'a' },
      { id: 1, v: 'b' },
    ];
    expect(uniqueBy(items, (item) => item.id, { keep: 'first' })).toEqual([{ id: 1, v: 'a' }]);
  });

  it('null → []', () => {
    expect(uniqueBy(null, (item: { id: number }) => item.id)).toEqual([]);
  });

  it('undefined → []', () => {
    expect(uniqueBy(undefined, (item: { id: number }) => item.id)).toEqual([]);
  });

  it('empty array → []', () => {
    expect(uniqueBy([], (item: { id: number }) => item.id)).toEqual([]);
  });

  it('no duplicates returns all items in original order', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    expect(uniqueBy(items, (item) => item.id)).toEqual(items);
  });

  it('preserves first-occurrence position even when keeping the last value', () => {
    const items = [
      { id: 'a', order: 0 },
      { id: 'b', order: 1 },
      { id: 'a', order: 2 },
    ];
    const result = uniqueBy(items, (item) => item.id, { keep: 'last' });
    expect(result.map((item) => item.id)).toEqual(['a', 'b']);
    expect(result[0]!.order).toBe(2);
  });
});
