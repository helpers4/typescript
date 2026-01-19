/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { compare } from "./compare";

describe("compare", () => {
  it("should return 0 for equal versions", () => {
    expect(compare("1.0.0", "1.0.0")).toBe(0);
    expect(compare("v1.0.0", "1.0.0")).toBe(0);
  });

  it("should return -1 when first version is lower", () => {
    expect(compare("1.0.0", "1.0.1")).toBe(-1);
    expect(compare("1.0.0", "1.1.0")).toBe(-1);
    expect(compare("1.0.0", "2.0.0")).toBe(-1);
  });

  it("should return 1 when first version is higher", () => {
    expect(compare("1.0.1", "1.0.0")).toBe(1);
    expect(compare("1.1.0", "1.0.0")).toBe(1);
    expect(compare("2.0.0", "1.0.0")).toBe(1);
  });

  it("should handle different lengths", () => {
    expect(compare("1.0", "1.0.0")).toBe(0);
    expect(compare("1.0.1", "1.0")).toBe(1);
    expect(compare("1.0", "1.0.1")).toBe(-1);
  });

  it("should handle v prefix", () => {
    expect(compare("v1.0.0", "v1.0.1")).toBe(-1);
    expect(compare("v2.0.0", "v1.0.0")).toBe(1);
  });
});
