/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TimeoutError, timeout } from './timeout';

describe('timeout — contract', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fast-resolving promise + long timeout → resolves normally', async () => {
    const p = Promise.resolve('result');
    const result = await timeout(p, 5000);
    expect(result).toBe('result');
    await vi.runAllTimersAsync();
  });

  it('slow promise + short timeout → rejects with TimeoutError', async () => {
    let slowResolve!: (v: string) => void;
    const slow = new Promise<string>(resolve => { slowResolve = resolve; });
    const p = timeout(slow, 100).catch(e => e as unknown);

    await vi.advanceTimersByTimeAsync(100);
    const result = await p;
    expect(result).toBeInstanceOf(TimeoutError);
    // Resolve the slow promise to avoid unhandled state
    slowResolve('late');
    await vi.runAllTimersAsync();
  });

  it('error.name === "TimeoutError"', async () => {
    let slowResolve!: () => void;
    const slow = new Promise<void>(resolve => { slowResolve = resolve; });
    const p = timeout(slow, 50).catch(e => e as unknown);

    await vi.advanceTimersByTimeAsync(50);
    const error = await p;
    expect((error as Error).name).toBe('TimeoutError');
    slowResolve();
    await vi.runAllTimersAsync();
  });

  it('error.message matches "Operation timed out after Xms" pattern', async () => {
    let slowResolve!: () => void;
    const slow = new Promise<void>(resolve => { slowResolve = resolve; });
    const p = timeout(slow, 250).catch(e => e as unknown);

    await vi.advanceTimersByTimeAsync(250);
    const error = await p;
    expect((error as Error).message).toBe('Operation timed out after 250ms');
    slowResolve();
    await vi.runAllTimersAsync();
  });

  it('timer cleared on resolve — no dangling timer after resolution', async () => {
    const fast = Promise.resolve(42);
    const result = await timeout(fast, 5000);
    expect(result).toBe(42);

    // If timer was not cleared, this would fire after
    await vi.runAllTimersAsync();
  });

  it('rejects with the original error if promise rejects before timeout', async () => {
    const failing = Promise.reject(new Error('network error'));
    const p = timeout(failing, 5000);
    await expect(p).rejects.toThrow('network error');
    await vi.runAllTimersAsync();
  });
});
