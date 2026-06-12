/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import {
  sortNumberAscFn,
  sortNumberDescFn,
  sortStringAscFn,
  sortStringAscInsensitiveFn,
  sortStringDescFn,
} from "./sort";

describe("sort functions", () => {
  describe("number sorting", () => {
    it("should sort numbers ascending", () => {
      const arr = [3, 1, 4, 1, 5];
      arr.sort(sortNumberAscFn);
      expect(arr).toEqual([1, 1, 3, 4, 5]);
    });

    it("should sort numbers descending", () => {
      const arr = [3, 1, 4, 1, 5];
      arr.sort(sortNumberDescFn);
      expect(arr).toEqual([5, 4, 3, 1, 1]);
    });
  });

  describe("string sorting", () => {
    it("should sort strings ascending", () => {
      const arr = ['cherry', 'apple', 'banana'];
      arr.sort(sortStringAscFn);
      expect(arr).toEqual(['apple', 'banana', 'cherry']);
    });

    it("should sort strings descending", () => {
      const arr = ['cherry', 'apple', 'banana'];
      arr.sort(sortStringDescFn);
      expect(arr).toEqual(['cherry', 'banana', 'apple']);
    });

    it("should sort strings case insensitive", () => {
      const arr = ['Cherry', 'apple', 'Banana'];
      arr.sort(sortStringAscInsensitiveFn);
      expect(arr).toEqual(['apple', 'Banana', 'Cherry']);
    });

    // L51: a.toLowerCase() -> a.toUpperCase() in sortStringAscInsensitiveFn
    it("should use toLowerCase not toUpperCase for case-insensitive string sort", () => {
      const arr = ['ä', 'z', 'a'];
      const sorted = [...arr].sort(sortStringAscInsensitiveFn);
      expect(sorted[0]).toBe('a');
    });

    it("should default to case-sensitive sorting (not insensitive)", () => {
      const items2 = [{ value: 'b' }, { value: 'A' }];
      const sorted2 = [...items2].sort((a, b) => sortStringAscFn(a.value, b.value));
      expect(sorted2[0].value).toBe('A');
      expect(sorted2[1].value).toBe('b');
    });
  });
});
