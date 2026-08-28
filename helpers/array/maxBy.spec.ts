/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { maxBy } from './maxBy';

describe('maxBy — property-based', () => {
  it('derived key of the result is always >= every derived key', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        const result = maxBy(items, (item) => item.v)!;
        for (const item of items) {
          expect(result.v).toBeGreaterThanOrEqual(item.v);
        }
      }),
    );
  });

  it('result is always an element of the array', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        expect(items).toContain(maxBy(items, (item) => item.v));
      }),
    );
  });

  it('matches array/max on the derived keys', () => {
    fc.assert(
      fc.property(fc.array(fc.float({ noNaN: true }), { minLength: 1, maxLength: 100 }), (arr) => {
        const items = arr.map((v) => ({ v }));
        expect(maxBy(items, (item) => item.v)!.v).toBe(Math.max(...arr));
      }),
    );
  });
});

describe('maxBy — contract', () => {
  it('empty array → undefined', () => {
    expect(maxBy([], (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('null → undefined', () => {
    expect(maxBy(null, (item: { v: number }) => item.v)).toBeUndefined();
  });

  it('undefined → undefined', () => {
    expect(maxBy(undefined, (item: { v: number }) => item.v)).toBeUndefined();
  });
});
