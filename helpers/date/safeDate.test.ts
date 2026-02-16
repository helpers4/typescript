/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { safeDate, dateToISOString } from "./safeDate";

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

    it("should return null for invalid inputs", () => {
      expect(safeDate(null)).toBe(null);
      expect(safeDate(undefined)).toBe(null);
      expect(safeDate("")).toBe(null);
      expect(safeDate(0)).toBe(null);
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
  });
});
