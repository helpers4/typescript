/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
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
});
