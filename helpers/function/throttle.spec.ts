/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { throttle } from './throttle';

describe('throttle — contract', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('first call executes immediately', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('second call within wait window is not immediately executed', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('first');
    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(50);
    throttled('second');
    expect(fn).toHaveBeenCalledTimes(1); // not yet
  });

  it('after wait elapses, the trailing call is executed', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('first');
    vi.advanceTimersByTime(50);
    throttled('second');
    vi.advanceTimersByTime(50); // total 100ms after 'second'
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });

  it('multiple calls within wait → only first and last (trailing) execute', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('a');
    vi.advanceTimersByTime(20);
    throttled('b');
    vi.advanceTimersByTime(20);
    throttled('c'); // this replaces b in the trailing slot
    vi.advanceTimersByTime(100);

    // 'a' fires immediately; 'b' and 'c' compete for trailing slot, 'c' wins
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'a');
  });

  it('allows calling again after full wait period', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('first');
    vi.advanceTimersByTime(100);
    throttled('second');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 'second');
  });

  it('passes arguments correctly to the underlying function', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(1, 2, 3);
    expect(fn).toHaveBeenCalledWith(1, 2, 3);
  });
});
