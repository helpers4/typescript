/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parallelSettle } from './parallelSettle';

describe('parallelSettle — property-based', () => {
  it('fulfilled.length + rejected.length === functions.length', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.boolean(), { maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (outcomes: boolean[], concurrency: number) => {
          const fns = outcomes.map(
            (shouldResolve, i) => () => (shouldResolve ? Promise.resolve(i) : Promise.reject(new Error(`fail-${i}`))),
          );
          const result = await parallelSettle(fns, concurrency);
          expect(result.fulfilled.length + result.rejected.length).toBe(outcomes.length);
        },
      ),
    );
  });

  it('fulfilled values are exactly the resolved ones, in input order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.boolean(), { maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (outcomes: boolean[], concurrency: number) => {
          const expected = outcomes.flatMap((shouldResolve, i) => (shouldResolve ? [i] : []));
          const fns = outcomes.map(
            (shouldResolve, i) => () => (shouldResolve ? Promise.resolve(i) : Promise.reject(new Error(`fail-${i}`))),
          );
          const result = await parallelSettle(fns, concurrency);
          expect(result.fulfilled).toEqual(expected);
        },
      ),
    );
  });

  it('never runs more than `concurrency` functions at once', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (outcomes: boolean[], concurrency: number) => {
          let running = 0;
          let maxRunning = 0;
          const fns = outcomes.map(shouldResolve => async () => {
            running++;
            maxRunning = Math.max(maxRunning, running);
            await Promise.resolve();
            running--;
            if (!shouldResolve) throw new Error('fail');
          });
          await parallelSettle(fns, concurrency);
          expect(maxRunning).toBeLessThanOrEqual(concurrency);
        },
      ),
    );
  });
});

describe('parallelSettle — contract', () => {
  it('never rejects, even when every function rejects', async () => {
    await expect(parallelSettle([() => Promise.reject(new Error('boom'))], 2)).resolves.toBeDefined();
  });

  it('empty input resolves to empty partitions', async () => {
    const result = await parallelSettle([], 5);
    expect(result).toEqual({ fulfilled: [], rejected: [] });
  });

  it('does not invoke functions before parallelSettle is called (deferred, unlike settle)', async () => {
    let called = false;
    const fns = [() => {
      called = true;
      return Promise.resolve(1);
    }];
    expect(called).toBe(false);
    await parallelSettle(fns, 1);
    expect(called).toBe(true);
  });

  it('concurrency=Infinity means no cap, same as parallel()', async () => {
    let concurrent = 0;
    let maxConcurrent = 0;
    const fns = [10, 20, 30].map((v) => async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await Promise.resolve();
      concurrent--;
      return v;
    });
    const result = await parallelSettle(fns, Infinity);
    expect(result.fulfilled).toEqual([10, 20, 30]);
    expect(maxConcurrent).toBe(3);
  });
});
