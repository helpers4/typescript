/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { retry } from './retry';

describe('retry — property-based', () => {
  it('if fn always succeeds, returns the correct value', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer(),
        fc.integer({ min: 1, max: 5 }),
        async (value: number, maxAttempts: number) => {
          const result = await retry(() => Promise.resolve(value), maxAttempts, 0);
          expect(result).toBe(value);
        },
      ),
    );
  });

  it('if fn always fails, throws after maxAttempts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 4 }),
        async (maxAttempts: number) => {
          let count = 0;
          const err = new Error('always fails');
          await expect(
            retry(async () => { count++; throw err; }, maxAttempts, 0),
          ).rejects.toThrow('always fails');
          expect(count).toBe(maxAttempts);
        },
      ),
    );
  });
});

describe('retry — contract', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('succeeds on 1st attempt', async () => {
    const p = retry(() => Promise.resolve('ok'), 3, 0);
    await vi.runAllTimersAsync();
    expect(await p).toBe('ok');
  });

  it('succeeds on 3rd attempt of 3', async () => {
    let attempts = 0;
    const p = retry(async () => {
      attempts++;
      if (attempts < 3) throw new Error('not yet');
      return 'done';
    }, 3, 0);
    await vi.runAllTimersAsync();
    expect(await p).toBe('done');
    expect(attempts).toBe(3);
  });

  it('fails all 3 attempts → throws last error', async () => {
    let attempts = 0;
    const p = retry(async () => {
      attempts++;
      throw new Error(`attempt ${attempts}`);
    }, 3, 0).catch(e => e as Error);
    await vi.runAllTimersAsync();
    const err = await p;
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('attempt 3');
    expect(attempts).toBe(3);
  });

  it('maxAttempts=1 → single attempt, throws immediately', async () => {
    let attempts = 0;
    const p = retry(async () => { attempts++; throw new Error('fail'); }, 1, 0).catch(e => e as Error);
    await vi.runAllTimersAsync();
    const err = await p;
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe('fail');
    expect(attempts).toBe(1);
  });
});

describe('retry — options, property-based', () => {
  it('never calls fn more than `attempts` times, and stops at the first non-retryable error', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 6 }),
        fc.integer({ min: 1, max: 8 }),
        async (attempts: number, fatalAt: number) => {
          let count = 0;
          await expect(
            retry(
              async () => { count++; throw new Error(count >= fatalAt ? 'fatal' : 'transient'); },
              { attempts, delayMs: 0, shouldRetry: (error) => (error as Error).message === 'transient' },
            ),
          ).rejects.toThrow();
          expect(count).toBe(Math.min(attempts, fatalAt));
        },
      ),
    );
  });

  it('calls the delay function once per retry, with increasing attempt numbers', async () => {
    await fc.assert(
      fc.asyncProperty(fc.integer({ min: 1, max: 6 }), async (attempts: number) => {
        const seen: number[] = [];
        await expect(
          retry(async () => { throw new Error('fail'); }, {
            attempts,
            delayMs: (attempt) => { seen.push(attempt); return 0; },
          }),
        ).rejects.toThrow('fail');
        expect(seen).toEqual(Array.from({ length: attempts - 1 }, (_, i) => i + 1));
      }),
    );
  });
});

describe('retry — options, contract', () => {
  it('rethrows non-Error rejections as-is', async () => {
    const reason = { code: 42 };
    await expect(retry(() => Promise.reject(reason), { attempts: 2, delayMs: 0 })).rejects.toBe(reason);
  });

  it('catches a synchronous throw from fn', async () => {
    let attempts = 0;
    const result = await retry(() => {
      attempts++;
      if (attempts < 2) throw new Error('sync');
      return Promise.resolve('ok');
    }, { delayMs: 0 });
    expect(result).toBe('ok');
  });

  it('propagates an error thrown by shouldRetry', async () => {
    await expect(
      retry(() => Promise.reject(new Error('fail')), {
        delayMs: 0,
        shouldRetry: () => { throw new Error('predicate'); },
      }),
    ).rejects.toThrow('predicate');
  });
});

