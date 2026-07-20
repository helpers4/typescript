/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { forEachAsync } from './forEachAsync';

describe('forEachAsync — property-based', () => {
  it('calls fn exactly once per item', async () => {
    await fc.assert(
      fc.asyncProperty(fc.array(fc.integer(), { maxLength: 10 }), async (values) => {
        let calls = 0;
        await forEachAsync(values, async () => {
          calls++;
        });
        expect(calls).toBe(values.length);
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
          await forEachAsync(
            values,
            async () => {
              concurrent++;
              maxConcurrent = Math.max(maxConcurrent, concurrent);
              await Promise.resolve();
              concurrent--;
            },
            concurrency,
          );
          expect(maxConcurrent).toBeLessThanOrEqual(concurrency);
        },
      ),
    );
  });
});

describe('forEachAsync — contract', () => {
  it('resolves to undefined for an empty array', async () => {
    expect(await forEachAsync([], () => {})).toBeUndefined();
  });
});
