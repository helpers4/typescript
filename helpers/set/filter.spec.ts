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
      fc.property(fc.array(fc.integer()), (values) => {
        const set = new Set(values);
        expect(filter(set, (v) => v > 0).size).toBeLessThanOrEqual(set.size);
      }),
    );
  });

  it('every remaining value satisfies the predicate', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (values) => {
        const result = filter(new Set(values), (v) => v % 2 === 0);
        for (const value of result) {
          expect(value % 2 === 0).toBe(true);
        }
      }),
    );
  });
});

describe('filter — contract', () => {
  it('empty set returns empty set', () => {
    expect(filter(new Set(), () => true)).toEqual(new Set());
  });
});
