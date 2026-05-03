/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { defer } from './defer';

describe('defer', () => {
  it('returns the resolved value of the main function', async () => {
    const result = await defer(async () => 42);
    expect(result).toBe(42);
  });

  it('calls a single deferred callback after the main function', async () => {
    const log: string[] = [];
    await defer(async (d) => {
      d(() => log.push('cleanup'));
      log.push('work');
    });
    expect(log).toEqual(['work', 'cleanup']);
  });

  it('calls multiple callbacks in LIFO order', async () => {
    const log: string[] = [];
    await defer(async (d) => {
      d(() => log.push('first'));
      d(() => log.push('second'));
      d(() => log.push('third'));
    });
    expect(log).toEqual(['third', 'second', 'first']);
  });

  it('runs callbacks even when the main function throws', async () => {
    const log: string[] = [];
    await expect(
      defer(async (d) => {
        d(() => log.push('cleanup'));
        throw new Error('oops');
      }),
    ).rejects.toThrow('oops');
    expect(log).toContain('cleanup');
  });

  it('re-throws the original error after running callbacks', async () => {
    const error = new Error('fail');
    await expect(
      defer(async (d) => {
        d(() => {});
        throw error;
      }),
    ).rejects.toBe(error);
  });

  it('passes the error to callbacks when main function throws', async () => {
    const receivedErrors: unknown[] = [];
    const error = new Error('boom');
    await expect(
      defer(async (d) => {
        d((err) => receivedErrors.push(err));
        throw error;
      }),
    ).rejects.toThrow();
    expect(receivedErrors[0]).toBe(error);
  });

  it('passes undefined to callbacks when main function succeeds', async () => {
    const receivedErrors: unknown[] = [];
    await defer(async (d) => {
      d((err) => receivedErrors.push(err));
    });
    expect(receivedErrors[0]).toBeUndefined();
  });

  it('awaits async deferred callbacks', async () => {
    const log: string[] = [];
    await defer(async (d) => {
      d(async () => {
        await Promise.resolve();
        log.push('async-cleanup');
      });
      log.push('work');
    });
    expect(log).toEqual(['work', 'async-cleanup']);
  });

  it('works with no deferred callbacks', async () => {
    const result = await defer(async () => 'hello');
    expect(result).toBe('hello');
  });

  it('runs all callbacks even when main function does not await anything', async () => {
    const spy = vi.fn();
    await defer(async (d) => {
      d(spy);
      d(spy);
    });
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
