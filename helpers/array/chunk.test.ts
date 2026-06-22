/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { chunk } from "./chunk";

describe("chunk", () => {
  it("should chunk array into specified size", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("should work with exact divisions", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it("should work with size 1", () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it("should return empty array for size 0 or negative", () => {
    expect(chunk([1, 2, 3], 0)).toEqual([]);
    expect(chunk([1, 2, 3], -1)).toEqual([]);
  });

  it("should work with empty array", () => {
    expect(chunk([], 2)).toEqual([]);
  });

  describe('security edge cases', () => {
    it('should handle sparse arrays', () => {
      // eslint-disable-next-line no-sparse-arrays
      const sparse = [1, , 3, , 5];
      const result = chunk(sparse, 2);
      expect(result).toHaveLength(3);
    });

    it('should handle very large chunk size', () => {
      expect(chunk([1, 2, 3], Number.MAX_SAFE_INTEGER)).toEqual([[1, 2, 3]]);
    });

    it('should handle NaN as chunk size', () => {
      // NaN does not satisfy size <= 0, so it enters the loop but produces no useful chunks
      const result = chunk([1, 2, 3], NaN);
      expect(result).toBeDefined();
    });

    it('should handle Infinity as chunk size', () => {
      expect(chunk([1, 2, 3], Infinity)).toEqual([[1, 2, 3]]);
    });
  });

  describe('null/undefined', () => {
    it('should return [] for null', () => {
      expect(chunk(null, 2)).toEqual([]);
    });

    it('should return [] for undefined', () => {
      expect(chunk(undefined, 2)).toEqual([]);
    });
  });
});
