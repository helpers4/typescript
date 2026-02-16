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

  it("should handle v prefix in ranges", () => {
    expect(satisfiesRange("v1.2.3", "^v1.0.0")).toBe(true);
    expect(satisfiesRange("1.2.3", "^v1.0.0")).toBe(true);
    expect(satisfiesRange("v1.2.3", "^1.0.0")).toBe(true);
  });

  it("should handle three-part version comparisons", () => {
    expect(satisfiesRange("1.2.5", ">=1.2.3")).toBe(true);
    expect(satisfiesRange("1.2.3", ">=1.2.3")).toBe(true);
    expect(satisfiesRange("1.2.2", ">=1.2.3")).toBe(false);
  });

  it("should handle with minor version 0", () => {
    expect(satisfiesRange("1.0.5", "~1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "~1.0.0")).toBe(true);
    expect(satisfiesRange("1.1.0", "~1.0.0")).toBe(false);
  });

  it("should return false for unrecognized range format", () => {
    expect(satisfiesRange("1.2.3", "invalid-range")).toBe(false);
  });

  it("should handle caret ranges with different patch levels", () => {
    expect(satisfiesRange("1.0.5", "^1.0.0")).toBe(true);
    expect(satisfiesRange("1.5.0", "^1.0.0")).toBe(true);
    expect(satisfiesRange("1.99.99", "^1.0.0")).toBe(true);
  });

  it("should handle tilde ranges with different patch levels", () => {
    expect(satisfiesRange("1.2.1", "~1.2.0")).toBe(true);
    expect(satisfiesRange("1.2.99", "~1.2.0")).toBe(true);
    expect(satisfiesRange("1.2.0", "~1.2.0")).toBe(true);
  });

  it("should handle version with missing patch", () => {
    expect(satisfiesRange("1.2", ">=1.0")).toBe(true);
    expect(satisfiesRange("1.0", "^1.0")).toBe(true);
  });

  it("should handle invalid range formats", () => {
    expect(satisfiesRange("1.2.3", "invalid-range")).toBe(false);
    expect(satisfiesRange("1.0.0", "!!1.0.0")).toBe(false);
    expect(satisfiesRange("1.0.0", "@1.0.0")).toBe(false);
    // Test format that has an operator character but no valid prefix (=> unsupported range format)
    expect(satisfiesRange("1.0.0", "~")).toBe(false);
    expect(satisfiesRange("1.0.0", "=1.0.0")).toBe(false);  // '=' alone is not '>=', '<=', or exact match
  });
});
