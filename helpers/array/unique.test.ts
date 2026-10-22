/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { unique } from "./unique";

describe("unique", () => {
  it("should remove duplicates from array", () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it("should work with strings", () => {
    expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it("should work with empty array", () => {
    expect(unique([])).toEqual([]);
  });

  it("should preserve order for first occurrence", () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2]);
  });

  describe('security edge cases', () => {
    it('should deduplicate NaN values (Set uses SameValueZero)', () => {
      expect(unique([NaN, NaN, NaN])).toEqual([NaN]);
    });

    it('should handle __proto__ as string value', () => {
      expect(unique(['__proto__', '__proto__', 'safe'])).toEqual(['__proto__', 'safe']);
    });

    it('should handle constructor as string value', () => {
      expect(unique(['constructor', 'constructor'])).toEqual(['constructor']);
    });

    it('should handle null and undefined values', () => {
      expect(unique([null, null, undefined, undefined])).toEqual([null, undefined]);
    });

    it('should handle -0 and +0 (Set treats them as same)', () => {
      expect(unique([0, -0, 0])).toEqual([0]);
    });
  });

  describe('null/undefined', () => {
    it('should return [] for null', () => {
      expect(unique(null)).toEqual([]);
    });

    it('should return [] for undefined', () => {
      expect(unique(undefined)).toEqual([]);
    });
  });
});
