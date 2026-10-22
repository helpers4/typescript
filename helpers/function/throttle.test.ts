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

  // --- Mutation-killing tests ---

  // L23: now - lastCallTime >= wait -> now - lastCallTime > wait
  // If >, calling exactly at the wait boundary would NOT fire immediately
  it("should fire immediately when called exactly at the wait boundary (>= not >)", () => {
    let callCount = 0;
    const wait = 100;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc(); // t=0, fires immediately
    expect(callCount).toBe(1);

    vi.advanceTimersByTime(100); // t=100, exactly at boundary
    throttledFunc(); // Should fire immediately with >=, not with >
    expect(callCount).toBe(2);
  });

  // L31: wait - (now - lastCallTime) -> wait + (now - lastCallTime) (ArithmeticOperator)
  // If +, the timeout delay would be wait + elapsed instead of wait - elapsed
  it("should use correct remaining delay for trailing call (subtraction not addition)", () => {
    let callCount = 0;
    const wait = 100;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc(); // t=0, fires immediately
    expect(callCount).toBe(1);

    vi.advanceTimersByTime(60); // t=60
    throttledFunc(); // Schedules trailing at wait - 60 = 40ms
    expect(callCount).toBe(1);

    // With subtraction: fires at 60+40=100ms
    // With addition: would fire at 60+160=220ms
    vi.advanceTimersByTime(40); // t=100
    expect(callCount).toBe(2); // Should fire now with correct delay
  });
});
