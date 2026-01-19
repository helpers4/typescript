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
  });
});
