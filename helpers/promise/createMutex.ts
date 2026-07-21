/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { createSemaphore } from './createSemaphore.js';

/** Releases the lock this specific function was issued for. @ignore */
type Release = () => void;

/** A mutex created by {@link createMutex}. */
export interface Mutex {
  /**
   * Acquires the lock, waiting in FIFO order if it is currently held. Resolves to a one-shot
   * function that releases *this specific* acquisition — a per-acquisition function, rather
   * than a bare `release(): void`, is what makes a double-release always catchable, even when
   * another caller legitimately holds or is waiting for the lock (a mutex is a semaphore with
   * one permit, see {@link createSemaphore} for the full rationale). The returned function is a
   * plain, transferable closure — passing it to unrelated code lets that code release the lock
   * at a time you don't control; {@link run} avoids this by construction.
   */
  acquire(): Promise<Release>;
  /**
   * Acquires the lock, runs `fn`, and releases it afterwards — even if `fn` throws. Prefer
   * this over manual {@link acquire} + release-function pairs, since it can't leak the lock by
   * forgetting to call the release function on an error path.
   */
  run<T>(fn: () => T | Promise<T>): Promise<T>;
  /** Whether the lock is currently held. */
  isLocked(): boolean;
}

/**
 * Creates a mutex: a lock allowing at most one holder at a time, queueing excess `acquire()`
 * callers in FIFO order. A {@link createSemaphore} with a single permit.
 *
 * A factory function rather than a class, matching this package's other stateful helpers
 * (`debounce`, `throttle`): the returned object closes over an internal semaphore.
 *
 * Typical use: deduplicating concurrent callers of a non-reentrant operation, e.g. making
 * sure only one in-flight token-refresh call happens at a time while others wait for it.
 * @returns A {@link Mutex}
 * @example
 * const mutex = createMutex();
 * async function getToken() {
 *   return mutex.run(async () => {
 *     if (isTokenValid(cachedToken)) return cachedToken;
 *     cachedToken = await refreshToken(); // only one caller actually refreshes
 *     return cachedToken;
 *   });
 * }
 * @since 3.0.4
 */
export function createMutex(): Mutex {
  const semaphore = createSemaphore(1);
  return {
    acquire: semaphore.acquire,
    run: semaphore.run,
    isLocked: () => semaphore.availablePermits() === 0,
  };
}
