/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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

  it("treats undefined and null as distinct cache keys", () => {
    let callCount = 0;
    const fn = memoize((x: null | undefined) => {
      callCount++;
      return x;
    });

    fn(null);
    fn(undefined);
    fn(null);
    fn(undefined);

    expect(callCount).toBe(2); // null and undefined must not share a key
  });

  describe("maxSize", () => {
    it("evicts the oldest entry when the limit is reached", () => {
      let callCount = 0;
      const fn = memoize((x: number) => { callCount++; return x * 2; }, { maxSize: 2 });

      expect(fn(1)).toBe(2); // miss — cache: {1:2}, count 1
      expect(fn(2)).toBe(4); // miss — cache: {1:2, 2:4}, count 2
      expect(fn(3)).toBe(6); // miss, evicts 1 — cache: {2:4, 3:6}, count 3
      expect(fn(1)).toBe(2); // miss (evicted), evicts 2 — cache: {3:6, 1:2}, count 4
      expect(fn(3)).toBe(6); // hit — cache: {3:6, 1:2}, count stays 4
      expect(callCount).toBe(4);
    });

    it("with maxSize: 0, nothing is ever cached (every call computes)", () => {
      let callCount = 0;
      const fn = memoize((x: number) => { callCount++; return x; }, { maxSize: 0 });

      expect(fn(1)).toBe(1);
      expect(fn(1)).toBe(1); // no cache — computes again
      expect(callCount).toBe(2);
      expect(fn(2)).toBe(2);
      expect(callCount).toBe(3);
    });

    it("with maxSize: 1 always returns the latest result cached", () => {
      let callCount = 0;
      const fn = memoize((x: number) => { callCount++; return x; }, { maxSize: 1 });

      expect(fn(1)).toBe(1);
      expect(fn(1)).toBe(1); // hit
      expect(callCount).toBe(1);

      expect(fn(2)).toBe(2); // evicts 1
      expect(fn(1)).toBe(1); // miss again
      expect(callCount).toBe(3);
    });
  });
});
