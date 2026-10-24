/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should debounce function calls", () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(callCount).toBe(0);

    vi.advanceTimersByTime(150);
    expect(callCount).toBe(1);
  });

  it("should pass arguments correctly", () => {
    let lastArgs: unknown[] = [];
    const debouncedFunc = debounce((...args: unknown[]) => {
      lastArgs = args;
    }, 50);

    debouncedFunc(1, 'test', true);

    vi.advanceTimersByTime(100);
    expect(lastArgs).toEqual([1, 'test', true]);
  });

  it("should not clear timeout on first call (no previous timeout exists)", () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 50);

    debouncedFunc();
    vi.advanceTimersByTime(100);
    expect(callCount).toBe(1);
  });

  it("should properly cancel previous timeout when called again", () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();
    vi.advanceTimersByTime(150);
    expect(callCount).toBe(1);
  });

  describe("cancellation", () => {
    it("cancel() drops the pending call, and the function still works afterwards", () => {
      const func = vi.fn();
      const throttled = debounce(func, 100);
      throttled();
      throttled();
      throttled.cancel();
      vi.advanceTimersByTime(200);
      const before = func.mock.calls.length;
      throttled();
      vi.advanceTimersByTime(200);
      expect(func.mock.calls.length).toBeGreaterThan(before);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("cancel() does nothing without a pending call", () => {
      const func = vi.fn();
      debounce(func, 100).cancel();
      expect(func).not.toHaveBeenCalled();
    });

    it("an aborted signal drops the pending call and ignores later calls", () => {
      const controller = new AbortController();
      const func = vi.fn();
      const throttled = debounce(func, 100, { signal: controller.signal });
      throttled();
      throttled();
      const before = func.mock.calls.length;
      controller.abort();
      expect(vi.getTimerCount()).toBe(0);
      throttled();
      vi.advanceTimersByTime(200);
      expect(func).toHaveBeenCalledTimes(before);
    });

    it("an already aborted signal makes every call a no-op", () => {
      const func = vi.fn();
      const throttled = debounce(func, 100, { signal: AbortSignal.abort() });
      throttled();
      vi.advanceTimersByTime(200);
      expect(func).not.toHaveBeenCalled();
    });
  });
});
