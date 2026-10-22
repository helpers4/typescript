/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { createMutex } from './createMutex';

describe('createMutex — property-based', () => {
  it('never allows more than one concurrent holder', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 10 }), async (taskCount) => {
        const mutex = createMutex();
        let concurrent = 0;
        let maxConcurrent = 0;

        const task = async () => {
          concurrent++;
          maxConcurrent = Math.max(maxConcurrent, concurrent);
          await Promise.resolve();
          concurrent--;
        };

        await Promise.all(Array.from({ length: taskCount }, () => mutex.run(task)));
        expect(maxConcurrent).toBeLessThanOrEqual(1);
      }),
    );
  });

  it('isLocked() is false after all runs settle', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 0, max: 10 }), async (runs) => {
        const mutex = createMutex();
        await Promise.all(Array.from({ length: runs }, () => mutex.run(() => Promise.resolve())));
        expect(mutex.isLocked()).toBe(false);
      }),
    );
  });
});

describe('createMutex — contract', () => {
  it('a lone acquire()/release() pair leaves isLocked() false', async () => {
    const mutex = createMutex();
    const release = await mutex.acquire();
    release();
    expect(mutex.isLocked()).toBe(false);
  });
});
