/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy — property-based', () => {
  it('sum of counts equals the map size', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const counts = countBy(map, (v) => v % 3);
        const total = [...counts.values()].reduce((a, b) => a + b, 0);
        expect(total).toBe(map.size);
      }),
    );
  });
});

describe('countBy — contract', () => {
  it('empty map returns an empty map', () => {
    expect(countBy(new Map(), () => 'x')).toEqual(new Map());
  });
});
