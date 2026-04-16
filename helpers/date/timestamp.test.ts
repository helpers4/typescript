/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { isTimestampInSeconds, normalizeTimestamp } from "./timestamp";

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
});
