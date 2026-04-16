/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { dateToISOString, safeDate } from "./safeDate";

describe("safe date utilities", () => {
  describe("safeDate", () => {
    it("should handle valid inputs", () => {
      const date = safeDate("2022-01-20");
      expect(date).toBeInstanceOf(Date);
      expect(date?.getFullYear()).toBe(2022);
    });

    it("should handle timestamps", () => {
      const date = safeDate(1642694400); // seconds
      expect(date).toBeInstanceOf(Date);
    });

    it("should return null for null", () => {
      expect(safeDate(null)).toBe(null);
    });

    it("should return null for undefined", () => {
      expect(safeDate(undefined)).toBe(null);
    });

    it("should return null for empty string", () => {
      expect(safeDate("")).toBe(null);
    });

    it("should return null for zero", () => {
      expect(safeDate(0)).toBe(null);
    });

    it("should return null for invalid date string", () => {
      expect(safeDate("invalid")).toBe(null);
    });

    it("should handle Date objects", () => {
      const validDate = new Date("2022-01-20");
      const invalidDate = new Date("invalid");

      expect(safeDate(validDate)).toEqual(validDate);
      expect(safeDate(invalidDate)).toBe(null);
    });

    it("should handle millisecond timestamps", () => {
      const msTimestamp = 1642694400000; // milliseconds
      const date = safeDate(msTimestamp);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(msTimestamp);
    });

    it("should return null for NaN", () => {
      expect(safeDate(NaN)).toBe(null);
    });

    it("should handle date with milliseconds greater than 3-digit", () => {
      const largeNumber = 999999999999; // Very large timestamp
      const date = safeDate(largeNumber);
      expect(date).toBeInstanceOf(Date);
      expect(date?.getTime()).toBe(largeNumber);
    });

    it("should handle string dates with various formats", () => {
      const validDates = [
        "2022-01-20",
        "2022/01/20",
        "01/20/2022",
        "January 20, 2022",
        "2022-01-20T10:30:00",
        "2022-01-20T10:30:00Z"
      ];

      validDates.forEach(dateStr => {
        const date = safeDate(dateStr);
        expect(date).toBeInstanceOf(Date);
        expect(date?.getFullYear()).toBe(2022);
      });
    });
  });

  describe("dateToISOString", () => {
    it("should convert valid dates to ISO string", () => {
      const iso = dateToISOString("2022-01-20T10:00:00Z");
      expect(iso).toBe("2022-01-20T10:00:00.000Z");
    });

    it("should return null for invalid dates", () => {
      expect(dateToISOString(null)).toBe(null);
      expect(dateToISOString("invalid")).toBe(null);
    });

    it("should convert Date objects to ISO string", () => {
      const date = new Date("2022-01-20T10:00:00Z");
      const iso = dateToISOString(date);
      expect(iso).toBe("2022-01-20T10:00:00.000Z");
    });

    it("should convert timestamps to ISO string", () => {
      const timestamp = 1642694400000;
      const iso = dateToISOString(timestamp);
      expect(iso).not.toBeNull();
    });

    it("should handle undefined and empty string in dateToISOString", () => {
      expect(dateToISOString(undefined)).toBe(null);
      expect(dateToISOString("")).toBe(null);
      expect(dateToISOString(0)).toBe(null);
    });

    it("should handle invalid string dates in dateToISOString", () => {
      expect(dateToISOString("not-a-date")).toBe(null);
      expect(dateToISOString("12345-invalid")).toBe(null);
    });

    it("should handle NaN in dateToISOString", () => {
      expect(dateToISOString(NaN)).toBe(null);
    });

    it("should handle null input in dateToISOString", () => {
      expect(dateToISOString(null)).toBe(null);
    });

    it("should handle unexpected input types gracefully", () => {
      // Test with types that shouldn't reach safeDate but ensure safety
      expect(safeDate({} as any)).toBe(null);
      expect(safeDate([] as any)).toBe(null);
      expect(safeDate(true as any)).toBe(null);
      expect(safeDate(false as any)).toBe(null);
    });

    // --- Mutation-killing tests for L15 guard condition ---

    // Each null/undefined/empty/zero must individually return null (not a valid Date)
    // These ensure that removing any single condition from the || chain is detected

    it("should return null for null and NOT a Date (kills ConditionalExpression false)", () => {
      const result = safeDate(null);
      expect(result).toBeNull();
      expect(result).not.toBeInstanceOf(Date);
    });

    it("should return null for undefined and NOT a Date", () => {
      const result = safeDate(undefined);
      expect(result).toBeNull();
      expect(result).not.toBeInstanceOf(Date);
    });

    it("should return null for empty string and NOT a Date", () => {
      const result = safeDate("");
      expect(result).toBeNull();
    });

    it("should return null for 0 and NOT epoch date", () => {
      // If `input === 0` check is removed, normalizeTimestamp(0) would be called
      // normalizeTimestamp(0) returns 0 (since 0 < 10^10), new Date(0) = epoch
      const result = safeDate(0);
      expect(result).toBeNull();
      // Explicitly verify it's not the Unix epoch
      expect(result).not.toEqual(new Date(0));
    });

    // Verify that non-null/undefined/empty/zero inputs DO return valid dates
    // This kills && mutations: if || changed to &&, valid inputs would be wrongly checked
    it("should return a valid Date for non-zero number (not null)", () => {
      const result = safeDate(1);
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
    });

    it("should return a valid Date for non-empty string (not null)", () => {
      const result = safeDate("2023-01-01");
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
    });

    it("should return a valid Date for valid Date object (not null)", () => {
      const d = new Date("2023-06-15");
      const result = safeDate(d);
      expect(result).toBeInstanceOf(Date);
      expect(result).not.toBeNull();
      expect(result).toBe(d);
    });
  });
});
