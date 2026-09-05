/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { findMap } from './findMap';

describe('findMap', () => {
  it('returns the first non-undefined mapped result', () => {
    expect(findMap([1, 2, 3, 4], (n) => (n % 2 === 0 ? n * 10 : undefined))).toBe(20);
  });

  it('returns undefined when no item maps to a defined value', () => {
    expect(findMap([1, 3, 5], (n) => (n % 2 === 0 ? n : undefined))).toBeUndefined();
  });

  it('returns undefined for an empty array', () => {
    expect(findMap([], (n: number) => n)).toBeUndefined();
  });

  it('returns undefined for a null array', () => {
    expect(findMap(null, (n: number) => n)).toBeUndefined();
  });

  it('returns undefined for an undefined array', () => {
    expect(findMap(undefined, (n: number) => n)).toBeUndefined();
  });

  it('passes the index to the callback', () => {
    const indices: number[] = [];
    findMap(['a', 'b', 'c'], (_item, index) => {
      indices.push(index);
      return undefined;
    });
    expect(indices).toEqual([0, 1, 2]);
  });

  it('short-circuits and does not call fn on items after a match', () => {
    const calls: number[] = [];
    const result = findMap([1, 2, 3, 4], (n) => {
      calls.push(n);
      return n === 2 ? 'found' : undefined;
    });
    expect(result).toBe('found');
    expect(calls).toEqual([1, 2]);
  });

  it('treats a falsy but defined result (0, "", false) as a match', () => {
    expect(findMap([1, 2, 3], (n) => (n === 2 ? 0 : undefined))).toBe(0);
    expect(findMap([1, 2, 3], (n) => (n === 2 ? '' : undefined))).toBe('');
    expect(findMap([1, 2, 3], (n) => (n === 2 ? false : undefined))).toBe(false);
  });
});
