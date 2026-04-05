/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { throttle } from "./throttle";

describe("throttle", () => {
  it("should throttle function calls", async () => {
    let callCount = 0;
    const throttledFunc = throttle(() => callCount++, 100);

    throttledFunc();
    throttledFunc();
    throttledFunc();

    expect(callCount).toBe(1);

    await new Promise(resolve => setTimeout(resolve, 150));
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

  it("should invoke immediately when called exactly at the wait boundary", async () => {
    let callCount = 0;
    const wait = 50;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc();
    expect(callCount).toBe(1);

    // Wait exactly the throttle duration then call again
    await new Promise(resolve => setTimeout(resolve, wait));
    throttledFunc();
    expect(callCount).toBe(2);
  });

  it("should schedule trailing call with correct remaining delay", async () => {
    let callCount = 0;
    const wait = 100;
    const throttledFunc = throttle(() => callCount++, wait);

    throttledFunc(); // Immediate call
    expect(callCount).toBe(1);

    // Call again quickly (after ~30ms, well within the wait window)
    await new Promise(resolve => setTimeout(resolve, 30));
    throttledFunc();
    expect(callCount).toBe(1); // Still throttled

    // The trailing call should fire after the remaining ~70ms, not after wait+30=130ms
    await new Promise(resolve => setTimeout(resolve, 90));
    expect(callCount).toBe(2);
  });
});
