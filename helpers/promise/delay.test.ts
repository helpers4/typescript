/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { delay } from "./delay";

describe("delay", () => {
  it("should resolve after specified time", async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeGreaterThanOrEqual(90);
    expect(elapsed).toBeLessThan(200);
  });

  it("should resolve with specified value", async () => {
    const result = await delay(50, "test-value");
    expect(result).toBe("test-value");
  });

  it("should work with numbers", async () => {
    const result = await delay(50, 42);
    expect(result).toBe(42);
  });

  it("should work without value", async () => {
    const result = await delay(50);
    expect(result).toBeUndefined();
  });
});
