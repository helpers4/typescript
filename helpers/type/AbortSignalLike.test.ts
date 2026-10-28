/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { delay } from '../promise/delay';
import { retry } from '../promise/retry';
import type { AbortSignalLike } from './AbortSignalLike';

/** The four members and nothing else, as a runtime without `AbortController` would write it. */
function handMadeSignal() {
  const listeners = new Set<() => void>();
  const signal = {
    aborted: false,
    reason: undefined as unknown,
    addEventListener: (_type: 'abort', listener: () => void) => void listeners.add(listener),
    removeEventListener: (_type: 'abort', listener: () => void) => void listeners.delete(listener),
  };
  return {
    signal: signal satisfies AbortSignalLike,
    listenerCount: () => listeners.size,
    abort(reason: unknown) {
      signal.aborted = true;
      signal.reason = reason;
      for (const listener of listeners) listener();
    },
  };
}

describe('AbortSignalLike', () => {
  it('accepts a real AbortSignal', async () => {
    const real: AbortSignalLike = new AbortController().signal;
    expect(await delay(1, 'done', { signal: real })).toBe('done');
    const timeoutSignal: AbortSignalLike = AbortSignal.timeout(1000);
    expect(timeoutSignal.aborted).toBe(false);
  });

  it('accepts an object with only the four members, which cancels a delay', async () => {
    const { signal, abort, listenerCount } = handMadeSignal();
    const pending = delay(10_000, 'late', { signal });
    expect(listenerCount()).toBe(1);
    abort(new Error('stop'));
    await expect(pending).rejects.toThrow('stop');
    expect(listenerCount()).toBe(0);
  });

  it('removes its listener once the work ends on its own', async () => {
    const { signal, listenerCount } = handMadeSignal();
    await delay(1, undefined, { signal });
    expect(listenerCount()).toBe(0);
  });

  it('stops a retry loop that is waiting between attempts', async () => {
    const { signal, abort } = handMadeSignal();
    const attempt = retry(() => Promise.reject(new Error('nope')), { attempts: 5, delayMs: 10_000, signal });
    setTimeout(() => abort(new Error('enough')), 5);
    await expect(attempt).rejects.toThrow('enough');
  });

  it('is already aborted when the flag is set before the call', async () => {
    const { signal, abort } = handMadeSignal();
    abort(new Error('before'));
    await expect(delay(10, 'x', { signal })).rejects.toThrow('before');
  });
});
