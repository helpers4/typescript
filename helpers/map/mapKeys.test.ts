/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mapKeys } from './mapKeys';

describe('mapKeys', () => {
  it('transforms every key, keeping values unchanged', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(mapKeys(map, (key) => key.toUpperCase())).toEqual(new Map([['A', 1], ['B', 2]]));
  });

  it('passes the value to the transform function', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(mapKeys(map, (key, value) => `${key}${value}`)).toEqual(new Map([['a1', 1], ['b2', 2]]));
  });

  it('later entry wins when two keys collide after transform', () => {
    const map = new Map([['a', 1], ['A', 2]]);
    expect(mapKeys(map, (key) => key.toLowerCase())).toEqual(new Map([['a', 2]]));
  });

  it('returns an empty map for an empty input', () => {
    expect(mapKeys(new Map(), (k: string) => k)).toEqual(new Map());
  });
});
