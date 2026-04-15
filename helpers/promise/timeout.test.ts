/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
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
});
