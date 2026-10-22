/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { createMutex } from './createMutex';

describe('createMutex', () => {
  it('allows only one holder at a time', async () => {
    const mutex = createMutex();
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 10));
      concurrent--;
    };

    await Promise.all([mutex.run(task), mutex.run(task), mutex.run(task)]);

    expect(maxConcurrent).toBe(1);
  });

  it('queues excess acquire() callers in FIFO order', async () => {
    const mutex = createMutex();
    const order: number[] = [];

    const release0 = await mutex.acquire();
    const p1 = mutex.acquire().then((release) => {
      order.push(1);
      return release;
    });
    const p2 = mutex.acquire().then((release) => {
      order.push(2);
      return release;
    });

    release0();
    const release1 = await p1;
    release1();
    await p2;

    expect(order).toEqual([1, 2]);
  });

  it('run() releases the lock even if fn throws', async () => {
    const mutex = createMutex();

    await expect(
      mutex.run(() => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(mutex.isLocked()).toBe(false);
  });

  it('isLocked() reflects held/released state', async () => {
    const mutex = createMutex();
    expect(mutex.isLocked()).toBe(false);

    const release = await mutex.acquire();
    expect(mutex.isLocked()).toBe(true);

    release();
    expect(mutex.isLocked()).toBe(false);
  });

  it('a release function throws RangeError when called twice', async () => {
    const mutex = createMutex();
    const release = await mutex.acquire();
    release();
    expect(() => release()).toThrow(RangeError);
  });

  it('double-releasing the same lock cannot corrupt a contended mutex', async () => {
    const mutex = createMutex();
    const releaseA = await mutex.acquire();
    let bHeld = false;
    const pB = mutex.acquire().then((release) => {
      bHeld = true;
      return release;
    });

    releaseA();
    await pB;
    expect(bHeld).toBe(true);
    expect(() => releaseA()).toThrow(RangeError);
  });

  it('run() returns the value produced by fn', async () => {
    const mutex = createMutex();
    const result = await mutex.run(() => 42);
    expect(result).toBe(42);
  });

  it('deduplicates concurrent callers around a shared resource', async () => {
    const mutex = createMutex();
    let refreshCount = 0;
    let cached: string | undefined;

    const getToken = () =>
      mutex.run(async () => {
        if (cached) return cached;
        refreshCount++;
        await new Promise((r) => setTimeout(r, 5));
        cached = 'token';
        return cached;
      });

    const results = await Promise.all([getToken(), getToken(), getToken()]);

    expect(results).toEqual(['token', 'token', 'token']);
    expect(refreshCount).toBe(1);
  });
});
