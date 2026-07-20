/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { countBy } from './countBy';

describe('countBy — property-based', () => {
  it('sum of counts equals the set size', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (values) => {
        const set = new Set(values);
        const counts = countBy(set, (v) => v % 3);
        const total = [...counts.values()].reduce((a, b) => a + b, 0);
        expect(total).toBe(set.size);
      }),
    );
  });
});

describe('countBy — contract', () => {
  it('empty set returns an empty map', () => {
    expect(countBy(new Set(), () => 'x')).toEqual(new Map());
  });
});
