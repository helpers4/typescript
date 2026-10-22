/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { filter } from './filter';

describe('filter — property-based', () => {
  it('result size never exceeds the input size', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const result = filter(map, (v) => v > 0);
        expect(result.size).toBeLessThanOrEqual(map.size);
      }),
    );
  });

  it('every remaining value satisfies the predicate', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const result = filter(map, (v) => v % 2 === 0);
        for (const value of result.values()) {
          expect(value % 2 === 0).toBe(true);
        }
      }),
    );
  });
});

describe('filter — contract', () => {
  it('empty map returns empty map', () => {
    expect(filter(new Map(), () => true)).toEqual(new Map());
  });
});
