/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  it("should debounce function calls", async () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(callCount).toBe(0);

    await new Promise(resolve => setTimeout(resolve, 150));
    expect(callCount).toBe(1);
  });

  it("should pass arguments correctly", async () => {
    let lastArgs: any[] = [];
    const debouncedFunc = debounce((...args: any[]) => {
      lastArgs = args;
    }, 50);

    debouncedFunc(1, 'test', true);

    await new Promise(resolve => setTimeout(resolve, 100));
    expect(lastArgs).toEqual([1, 'test', true]);
  });

  // --- Mutation-killing tests ---

  // L20: ConditionalExpression -> true (if (timeoutId) always true)
  // If true, the first call would try to clearTimeout(null) and then set new timeout
  // This means the function would never fire because clearTimeout(null) is a no-op
  // but the behavior might be subtly different
  it("should not clear timeout on first call (no previous timeout exists)", async () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 50);

    // Single call should work
    debouncedFunc();
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(callCount).toBe(1);
  });

  it("should properly cancel previous timeout when called again", async () => {
    let callCount = 0;
    const debouncedFunc = debounce(() => callCount++, 100);

    debouncedFunc(); // First call sets timeout
    await new Promise(resolve => setTimeout(resolve, 50));
    debouncedFunc(); // Should cancel first and set new timeout
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(callCount).toBe(1); // Only the second timeout fires
  });
});
