/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { validatePositiveCount } from '../_shared/_validatePositiveCount.js';

/** Releases the permit this specific function was issued for. @ignore */
type Release = () => void;

/** A semaphore created by {@link createSemaphore}. */
export interface Semaphore {
  /**
   * Acquires a permit, waiting in FIFO order if none is currently available. Resolves to a
   * one-shot function that releases *this specific* permit.
   *
   * A bare counter (`release(): void` with no token) can't tell "the caller who acquired this
   * permit is releasing it" apart from "an unrelated caller already released once and is doing
   * it again" once another holder or queued waiter exists — the second case would silently
   * manufacture an extra permit. Returning a per-acquisition function instead means each one
   * tracks its own already-released state, so calling it twice is always caught, regardless of
   * what else is going on.
   *
   * The returned function is a plain, transferable closure, not bound to the caller that
   * acquired it — passing it to unrelated code means that code can release the permit at a
   * time you don't control. {@link run} avoids this by construction (only ever released once,
   * internally, right after `fn` settles).
   */
  acquire(): Promise<Release>;
  /**
   * Acquires a permit, runs `fn`, and releases the permit afterwards — even if `fn` throws.
   * Prefer this over manual {@link acquire} + release-function pairs, since it can't leak a
   * permit by forgetting to call the release function on an error path.
   */
  run<T>(fn: () => T | Promise<T>): Promise<T>;
  /** Number of permits currently available (not held). */
  availablePermits(): number;
}

/**
 * Creates a semaphore limiting concurrent access to `permits` holders at a time, queueing
 * excess `acquire()` callers in FIFO order (first to call `acquire` is first granted a
 * permit when one frees up).
 *
 * A factory function rather than a class, matching this package's other stateful helpers
 * (`debounce`, `throttle`): the returned object closes over its internal queue/counter.
 *
 * Use for concurrency limiting, e.g. rate-limiting calls to an external API. For
 * mutual-exclusion (at most one holder), see {@link createMutex}, which is a semaphore
 * with one permit.
 * @param permits - Maximum number of concurrent holders. Must be `>= 1` (`Infinity` is
 *   accepted, for an effectively uncapped semaphore); a non-integer is floored (`2.9`
 *   behaves as `2`).
 * @returns A {@link Semaphore}
 * @example
 * const semaphore = createSemaphore(2); // at most 2 concurrent API calls
 * await Promise.all(urls.map((url) => semaphore.run(() => fetch(url))));
 * @example
 * const release = await semaphore.acquire();
 * try {
 *   await doWork();
 * } finally {
 *   release(); // throws if called again
 * }
 * @since 3.0.4
 */
export function createSemaphore(permits: number): Semaphore {
  const totalPermits = validatePositiveCount(permits, 'createSemaphore: permits');

  let available = totalPermits;
  // Head-index queue instead of shift()-based: shift() re-indexes every remaining element
  // (O(n) per call, O(n²) draining a long queue) — under heavy contention (many more callers
  // than permits) that adds up. Advancing `queueHead` is O(1); the array is only compacted
  // once consumed slots build up, so the amortized cost per call stays O(1).
  let queue: (() => void)[] = [];
  let queueHead = 0;

  function enqueue(waiter: () => void): void {
    queue.push(waiter);
  }

  function dequeue(): (() => void) | undefined {
    if (queueHead >= queue.length) return undefined;
    const waiter = queue[queueHead];
    queue[queueHead] = undefined as unknown as () => void; // drop the reference for GC
    queueHead++;
    if (queueHead > 16 && queueHead * 2 >= queue.length) {
      queue = queue.slice(queueHead);
      queueHead = 0;
    }
    return waiter;
  }

  function createRelease(): Release {
    let released = false;
    return () => {
      if (released) {
        throw new RangeError('Semaphore: this permit was already released');
      }
      released = true;
      available++;
      const next = dequeue();
      if (next) next();
    };
  }

  function acquire(): Promise<Release> {
    if (available > 0) {
      available--;
      return Promise.resolve(createRelease());
    }
    return new Promise<Release>((resolve) => {
      enqueue(() => {
        available--;
        resolve(createRelease());
      });
    });
  }

  async function run<T>(fn: () => T | Promise<T>): Promise<T> {
    const release = await acquire();
    try {
      return await fn();
    } finally {
      release();
    }
  }

  return { acquire, run, availablePermits: () => available };
}
