/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi } from 'vitest';
import { TimeoutError, timeout } from './timeout';

describe('timeout', () => {
  it('should resolve if promise completes before timeout', async () => {
    const result = await timeout(Promise.resolve('done'), 100);
    expect(result).toBe('done');
  });

  it('should reject with TimeoutError if promise exceeds timeout', async () => {
    const slow = new Promise<string>(r => setTimeout(() => r('done'), 200));
    await expect(timeout(slow, 20)).rejects.toThrow(TimeoutError);
  });

  it('should include duration in TimeoutError message', async () => {
    const slow = new Promise<string>(r => setTimeout(() => r('done'), 200));
    await expect(timeout(slow, 50)).rejects.toThrow('Operation timed out after 50ms');
  });

  it('should preserve the original rejection if it happens before timeout', async () => {
    const failing = Promise.reject(new Error('original error'));
    await expect(timeout(failing, 100)).rejects.toThrow('original error');
  });

  it('should work with numeric results', async () => {
    const result = await timeout(Promise.resolve(42), 100);
    expect(result).toBe(42);
  });

  it('should work with object results', async () => {
    const result = await timeout(Promise.resolve({ key: 'value' }), 100);
    expect(result).toEqual({ key: 'value' });
  });

  it('TimeoutError should have correct name', async () => {
    const slow = new Promise<void>(r => setTimeout(r, 200));
    try {
      await timeout(slow, 10);
      expect.unreachable('Should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(TimeoutError);
      expect((error as TimeoutError).name).toBe('TimeoutError');
    }
  });

  it('TimeoutError should extend Error', () => {
    const err = new TimeoutError(100);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(TimeoutError);
  });

  describe('with a signal', () => {
    it('rejects at once with the reason of an already aborted signal, without a timer', async () => {
      vi.useFakeTimers();
      try {
        const promise = timeout(new Promise(() => {}), 100, { signal: AbortSignal.abort('gone') });
        expect(vi.getTimerCount()).toBe(0);
        await expect(promise).rejects.toBe('gone');
      } finally {
        vi.useRealTimers();
      }
    });

    it('clears the timer of a promise that never settles when aborted', async () => {
      vi.useFakeTimers();
      try {
        const controller = new AbortController();
        const promise = timeout(new Promise(() => {}), 100, { signal: controller.signal });
        expect(vi.getTimerCount()).toBe(1);
        controller.abort('stop');
        expect(vi.getTimerCount()).toBe(0);
        await expect(promise).rejects.toBe('stop');
      } finally {
        vi.useRealTimers();
      }
    });

    it('lets go of the signal once the promise settles or times out', async () => {
      const controller = new AbortController();
      const remove = vi.spyOn(controller.signal, 'removeEventListener');
      await timeout(Promise.resolve('done'), 100, { signal: controller.signal });
      await timeout(Promise.reject(new Error('fail')), 100, { signal: controller.signal }).catch(() => {});
      await timeout(new Promise(() => {}), 1, { signal: controller.signal }).catch(() => {});
      expect(remove).toHaveBeenCalledTimes(3);
    });
  });
});
