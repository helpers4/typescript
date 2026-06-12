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
  sortStringAscInsensitiveFn,
  sortStringDescFn,
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
});
