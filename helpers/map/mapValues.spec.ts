/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mapValues } from './mapValues';

describe('mapValues — property-based', () => {
  it('never changes the set of keys', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const result = mapValues(map, (v) => v * 2);
        expect([...result.keys()].sort()).toEqual([...map.keys()].sort());
      }),
    );
  });

  it('identity transform preserves the map', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        expect(mapValues(map, (v) => v)).toEqual(map);
      }),
    );
  });
});

describe('mapValues — contract', () => {
  it('empty map returns an empty map', () => {
    expect(mapValues(new Map(), (v: number) => v)).toEqual(new Map());
  });
});
