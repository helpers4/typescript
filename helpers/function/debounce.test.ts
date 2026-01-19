/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
});
