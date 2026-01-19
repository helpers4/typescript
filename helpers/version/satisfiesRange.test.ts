/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { satisfiesRange } from "./satisfiesRange";

describe("satisfiesRange", () => {
  it("should handle exact matches", () => {
    expect(satisfiesRange("1.0.0", "1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "1.0.1")).toBe(false);
    expect(satisfiesRange("v1.0.0", "1.0.0")).toBe(true);
  });

  it("should handle >= operator", () => {
    expect(satisfiesRange("1.0.1", ">=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", ">=1.0.0")).toBe(true);
    expect(satisfiesRange("0.9.9", ">=1.0.0")).toBe(false);
  });

  it("should handle > operator", () => {
    expect(satisfiesRange("1.0.1", ">1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", ">1.0.0")).toBe(false);
  });

  it("should handle <= operator", () => {
    expect(satisfiesRange("0.9.9", "<=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "<=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.1", "<=1.0.0")).toBe(false);
  });

  it("should handle < operator", () => {
    expect(satisfiesRange("0.9.9", "<1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "<1.0.0")).toBe(false);
  });

  it("should handle caret ranges", () => {
    expect(satisfiesRange("1.2.3", "^1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "^1.0.0")).toBe(true);
    expect(satisfiesRange("2.0.0", "^1.0.0")).toBe(false);
    expect(satisfiesRange("0.9.9", "^1.0.0")).toBe(false);
  });

  it("should handle tilde ranges", () => {
    expect(satisfiesRange("1.2.4", "~1.2.0")).toBe(true);
    expect(satisfiesRange("1.2.0", "~1.2.0")).toBe(true);
    expect(satisfiesRange("1.3.0", "~1.2.0")).toBe(false);
    expect(satisfiesRange("1.1.9", "~1.2.0")).toBe(false);
  });
});
