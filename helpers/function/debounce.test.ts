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
});
