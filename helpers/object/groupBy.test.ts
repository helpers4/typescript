/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { groupBy } from './groupBy';

describe('groupBy', () => {
  it('groups numbers by parity', () => {
    expect(groupBy([1, 2, 3, 4], n => n % 2 === 0 ? 'even' : 'odd')).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  it('groups objects by a property', () => {
    const users = [
      { name: 'Alice', role: 'admin' },
      { name: 'Bob', role: 'user' },
      { name: 'Carol', role: 'admin' },
    ];
    expect(groupBy(users, u => u.role)).toEqual({
      admin: [{ name: 'Alice', role: 'admin' }, { name: 'Carol', role: 'admin' }],
      user: [{ name: 'Bob', role: 'user' }],
    });
  });

  it('returns empty object for empty array', () => {
    expect(groupBy([], (x: number) => x)).toEqual({});
  });

  it('all items in one group', () => {
    expect(groupBy([1, 2, 3], () => 'all')).toEqual({ all: [1, 2, 3] });
  });

  it('each item in its own group', () => {
    expect(groupBy([1, 2, 3], n => n)).toEqual({ 1: [1], 2: [2], 3: [3] });
  });

  it('preserves insertion order within groups', () => {
    const result = groupBy([3, 1, 2, 1, 3], n => n);
    expect(result[1]).toEqual([1, 1]);
    expect(result[3]).toEqual([3, 3]);
  });

  it('works with string keys', () => {
    const words = ['apple', 'banana', 'avocado', 'blueberry'];
    expect(groupBy(words, w => w[0])).toEqual({
      a: ['apple', 'avocado'],
      b: ['banana', 'blueberry'],
    });
  });
});
