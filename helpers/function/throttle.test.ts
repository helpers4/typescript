/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
});
