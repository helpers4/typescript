/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createSemaphore } from './createSemaphore';

describe('createSemaphore — property-based', () => {
  it('never allows more concurrent holders than permits', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 1, max: 10 }),
        async (permits, taskCount) => {
          const semaphore = createSemaphore(permits);
          let concurrent = 0;
          let maxConcurrent = 0;

          const task = async () => {
            concurrent++;
            maxConcurrent = Math.max(maxConcurrent, concurrent);
            await Promise.resolve();
            concurrent--;
          };

          await Promise.all(Array.from({ length: taskCount }, () => semaphore.run(task)));
          expect(maxConcurrent).toBeLessThanOrEqual(permits);
        },
      ),
    );
  });

  it('availablePermits() never exceeds the original permit count', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 5 }), fc.integer({ min: 0, max: 10 }), async (permits, runs) => {
        const semaphore = createSemaphore(permits);
        await Promise.all(Array.from({ length: runs }, () => semaphore.run(() => Promise.resolve())));
        expect(semaphore.availablePermits()).toBe(permits);
      }),
    );
  });
});

describe('createSemaphore — contract', () => {
  it('a lone acquire()/release() pair leaves availablePermits() unchanged', async () => {
    const semaphore = createSemaphore(3);
    const release = await semaphore.acquire();
    release();
    expect(semaphore.availablePermits()).toBe(3);
  });
});
