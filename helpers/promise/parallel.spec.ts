/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parallel } from './parallel';

describe('parallel — property-based', () => {
  it('result has same length as input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer(), { maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (values: number[], limit: number) => {
          const fns = values.map(v => () => Promise.resolve(v));
          const results = await parallel(fns, limit);
          expect(results).toHaveLength(values.length);
        },
      ),
    );
  });

  it('results are in the same order as the input', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (values: number[], limit: number) => {
          const fns = values.map(v => () => Promise.resolve(v));
          const results = await parallel(fns, limit);
          expect(results).toEqual(values);
        },
      ),
    );
  });

  it('all functions are executed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer(), { maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (values: number[], limit: number) => {
          const called: number[] = [];
          const fns = values.map((v, i) => async () => { called.push(i); return v; });
          await parallel(fns, limit);
          expect(called.sort((a, b) => a - b)).toEqual(values.map((_, i) => i));
        },
      ),
    );
  });
});

describe('parallel — contract', () => {
  it('empty array returns []', async () => {
    expect(await parallel([], 5)).toEqual([]);
  });

  it('limit=1 executes sequentially in order', async () => {
    const order: number[] = [];
    const fns = [1, 2, 3].map(n => async () => { order.push(n); return n; });
    const results = await parallel(fns, 1);
    expect(results).toEqual([1, 2, 3]);
    expect(order).toEqual([1, 2, 3]);
  });

  it('limit=Infinity runs all concurrently', async () => {
    const fns = [10, 20, 30].map(v => () => Promise.resolve(v));
    const results = await parallel(fns, Infinity);
    expect(results).toEqual([10, 20, 30]);
  });

  it('limit=2 with 5 functions returns correct ordered results', async () => {
    const fns = [1, 2, 3, 4, 5].map(v => () => Promise.resolve(v * 2));
    const results = await parallel(fns, 2);
    expect(results).toEqual([2, 4, 6, 8, 10]);
  });

  it('limit=0 is clamped to 1 (still works)', async () => {
    const fns = [1, 2, 3].map(v => () => Promise.resolve(v));
    const results = await parallel(fns, 0);
    expect(results).toEqual([1, 2, 3]);
  });

  it('limit=NaN uses floor of finite — treated as 1', async () => {
    const fns = [5, 10].map(v => () => Promise.resolve(v));
    // NaN is not finite, so clampedLimit = 1
    const results = await parallel(fns, NaN);
    expect(results).toEqual([5, 10]);
  });
});
