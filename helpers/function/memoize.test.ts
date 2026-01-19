/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { memoize } from "./memoize";

describe("memoize", () => {
  it("should memoize function results", () => {
    let callCount = 0;
    const expensiveFunc = memoize((x: number) => {
      callCount++;
      return x * x;
    });

    expect(expensiveFunc(5)).toBe(25);
    expect(expensiveFunc(5)).toBe(25);
    expect(callCount).toBe(1);
  });

  it("should work with multiple arguments", () => {
    let callCount = 0;
    const add = memoize((a: number, b: number) => {
      callCount++;
      return a + b;
    });

    expect(add(2, 3)).toBe(5);
    expect(add(2, 3)).toBe(5);
    expect(add(3, 2)).toBe(5); // Different args, should compute again
    expect(callCount).toBe(2);
  });
});
