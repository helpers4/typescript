/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { minBy } from './minBy';

describe('minBy — property-based', () => {
  it('derived key of the result is always <= every derived key', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        const result = minBy(items, (item) => item.v)!;
        for (const item of items) {
          expect(result.v).toBeLessThanOrEqual(item.v);
        }
      }),
    );
  });

  it('result is always an element of the array', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        expect(items).toContain(minBy(items, (item) => item.v));
      }),
    );
  });

  it('matches array/min on the derived keys', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1, maxLength: 100 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        expect(minBy(items, (item) => item.v)!.v).toBe(Math.min(...arr));
      }),
    );
  });
});

describe('minBy — contract', () => {
  it('empty array → undefined', () => {
    expect(minBy([], (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('null → undefined', () => {
    expect(minBy(null, (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('undefined → undefined', () => {
    expect(minBy(undefined, (item: { v: number }) => item.v)).toBeUndefined();
  });
});
