/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { whenIdle } from './whenIdle';

describe('whenIdle', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('uses requestIdleCallback with the timeout, and cancels through cancelIdleCallback', () => {
    let scheduled: (() => void) | undefined;
    const requestIdleCallback = vi.fn((callback: () => void) => { scheduled = callback; return 42; });
    const cancelIdleCallback = vi.fn();
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    vi.stubGlobal('cancelIdleCallback', cancelIdleCallback);
    const callback = vi.fn();
    const cancel = whenIdle(callback, { timeout: 500 });
    expect(requestIdleCallback).toHaveBeenCalledWith(expect.any(Function), { timeout: 500 });
    scheduled!();
    expect(callback).toHaveBeenCalledWith();
    cancel();
    expect(cancelIdleCallback).toHaveBeenCalledWith(42);
  });

  it('falls back to setTimeout', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    const callback = vi.fn();
    whenIdle(callback);
    expect(callback).not.toHaveBeenCalled();
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledOnce();
  });

  it('cancels the setTimeout fallback', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    const callback = vi.fn();
    whenIdle(callback)();
    vi.runAllTimers();
    expect(callback).not.toHaveBeenCalled();
  });

  it('cancels through the signal, and lets go of it once the callback ran', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    const controller = new AbortController();
    const callback = vi.fn();
    whenIdle(callback, { signal: controller.signal });
    controller.abort();
    vi.runAllTimers();
    expect(callback).not.toHaveBeenCalled();

    const other = new AbortController();
    const removeOther = vi.spyOn(other.signal, 'removeEventListener');
    whenIdle(callback, { signal: other.signal });
    vi.runAllTimers();
    expect(callback).toHaveBeenCalledOnce();
    expect(removeOther).toHaveBeenCalledOnce();
  });

  it('schedules nothing with an already aborted signal', () => {
    vi.useFakeTimers();
    vi.stubGlobal('requestIdleCallback', undefined);
    const callback = vi.fn();
    const cancel = whenIdle(callback, { signal: AbortSignal.abort() });
    expect(vi.getTimerCount()).toBe(0);
    expect(() => cancel()).not.toThrow();
    expect(callback).not.toHaveBeenCalled();
  });
});
