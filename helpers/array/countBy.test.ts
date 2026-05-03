/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy', () => {
  it('counts by parity', () => {
    const result = countBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'));
    expect(result).toEqual({ odd: 3, even: 2 });
  });

  it('counts by first character', () => {
    const result = countBy(['foo', 'bar', 'baz', 'qux'], (s) => s[0]);
    expect(result).toEqual({ f: 1, b: 2, q: 1 });
  });

  it('counts by boolean key', () => {
    const result = countBy([true, false, true, true], (b) => String(b));
    expect(result).toEqual({ true: 3, false: 1 });
  });

  it('returns empty record for empty array', () => {
    expect(countBy([], (x: number) => x)).toEqual({});
  });

  it('counts each element separately when all keys are unique', () => {
    const result = countBy([1, 2, 3], (n) => n);
    expect(result).toEqual({ 1: 1, 2: 1, 3: 1 });
  });

  it('counts all elements under same key', () => {
    const result = countBy([1, 2, 3], () => 'all');
    expect(result).toEqual({ all: 3 });
  });

  it('works with object elements', () => {
    const users = [
      { role: 'admin' },
      { role: 'user' },
      { role: 'admin' },
      { role: 'guest' },
    ];
    expect(countBy(users, (u) => u.role)).toEqual({ admin: 2, user: 1, guest: 1 });
  });

  it('counts using numeric keys', () => {
    const result = countBy([10, 20, 10, 30, 20, 10], (n) => n);
    expect(result).toEqual({ 10: 3, 20: 2, 30: 1 });
  });
});
