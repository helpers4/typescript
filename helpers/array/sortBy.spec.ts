/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import {
  createSortByNumberFn,
  createSortByStringFn,
} from './sortBy';

describe('sortBy — property-based', () => {
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

  it('createSortByStringFn single key: result has same length', () => {
    fc.assert(
      fc.property(fc.array(fc.record({ value: fc.string() })), (arr) => {
        expect([...arr].sort(createSortByStringFn('value'))).toHaveLength(arr.length);
      }),
    );
  });

  it('createSortByStringFn multi-key: result has same length', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ a: fc.string(), b: fc.string() })),
        (arr) => {
          expect([...arr].sort(createSortByStringFn(['a', 'b'] as const))).toHaveLength(arr.length);
        },
      ),
    );
  });
});

describe('sortBy — contract', () => {
  it('createSortByStringFn: sorts by given property', () => {
    const items = [{ name: 'banana' }, { name: 'apple' }];
    expect(items.sort(createSortByStringFn('name'))).toEqual([{ name: 'apple' }, { name: 'banana' }]);
  });

  it('createSortByStringFn: uses default property order (value first)', () => {
    const items = [{ value: 'z' }, { value: 'a' }];
    expect(items.sort(createSortByStringFn())).toEqual([{ value: 'a' }, { value: 'z' }]);
  });

  it('createSortByNumberFn: sorts by given property', () => {
    const items = [{ count: 3 }, { count: 1 }, { count: 2 }];
    expect(items.sort(createSortByNumberFn('count'))).toEqual([{ count: 1 }, { count: 2 }, { count: 3 }]);
  });
});
