/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mapAsync } from './mapAsync';

describe('mapAsync — property-based', () => {
  it('result has the same length as the input', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer(), { maxLength: 10 }), async (values) => {
        const results = await mapAsync(values, (n) => n);
        expect(results).toHaveLength(values.length);
      }),
    );
  });

  it('matches Promise.all(array.map(fn)) result', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer(), { maxLength: 10 }), async (values) => {
        const viaMapAsync = await mapAsync(values, async (n) => n * 2);
        const viaPromiseAll = await Promise.all(values.map(async (n) => n * 2));
        expect(viaMapAsync).toEqual(viaPromiseAll);
      }),
    );
  });

  it('never runs more than `concurrency` calls at once', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer(), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 1, max: 5 }),
        async (values, concurrency) => {
          let concurrent = 0;
          let maxConcurrent = 0;
          await mapAsync(
            values,
            async (n) => {
              concurrent++;
              maxConcurrent = Math.max(maxConcurrent, concurrent);
              await Promise.resolve();
              concurrent--;
              return n;
            },
            concurrency,
          );
          expect(maxConcurrent).toBeLessThanOrEqual(concurrency);
        },
      ),
    );
  });
});

describe('mapAsync — contract', () => {
  it('empty array resolves to []', async () => {
    expect(await mapAsync([], (n: number) => n)).toEqual([]);
  });
});
