/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  sortNumberAscFn,
  sortNumberDescFn,
  sortStringAscFn,
  sortStringDescFn,
  sortStringAscInsensitiveFn,
  createSortByStringFn,
  createSortByNumberFn,
  createSortByDateFn,
} from './sort';

describe('sort — property-based', () => {
  it('sortNumberAscFn: sorted array has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true })), (arr) => {
        expect([...arr].sort(sortNumberAscFn)).toHaveLength(arr.length);
      }),
    );
  });

  it('sortNumberAscFn: result is non-decreasing', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true })), (arr) => {
        const sorted = [...arr].sort(sortNumberAscFn);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]!);
        }
      }),
    );
  });

  it('sortNumberDescFn: result is non-increasing', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true })), (arr) => {
        const sorted = [...arr].sort(sortNumberDescFn);
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]).toBeLessThanOrEqual(sorted[i - 1]!);
        }
      }),
    );
  });

  it('sortStringAscFn: result has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (arr) => {
        expect([...arr].sort(sortStringAscFn)).toHaveLength(arr.length);
      }),
    );
  });

  it('createSortByNumberFn: sorted array has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ value: fc.float({ noNaN: true }) })), (arr) => {
        const sorted = [...arr].sort(createSortByNumberFn());
        expect(sorted).toHaveLength(arr.length);
      }),
    );
  });

  it('createSortByNumberFn: result is non-decreasing by value', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ value: fc.float({ noNaN: true }) })), (arr) => {
        const sorted = [...arr].sort(createSortByNumberFn());
        for (let i = 1; i < sorted.length; i++) {
          expect(sorted[i]!.value).toBeGreaterThanOrEqual(sorted[i - 1]!.value);
        }
      }),
    );
  });
});

describe('sort — contract', () => {
  it('sortNumberAscFn: empty array returns []', () => {
    expect([].sort(sortNumberAscFn)).toEqual([]);
  });

  it('sortNumberAscFn: single element returns same element', () => {
    expect([42].sort(sortNumberAscFn)).toEqual([42]);
  });

  it('sortNumberDescFn: sorts descending', () => {
    expect([3, 1, 4, 1, 5].sort(sortNumberDescFn)).toEqual([5, 4, 3, 1, 1]);
  });

  it('sortStringAscFn: sorts alphabetically ascending', () => {
    expect(['banana', 'apple', 'cherry'].sort(sortStringAscFn)).toEqual(['apple', 'banana', 'cherry']);
  });

  it('sortStringDescFn: sorts alphabetically descending', () => {
    expect(['banana', 'apple', 'cherry'].sort(sortStringDescFn)).toEqual(['cherry', 'banana', 'apple']);
  });

  it('sortStringAscInsensitiveFn: case-insensitive ascending', () => {
    expect(['Banana', 'apple', 'Cherry'].sort(sortStringAscInsensitiveFn)).toEqual(['apple', 'Banana', 'Cherry']);
  });

  it('createSortByStringFn: sorts by given property', () => {
    const items = [{ name: 'banana' }, { name: 'apple' }];
    expect(items.sort(createSortByStringFn('name'))).toEqual([{ name: 'apple' }, { name: 'banana' }]);
  });

  it('createSortByStringFn: missing property falls back to empty string', () => {
    const items = [{ label: 'b' }, { label: 'a' }];
    const fn = createSortByStringFn<{ label: string }>('label');
    expect(items.sort(fn)).toEqual([{ label: 'a' }, { label: 'b' }]);
  });

  it('createSortByStringFn: uses default property order (value first)', () => {
    const items = [{ value: 'z' }, { value: 'a' }];
    expect(items.sort(createSortByStringFn())).toEqual([{ value: 'a' }, { value: 'z' }]);
  });

  it('createSortByNumberFn: sorts by given property', () => {
    const items = [{ count: 3 }, { count: 1 }, { count: 2 }];
    expect(items.sort(createSortByNumberFn('count'))).toEqual([{ count: 1 }, { count: 2 }, { count: 3 }]);
  });

  it('createSortByNumberFn: missing property defaults to 0', () => {
    const items = [{ score: 5 }, {}] as { score?: number }[];
    expect(items.sort(createSortByNumberFn('score'))).toEqual([{}, { score: 5 }]);
  });

  it('createSortByDateFn: sorts by date property ascending', () => {
    const items = [
      { date: '2023-06-01' },
      { date: '2021-01-01' },
      { date: '2022-03-15' },
    ];
    expect(items.sort(createSortByDateFn())).toEqual([
      { date: '2021-01-01' },
      { date: '2022-03-15' },
      { date: '2023-06-01' },
    ]);
  });

  it('createSortByDateFn: empty array returns []', () => {
    expect([].sort(createSortByDateFn())).toEqual([]);
  });
});
