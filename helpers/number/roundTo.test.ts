/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { roundTo } from "./roundTo";

describe("roundTo", () => {
  it("should round to specified decimal places", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.14159, 3)).toBe(3.142);
    expect(roundTo(3.14159, 0)).toBe(3);
  });

  it("should handle negative numbers", () => {
    expect(roundTo(-3.14159, 2)).toBe(-3.14);
  });

  it("should handle zero", () => {
    expect(roundTo(0, 2)).toBe(0);
  });

  it("should handle integers", () => {
    expect(roundTo(5, 2)).toBe(5);
  });
});
