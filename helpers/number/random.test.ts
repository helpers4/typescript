/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { randomBetween, randomIntBetween } from "./random";

describe("randomBetween", () => {
  it("should generate number within range", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomBetween(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  it("should handle same min and max", () => {
    const result = randomBetween(5, 5);
    expect(result).toBe(5);
  });
});

describe("randomIntBetween", () => {
  it("should generate integer within range", () => {
    for (let i = 0; i < 100; i++) {
      const result = randomIntBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it("should handle same min and max", () => {
    const result = randomIntBetween(5, 5);
    expect(result).toBe(5);
  });

  // --- Mutation-killing tests ---

  // L24: Math.random() * (max - min + 1) -> Math.random() / (max - min + 1)
  // If division, result would always be close to min (near 0)
  it("should generate integers across entire range not just near min", () => {
    const results = new Set<number>();
    // Run many iterations to statistically cover the range
    for (let i = 0; i < 1000; i++) {
      results.add(randomIntBetween(1, 3));
    }
    // With proper multiplication, all values 1, 2, 3 should appear
    // With division, only 1 would appear (0.something / 4 + 1 ≈ 1)
    expect(results.has(1)).toBe(true);
    expect(results.has(2)).toBe(true);
    expect(results.has(3)).toBe(true);
  });
});
