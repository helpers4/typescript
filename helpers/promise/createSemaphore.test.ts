/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { createSemaphore } from './createSemaphore';

describe('createSemaphore', () => {
  it('allows up to `permits` concurrent holders', async () => {
    const semaphore = createSemaphore(2);
    let concurrent = 0;
    let maxConcurrent = 0;

    const task = async () => {
      concurrent++;
      maxConcurrent = Math.max(maxConcurrent, concurrent);
      await new Promise((r) => setTimeout(r, 10));
      concurrent--;
    };

    await Promise.all([semaphore.run(task), semaphore.run(task), semaphore.run(task)]);

    expect(maxConcurrent).toBe(2);
  });

  it('queues excess acquire() callers in FIFO order', async () => {
    const semaphore = createSemaphore(1);
    const order: number[] = [];

    const release0 = await semaphore.acquire();
    const p1 = semaphore.acquire().then((release) => {
      order.push(1);
      return release;
    });
    const p2 = semaphore.acquire().then((release) => {
      order.push(2);
      return release;
    });
    const p3 = semaphore.acquire().then((release) => {
      order.push(3);
      return release;
    });

    release0();
    const release1 = await p1;
    release1();
    const release2 = await p2;
    release2();
    await p3;

    expect(order).toEqual([1, 2, 3]);
  });

  it('run() releases the permit even if fn throws', async () => {
    const semaphore = createSemaphore(1);

    await expect(
      semaphore.run(() => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(semaphore.availablePermits()).toBe(1);
  });

  it('availablePermits() reflects held/released permits', async () => {
    const semaphore = createSemaphore(2);
    expect(semaphore.availablePermits()).toBe(2);

    const release = await semaphore.acquire();
    expect(semaphore.availablePermits()).toBe(1);

    release();
    expect(semaphore.availablePermits()).toBe(2);
  });

  it('a release function throws RangeError when called twice', async () => {
    const semaphore = createSemaphore(1);
    const release = await semaphore.acquire();
    release();
    expect(() => release()).toThrow(RangeError);
  });

  it('double-releasing the same permit cannot corrupt a contended semaphore', async () => {
    // Regression test: a bare counter can't distinguish "the original holder released twice"
    // from "a different, legitimate waiter released" once there's contention — this is exactly
    // that scenario, and the fix is that each acquire() gets its own one-shot release function.
    const semaphore = createSemaphore(1);
    const releaseA = await semaphore.acquire();
    let bHeld = false;
    let cHeld = false;
    const pB = semaphore.acquire().then((release) => {
      bHeld = true;
      return release;
    });
    void semaphore.acquire().then((release) => {
      cHeld = true;
      return release;
    });

    releaseA();
    await pB;
    expect(bHeld).toBe(true);
    expect(cHeld).toBe(false);

    expect(() => releaseA()).toThrow(RangeError);
    expect(cHeld).toBe(false);
  });

  it('throws RangeError for non-positive permits', () => {
    expect(() => createSemaphore(0)).toThrow(RangeError);
    expect(() => createSemaphore(-1)).toThrow(RangeError);
    expect(() => createSemaphore(Number.NaN)).toThrow(RangeError);
  });

  it('floors a non-integer permits count', async () => {
    const semaphore = createSemaphore(2.9);
    expect(semaphore.availablePermits()).toBe(2);
  });

  it('run() returns the value produced by fn', async () => {
    const semaphore = createSemaphore(1);
    const result = await semaphore.run(() => 42);
    expect(result).toBe(42);
  });

  it('drains a long queue correctly (exercises internal queue compaction)', async () => {
    const semaphore = createSemaphore(1);
    const order: number[] = [];
    const holdFirst = await semaphore.acquire();

    const waiters = Array.from({ length: 50 }, (_, i) =>
      semaphore.run(() => {
        order.push(i);
      }),
    );

    holdFirst();
    await Promise.all(waiters);

    expect(order).toEqual(Array.from({ length: 50 }, (_, i) => i));
    expect(semaphore.availablePermits()).toBe(1);
  });

  describe('with a signal', () => {
    it('rejects at once with the reason of an already aborted signal, taking no permit', async () => {
      const semaphore = createSemaphore(1);
      await expect(semaphore.acquire({ signal: AbortSignal.abort('gone') })).rejects.toBe('gone');
      expect(semaphore.availablePermits()).toBe(1);
    });

    it('leaves the queue when aborted, so the next waiter gets the permit', async () => {
      const semaphore = createSemaphore(1);
      const release = await semaphore.acquire();
      const controller = new AbortController();
      const aborted = semaphore.acquire({ signal: controller.signal });
      const next = semaphore.acquire();
      controller.abort('stop');
      await expect(aborted).rejects.toBe('stop');
      release();
      const releaseNext = await next;
      expect(semaphore.availablePermits()).toBe(0);
      releaseNext();
      expect(semaphore.availablePermits()).toBe(1);
    });

    it('lets go of the signal once the permit is granted', async () => {
      const semaphore = createSemaphore(1);
      const release = await semaphore.acquire();
      const controller = new AbortController();
      const remove = vi.spyOn(controller.signal, 'removeEventListener');
      const waiting = semaphore.acquire({ signal: controller.signal });
      release();
      const releaseWaiting = await waiting;
      expect(remove).toHaveBeenCalledOnce();
      controller.abort();
      releaseWaiting();
      expect(semaphore.availablePermits()).toBe(1);
    });

    it('run() does not call fn when aborted while waiting', async () => {
      const semaphore = createSemaphore(1);
      const release = await semaphore.acquire();
      const controller = new AbortController();
      const fn = vi.fn();
      const running = semaphore.run(fn, { signal: controller.signal });
      controller.abort('stop');
      await expect(running).rejects.toBe('stop');
      release();
      expect(fn).not.toHaveBeenCalled();
    });
  });
});
