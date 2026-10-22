/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import {
  fromMillis,
  fromSeconds,
  isTimestampInSeconds,
  normalizeTimestamp,
  toMillis,
  toSeconds,
} from "./timestamp";

describe("timestamp utilities", () => {
  describe("isTimestampInSeconds", () => {
    it("should identify seconds vs milliseconds", () => {
      expect(isTimestampInSeconds(1642694400)).toBe(true); // 2022-01-20 in seconds
      expect(isTimestampInSeconds(1642694400000)).toBe(false); // 2022-01-20 in milliseconds
    });
  });

  describe("normalizeTimestamp", () => {
    it("should normalize timestamps", () => {
      expect(normalizeTimestamp(1642694400)).toBe(1642694400000);
      expect(normalizeTimestamp(1642694400000)).toBe(1642694400000);
    });
  });

  // --- Mutation-killing tests ---

  // L14: timestamp < 10000000000 -> timestamp <= 10000000000
  // If <=, the boundary value 10000000000 would be treated as seconds
  it("should treat 10000000000 as milliseconds (not seconds)", () => {
    // 10000000000 is the boundary; with <, it's milliseconds; with <=, it would be seconds
    expect(isTimestampInSeconds(10000000000)).toBe(false);
    expect(normalizeTimestamp(10000000000)).toBe(10000000000); // Already ms
  });

  it("should treat 9999999999 as seconds", () => {
    expect(isTimestampInSeconds(9999999999)).toBe(true);
    expect(normalizeTimestamp(9999999999)).toBe(9999999999000);
  });

  // Negative timestamps (before Unix epoch)
  it("should treat negative seconds-range as seconds", () => {
    expect(isTimestampInSeconds(-1642694400)).toBe(true);
    expect(normalizeTimestamp(-1642694400)).toBe(-1642694400000);
  });

  it("should treat negative ms-range as milliseconds", () => {
    expect(isTimestampInSeconds(-1642694400000)).toBe(false);
    expect(normalizeTimestamp(-1642694400000)).toBe(-1642694400000);
  });

  it("should treat -10000000000 as milliseconds (boundary)", () => {
    expect(isTimestampInSeconds(-10000000000)).toBe(false);
    expect(normalizeTimestamp(-10000000000)).toBe(-10000000000);
  });

  it("should treat -9999999999 as seconds", () => {
    expect(isTimestampInSeconds(-9999999999)).toBe(true);
    expect(normalizeTimestamp(-9999999999)).toBe(-9999999999000);
  });
});

// ---------------------------------------------------------------------------
// toSeconds
// ---------------------------------------------------------------------------

describe("toSeconds", () => {
  it("converts a Date to epoch seconds", () => {
    expect(toSeconds(new Date("2025-01-19T12:00:00Z"))).toBe(1737288000);
  });

  it("truncates sub-second precision", () => {
    expect(toSeconds(new Date("2025-01-19T12:00:00.999Z"))).toBe(1737288000);
  });

  it("accepts a string DateLike", () => {
    expect(toSeconds("2025-01-19T12:00:00Z")).toBe(1737288000);
  });

  it("accepts a millis timestamp DateLike", () => {
    expect(toSeconds(1737288000000)).toBe(1737288000);
  });

  it("returns null for invalid input", () => {
    expect(toSeconds("invalid")).toBeNull();
  });

  it("handles epoch", () => {
    expect(toSeconds(new Date("1970-01-01T00:00:00Z"))).toBe(0);
  });

  it("handles negative (pre-epoch)", () => {
    const result = toSeconds(new Date("1969-12-31T23:59:59Z"));
    expect(result).toBe(-1);
  });
});

// ---------------------------------------------------------------------------
// toMillis
// ---------------------------------------------------------------------------

describe("toMillis", () => {
  it("converts a Date to epoch millis", () => {
    expect(toMillis(new Date("2025-01-19T12:00:00Z"))).toBe(1737288000000);
  });

  it("preserves sub-second precision", () => {
    expect(toMillis(new Date("2025-01-19T12:00:00.123Z"))).toBe(1737288000123);
  });

  it("accepts a string DateLike", () => {
    expect(toMillis("2025-01-19T12:00:00Z")).toBe(1737288000000);
  });

  it("returns null for invalid input", () => {
    expect(toMillis("nope")).toBeNull();
  });

  it("handles epoch", () => {
    expect(toMillis(new Date("1970-01-01T00:00:00Z"))).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// fromSeconds
// ---------------------------------------------------------------------------

describe("fromSeconds", () => {
  it("creates a Date from epoch seconds", () => {
    const d = fromSeconds(1737288000);
    expect(d).toEqual(new Date("2025-01-19T12:00:00Z"));
  });

  it("handles epoch (0)", () => {
    const d = fromSeconds(0);
    expect(d).toEqual(new Date("1970-01-01T00:00:00Z"));
  });

  it("handles negative seconds", () => {
    const d = fromSeconds(-86400);
    expect(d).toEqual(new Date("1969-12-31T00:00:00Z"));
  });

  it("handles fractional seconds", () => {
    const d = fromSeconds(1737288000.5);
    expect(d!.getTime()).toBe(1737288000500);
  });

  it("returns null for NaN", () => {
    expect(fromSeconds(NaN)).toBeNull();
  });

  it("returns null for Infinity", () => {
    expect(fromSeconds(Infinity)).toBeNull();
  });

  it("returns null for -Infinity", () => {
    expect(fromSeconds(-Infinity)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// fromMillis
// ---------------------------------------------------------------------------

describe("fromMillis", () => {
  it("creates a Date from epoch millis", () => {
    const d = fromMillis(1737288000000);
    expect(d).toEqual(new Date("2025-01-19T12:00:00Z"));
  });

  it("handles epoch (0)", () => {
    const d = fromMillis(0);
    expect(d).toEqual(new Date("1970-01-01T00:00:00Z"));
  });

  it("handles negative millis", () => {
    const d = fromMillis(-86400000);
    expect(d).toEqual(new Date("1969-12-31T00:00:00Z"));
  });

  it("returns null for NaN", () => {
    expect(fromMillis(NaN)).toBeNull();
  });

  it("returns null for Infinity", () => {
    expect(fromMillis(Infinity)).toBeNull();
  });
});
