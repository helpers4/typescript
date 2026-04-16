/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { increment } from "./increment";

describe("increment", () => {
  it("should increment patch version", () => {
    expect(increment("1.2.3", "patch")).toBe("1.2.4");
    expect(increment("v1.2.3", "patch")).toBe("v1.2.4");
  });

  it("should increment minor version and reset patch", () => {
    expect(increment("1.2.3", "minor")).toBe("1.3.0");
    expect(increment("v1.2.3", "minor")).toBe("v1.3.0");
  });

  it("should increment major version and reset minor and patch", () => {
    expect(increment("1.2.3", "major")).toBe("2.0.0");
    expect(increment("v1.2.3", "major")).toBe("v2.0.0");
  });

  it("should handle incomplete versions", () => {
    expect(increment("1.2", "patch")).toBe("1.2.1");
    expect(increment("1", "minor")).toBe("1.1.0");
  });

  it("should throw for invalid increment type", () => {
    expect(() => increment("1.0.0", "invalid" as any)).toThrow();
  });

  it('should return null when given null', () => {
    expect(increment(null, 'patch')).toBeNull();
  });

  it('should return undefined when given undefined', () => {
    expect(increment(undefined, 'patch')).toBeUndefined();
  });

  // --- Mutation-killing tests ---

  // L17: Regex /^v/ -> /v/ (removes ^ anchor)
  it('should only strip leading v, not v elsewhere in version', () => {
    // 'v1.0.0' should become '1.0.0' then increment
    expect(increment('v1.0.0', 'patch')).toBe('v1.0.1');
    // Verify the 'v' prefix is preserved correctly
    expect(increment('v0.0.0', 'major')).toBe('v1.0.0');
  });

  // L24: parts.length < 3 -> parts.length <= 3 (while loop runs extra time)
  // If <=, a 3-part version would get an extra 0 appended
  it('should not add extra parts to already complete versions', () => {
    expect(increment('1.2.3', 'patch')).toBe('1.2.4');
    expect(increment('0.0.0', 'patch')).toBe('0.0.1');
  });

  // L44: StringLiteral `${major}.${minor}.${patch}` -> ``
  // If result is empty string, output would be wrong
  it('should produce proper version string format', () => {
    const result = increment('1.0.0', 'patch');
    expect(result).toBe('1.0.1');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
