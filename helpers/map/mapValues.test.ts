/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mapValues } from './mapValues';

describe('mapValues', () => {
  it('transforms every value, keeping keys unchanged', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(mapValues(map, (value) => value * 10)).toEqual(new Map([['a', 10], ['b', 20]]));
  });

  it('passes the key to the transform function', () => {
    const map = new Map([['a', 1], ['b', 2]]);
    expect(mapValues(map, (value, key) => `${key}${value}`)).toEqual(new Map([['a', 'a1'], ['b', 'b2']]));
  });

  it('preserves key order', () => {
    const map = new Map([['z', 1], ['a', 2]]);
    expect([...mapValues(map, (v) => v).keys()]).toEqual(['z', 'a']);
  });

  it('returns an empty map for an empty input', () => {
    expect(mapValues(new Map(), (v: number) => v)).toEqual(new Map());
  });
});
