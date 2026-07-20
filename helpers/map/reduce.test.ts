/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { reduce } from './reduce';

describe('reduce', () => {
  it('accumulates values across entries', () => {
    const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
    expect(reduce(map, (acc, value) => acc + value, 0)).toBe(6);
  });

  it('passes the key to the reducer', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(reduce(map, (acc, value, key) => acc + key + value, '')).toBe('a1b2');
  });

  it('returns the initial value for an empty map', () => {
    expect(reduce(new Map(), (acc: number, v: number) => acc + v, 42)).toBe(42);
  });

  it('can build a different type than the map values', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(reduce(map, (acc: string[], _v, key) => [...acc, key], [])).toEqual(['a', 'b']);
  });
});
