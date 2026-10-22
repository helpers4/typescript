/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { partition } from './partition';

describe('partition', () => {
  it('should split array by predicate', () => {
    expect(partition([1, 2, 3, 4, 5], n => n % 2 === 0)).toEqual([
      [2, 4],
      [1, 3, 5],
    ]);
  });

  it('should work with strings', () => {
    expect(
      partition(['apple', 'banana', 'avocado', 'cherry'], s =>
        s.startsWith('a'),
      ),
    ).toEqual([['apple', 'avocado'], ['banana', 'cherry']]);
  });

  it('should return all in first group when all match', () => {
    expect(partition([2, 4, 6], n => n % 2 === 0)).toEqual([[2, 4, 6], []]);
  });

  it('should return all in second group when none match', () => {
    expect(partition([1, 3, 5], n => n % 2 === 0)).toEqual([[], [1, 3, 5]]);
  });

  it('should work with empty array', () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });

  it('should pass index to predicate', () => {
    expect(partition(['a', 'b', 'c', 'd'], (_, i) => i < 2)).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('should work with objects', () => {
    const users = [
      { name: 'Alice', active: true },
      { name: 'Bob', active: false },
      { name: 'Charlie', active: true },
    ];
    const [active, inactive] = partition(users, u => u.active);
    expect(active).toEqual([
      { name: 'Alice', active: true },
      { name: 'Charlie', active: true },
    ]);
    expect(inactive).toEqual([{ name: 'Bob', active: false }]);
  });

  it('returns [[], []] for null', () => {
    expect(partition(null, () => true)).toEqual([[], []]);
  });

  it('returns [[], []] for undefined', () => {
    expect(partition(undefined, () => true)).toEqual([[], []]);
  });
});
