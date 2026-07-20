/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { filter } from './filter';

describe('filter', () => {
  it('keeps only entries matching the predicate', () => {
    const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
    expect(filter(map, (value) => value % 2 === 0)).toEqual(new Map([['b', 2]]));
  });

  it('returns an empty map when nothing matches', () => {
    const map = new Map([['a', 1]]);
    expect(filter(map, () => false)).toEqual(new Map());
  });

  it('returns all entries when everything matches', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(filter(map, () => true)).toEqual(map);
  });

  it('does not mutate the original map', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    filter(map, (value) => value > 1);
    expect(map.size).toBe(2);
  });

  it('passes the key to the predicate', () => {
    const map = new Map([['keep', 1], ['drop', 2]]);
    expect(filter(map, (_value, key) => key === 'keep')).toEqual(new Map([['keep', 1]]));
  });
});
