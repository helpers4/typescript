/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { throttle } from "./throttle";

describe("throttle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should throttle function calls", () => {
    let callCount = 0;
    const throttledFunc = throttle(() => callCount++, 100);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(callCount).toBe(1);

    vi.advanceTimersByTime(150);
    expect(callCount).toBe(2);
  });

  it("should pass arguments correctly", () => {
    let lastArgs: any[] = [];
    const throttledFunc = throttle((...args: any[]) => {
      lastArgs = args;
    }, 50);

    throttledFunc(1, 'test', true);
    expect(lastArgs).toEqual([1, 'test', true]);
  });

  it("should invoke immediately when called exactly at the wait boundary", () => {
    let callCount = 0;
    const wait = 50;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc();
    expect(callCount).toBe(1);

    // Advance exactly the throttle duration then call again
    vi.advanceTimersByTime(wait);
    throttledFunc();
    expect(callCount).toBe(2);
  });

  it("should schedule trailing call with correct remaining delay", () => {
    let callCount = 0;
    const wait = 100;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc(); // Immediate call
    expect(callCount).toBe(1);

    // Call again quickly (after 30ms, well within the wait window)
    vi.advanceTimersByTime(30);
    throttledFunc();
    expect(callCount).toBe(1); // Still throttled

    // The trailing call should fire after the remaining ~70ms
    vi.advanceTimersByTime(70);
    expect(callCount).toBe(2);
  });
});
