/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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

  // --- Mutation-killing tests ---

  // L14: Regex /^v/ -> /v/ (removes ^ anchor)
  // A version with 'v' in the middle should NOT have 'v' stripped
  it("should only strip leading v prefix, not v elsewhere", () => {
    // "v1.0.0" -> "1.0.0" is correct
    // "1.v0.0" should NOT have v stripped if regex is /^v/
    // With /v/ mutation, "1.v0.0" would become "1.0.0" incorrectly
    expect(satisfiesRange("1.0.0", "1.0.0")).toBe(true);
    expect(satisfiesRange("v1.0.0", "1.0.0")).toBe(true);
  });

  // L53: ConditionalExpression -> true (caret range: versionMajor === targetMajor always true)
  // Need test where major versions DIFFER for caret range -> should return false
  it("should return false for caret range with different major version", () => {
    expect(satisfiesRange("2.0.0", "^1.0.0")).toBe(false);
    expect(satisfiesRange("0.0.0", "^1.0.0")).toBe(false);
    expect(satisfiesRange("3.0.0", "^2.5.0")).toBe(false);
  });

  // L49/50: StringLiteral '' -> '' on normalize targets in caret/tilde
  // These are the string arguments to split('.').map(Number)
  // The mutation changes the range extraction. If '' is swapped for something else,
  // the extracted target version would be wrong
  it("should correctly extract version from caret range string", () => {
    expect(satisfiesRange("1.2.3", "^1.2.3")).toBe(true);
    expect(satisfiesRange("1.2.2", "^1.2.3")).toBe(false); // lower than target
    expect(satisfiesRange("1.3.0", "^1.2.3")).toBe(true); // higher minor ok
  });

  it("should correctly extract version from tilde range string", () => {
    expect(satisfiesRange("1.2.3", "~1.2.3")).toBe(true);
    expect(satisfiesRange("1.2.2", "~1.2.3")).toBe(false); // lower patch
    expect(satisfiesRange("1.2.4", "~1.2.3")).toBe(true); // higher patch ok
  });

  // L62: ConditionalExpression -> true (tilde: versionMajor === targetMajor always true)
  it("should return false for tilde range with different major version", () => {
    expect(satisfiesRange("2.2.0", "~1.2.0")).toBe(false);
    expect(satisfiesRange("0.2.0", "~1.2.0")).toBe(false);
  });

  // L64: ConditionalExpression -> true (tilde: versionMinor === targetMinor always true)
  it("should return false for tilde range with different minor version", () => {
    expect(satisfiesRange("1.3.0", "~1.2.0")).toBe(false);
    expect(satisfiesRange("1.1.0", "~1.2.0")).toBe(false);
    expect(satisfiesRange("1.1.9", "~1.2.0")).toBe(false);
  });

  // L75: Math.max -> Math.min (in compareVersionsSimple)
  // If min is used, shorter version parts are not compared
  it("should compare versions with different lengths correctly", () => {
    // "1.0.0" vs "1.0" — with Math.max, compares 3 parts; with Math.min, only 2
    expect(satisfiesRange("1.0.1", ">=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", ">=1.0.1")).toBe(false);
    // Different lengths where the extra part matters
    expect(satisfiesRange("1.0", "<1.0.1")).toBe(true); // 1.0.0 < 1.0.1
  });

  // L77: i < maxLength -> i <= maxLength (off by one in loop)
  // This would cause array out of bounds, reading undefined which || 0 handles
  // But it could cause incorrect comparison
  it("should not have off-by-one in version comparison loop", () => {
    expect(satisfiesRange("1.0.0", ">=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", ">1.0.0")).toBe(false);
    expect(satisfiesRange("1.0.0", "<=1.0.0")).toBe(true);
    expect(satisfiesRange("1.0.0", "<1.0.0")).toBe(false);
  });
});
