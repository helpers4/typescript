/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { uniqueBy } from './uniqueBy';

describe('uniqueBy — property-based', () => {
  it('no two result items share a derived key', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 20 })), (arr) => {
        const items = arr.map((id, i) => ({ id, i }));
        const result = uniqueBy(items, (item) => item.id);
        const keys = result.map((item) => item.id);
        expect(new Set(keys).size).toBe(keys.length);
      }),
    );
  });

  it('every result item was in the input, for both keep modes', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 20 })), fc.constantFrom('first', 'last'), (arr, keep) => {
        const items = arr.map((id, i) => ({ id, i }));
        const result = uniqueBy(items, (item) => item.id, { keep });
        for (const item of result) {
          expect(items).toContainEqual(item);
        }
      }),
    );
  });

  it('result length never exceeds input length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const items = arr.map((id) => ({ id }));
        expect(uniqueBy(items, (item) => item.id).length).toBeLessThanOrEqual(items.length);
      }),
    );
  });

  it('idempotent: uniqueBy(uniqueBy(a)) === uniqueBy(a)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 20 })), (arr) => {
        const items = arr.map((id, i) => ({ id, i }));
        const once = uniqueBy(items, (item) => item.id);
        const twice = uniqueBy(once, (item) => item.id);
        expect(twice).toEqual(once);
      }),
    );
  });
});

describe('uniqueBy — contract', () => {
  it('empty array → []', () => {
    expect(uniqueBy([], (item: { id: number }) => item.id)).toEqual([]);
  });

  it('null → []', () => {
    expect(uniqueBy(null, (item: { id: number }) => item.id)).toEqual([]);
  });

  it('all same key returns single item', () => {
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 1 }], (item) => item.id)).toEqual([{ id: 1 }]);
  });
});
