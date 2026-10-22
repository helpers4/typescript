/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { select } from './select';

describe('select — property-based', () => {
  it('result length is at most input length', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.func(fc.integer()),
        fc.func(fc.boolean()),
        (arr, mapper, condition) => {
          expect(select(arr, mapper, condition).length).toBeLessThanOrEqual(arr.length);
        },
      ),
    );
  });

  it('result length equals number of items passing the condition', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: -50, max: 50 }),
        (arr, threshold) => {
          const condition = (x: number) => x > threshold;
          const passing = arr.filter(condition);
          expect(select(arr, x => x, condition).length).toBe(passing.length);
        },
      ),
    );
  });
});

describe('select — contracts', () => {
  it('matches .filter(condition).map(mapper) for index-agnostic callbacks', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: -100, max: 100 })),
        (arr) => {
          const condition = (x: number) => x > 0;
          const mapper = (x: number) => x * 2;
          expect(select(arr, mapper, condition)).toEqual(
            arr.filter(condition).map(mapper),
          );
        },
      ),
    );
  });

  it('passes the original array index (not post-filter index) to mapper', () => {
    // select([10, 20, 30], (_, i) => i, (_, i) => i === 2) → [2]
    // .filter().map() would yield [0] because filter re-indexes
    expect(select([10, 20, 30], (_x, i) => i, (_x, i) => i === 2)).toEqual([2]);
  });

  it('without condition is equivalent to .map()', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const mapper = (x: number) => x * 3;
        expect(select(arr, mapper)).toEqual(arr.map(mapper));
      }),
    );
  });

  it('mapper is never called for items failing the condition', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.integer({ min: -50, max: 50 }),
        (arr, threshold) => {
          const condition = (x: number) => x > threshold;
          const seen: number[] = [];
          select(arr, x => { seen.push(x); return x; }, condition);
          const passing = arr.filter(condition);
          expect(seen).toEqual(passing);
        },
      ),
    );
  });
});
