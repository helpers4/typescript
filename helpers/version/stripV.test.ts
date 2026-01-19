/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, it, expect } from "vitest";
import { stripV } from "./stripV";

describe("stripV", () => {
  it("should remove leading 'v' from version strings", () => {
    expect(stripV("v1.2.3")).toBe("1.2.3");
    expect(stripV("v20.1.0")).toBe("20.1.0");
    expect(stripV("v0.0.1")).toBe("0.0.1");
  });

  it("should return the same string if it doesn't start with 'v'", () => {
    expect(stripV("1.2.3")).toBe("1.2.3");
    expect(stripV("20.1.0")).toBe("20.1.0");
    expect(stripV("0.0.1-beta")).toBe("0.0.1-beta");
    expect(stripV("beta")).toBe("beta");
  });

  it("should handle null and undefined values", () => {
    expect(stripV(null)).toBeNull();
    expect(stripV(undefined)).toBeUndefined();
  });

  it("should handle empty string", () => {
    expect(stripV("")).toBe("");
  });

  it("should handle strings that start with 'v' but are not version strings", () => {
    expect(stripV("version")).toBe("ersion");
    expect(stripV("v")).toBe("");
    expect(stripV("verbose")).toBe("erbose");
  });

  it("should handle complex version strings", () => {
    expect(stripV("v1.2.3-alpha.1")).toBe("1.2.3-alpha.1");
    expect(stripV("v2.0.0-beta+build.123")).toBe("2.0.0-beta+build.123");
    expect(stripV("v10.15.3")).toBe("10.15.3");
  });

  it("should handle non-string types gracefully", () => {
    // TypeScript will catch this, but the function should handle it gracefully at runtime
    expect(stripV(123 as any)).toBe(123);
    expect(stripV(true as any)).toBe(true);
    expect(stripV({} as any)).toEqual({});
    expect(stripV([] as any)).toEqual([]);
  });
});
