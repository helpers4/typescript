/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import {
  sortNumberAscFn,
  sortNumberDescFn,
  sortStringAscFn,
  sortStringDescFn,
  sortStringAscInsensitiveFn,
  createSortByStringFn,
  createSortByNumberFn,
  createSortByDateFn
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
  });

  describe("property sorting", () => {
    const users = [
      { name: 'John', age: 30, joined: new Date('2020-01-01') },
      { name: 'alice', age: 25, joined: new Date('2021-01-01') },
      { name: 'Bob', age: 35, joined: new Date('2019-01-01') }
    ];

    it("should sort by string property", () => {
      const sorted = [...users].sort(createSortByStringFn('name'));
      expect(sorted.map(u => u.name)).toEqual(['alice', 'Bob', 'John']);
    });

    it("should sort by string property case insensitive", () => {
      const sorted = [...users].sort(createSortByStringFn('name', true));
      expect(sorted.map(u => u.name)).toEqual(['alice', 'Bob', 'John']);
    });

    it("should sort by number property", () => {
      const sorted = [...users].sort(createSortByNumberFn('age'));
      expect(sorted.map(u => u.age)).toEqual([25, 30, 35]);
    });

    it("should sort by date property", () => {
      const sorted = [...users].sort(createSortByDateFn('joined'));
      expect(sorted.map(u => u.joined.getFullYear())).toEqual([2019, 2020, 2021]);
    });

    it("should use default properties", () => {
      const items = [
        { value: 'z' },
        { value: 'a' },
        { value: 'c' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted.map(i => i.value)).toEqual(['a', 'c', 'z']);
    });

    it("should fallback to label when all objects have label", () => {
      const items = [
        { label: 'z' },
        { label: 'a' },
        { label: 'c' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted.map(i => i.label)).toEqual(['a', 'c', 'z']);
    });

    it("should use default number property", () => {
      const items = [
        { value: 30 },
        { value: 10 },
        { value: 20 }
      ];

      const sorted = [...items].sort(createSortByNumberFn());
      expect(sorted.map(i => i.value)).toEqual([10, 20, 30]);
    });

    it("should use default date property", () => {
      const items = [
        { date: new Date('2022-01-01') },
        { date: new Date('2021-01-01') },
        { date: new Date('2023-01-01') }
      ];

      const sorted = [...items].sort(createSortByDateFn());
      expect(sorted.map(i => i.date.getFullYear())).toEqual([2021, 2022, 2023]);
    });

    it("should find title property as fallback", () => {
      const items = [
        { title: 'z' },
        { title: 'a' },
        { title: 'c' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted.map(i => i.title)).toEqual(['a', 'c', 'z']);
    });

    it("should find description property as fallback", () => {
      const items = [
        { description: 'z' },
        { description: 'a' },
        { description: 'c' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted.map(i => i.description)).toEqual(['a', 'c', 'z']);
    });

    it("should handle equal string values", () => {
      const items = [
        { value: 'a' },
        { value: 'a' },
        { value: 'a' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted.map(i => i.value)).toEqual(['a', 'a', 'a']);
    });

    it("should handle equal string values case insensitive", () => {
      const items = [
        { value: 'A' },
        { value: 'a' },
        { value: 'A' }
      ];

      const sorted = [...items].sort(createSortByStringFn('value', true));
      expect(sorted.map(i => i.value)).toEqual(['A', 'a', 'A']);
    });

    it("should sort descending strings correctly", () => {
      const items = [
        { value: 'apple' },
        { value: 'zebra' },
        { value: 'banana' }
      ];

      const sorted = [...items].sort((a, b) => createSortByStringFn('value')(b, a));
      expect(sorted.map(i => i.value)).toEqual(['zebra', 'banana', 'apple']);
    });

    it("should handle empty string values", () => {
      const items = [
        { value: '' },
        { value: 'a' },
        { value: '' }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted[0].value).toBe('');
      expect(sorted[1].value).toBe('');
      expect(sorted[2].value).toBe('a');
    });

    it("should handle null/undefined values", () => {
      const items = [
        { value: null },
        { value: 'a' },
        { value: undefined }
      ];

      const sorted = [...items].sort(createSortByStringFn());
      expect(sorted[0].value).toBe(null);
      expect(sorted[1].value).toBe(undefined);
      expect(sorted[2].value).toBe('a');
    });

    it("should properly handle case-insensitive sorting", () => {
      const items = [
        { value: 'Z' },
        { value: 'a' },
        { value: 'B' }
      ];

      // Case-insensitive: should be a, B, Z (lowercase comparison)
      const sorted = [...items].sort(createSortByStringFn('value', true));
      expect(sorted[0].value).toBe('a');
      expect(sorted[1].value).toBe('B');
      expect(sorted[2].value).toBe('Z');
    });

    it("should handle numeric comparison in sortByNumber", () => {
      const items = [
        { value: 200 },
        { value: 10 },
        { value: 100 }
      ];

      const sorted = [...items].sort(createSortByNumberFn('value'));
      // Numeric: 10 < 100 < 200 (not lexical)
      expect(sorted[0].value).toBe(10);
      expect(sorted[1].value).toBe(100);
      expect(sorted[2].value).toBe(200);
    });

    it("should handle reverse numeric sorting in date", () => {
      const items = [
        { timestamp: new Date('2023-01-01') },
        { timestamp: new Date('2021-01-01') },
        { timestamp: new Date('2022-01-01') }
      ];

      const sorted = [...items].sort((a, b) => createSortByDateFn('timestamp')(b, a));
      expect(sorted[0].timestamp.getFullYear()).toBe(2023);
      expect(sorted[1].timestamp.getFullYear()).toBe(2022);
      expect(sorted[2].timestamp.getFullYear()).toBe(2021);
    });

    it("should handle sensitive and insensitive sorting with same text", () => {
      const items1 = [
        { value: 'abc' },
        { value: 'ABC' },
        { value: 'AbC' }
      ];

      // Case-sensitive: uppercase before lowercase
      const sortedSensitive = [...items1].sort(createSortByStringFn('value', false));

      // Case-insensitive: should maintain relative order when equal
      const sortedInsensitive = [...items1].sort(createSortByStringFn('value', true));

      expect(sortedSensitive.length).toBe(3);
      expect(sortedInsensitive.length).toBe(3);
    });

    it("should sort with default properties when no property specified", () => {
      const items = [
        { value: 'z' },
        { value: 'a' },
        { value: 'm' }
      ];

      const sorted = [...items].sort(createSortByStringFn(undefined, false));
      expect(sorted[0].value).toBe('a');
      expect(sorted[1].value).toBe('m');
      expect(sorted[2].value).toBe('z');
    });

    it("should handle null/undefined property values in string sort", () => {
      const items = [
        { name: 'John' },
        { name: null as any },
        { name: undefined as any },
        { name: 'Alice' }
      ];

      const sorted = [...items].sort(createSortByStringFn('name'));
      // null/undefined are converted to empty strings, so they come first
      expect(sorted[0].name ?? '').toBe('');
      expect(sorted[1].name ?? '').toBe('');
      expect(sorted[2].name).toBe('Alice');
      expect(sorted[3].name).toBe('John');
    });

    it("should handle null/undefined property values in number sort", () => {
      const items = [
        { value: 10 },
        { value: null as any },
        { value: undefined as any },
        { value: 5 }
      ];

      const sorted = [...items].sort(createSortByNumberFn('value'));
      // null/undefined are converted to 0 by Number() during comparison
      expect(sorted[0].value ?? 0).toBe(0);
      expect(sorted[1].value ?? 0).toBe(0);
      expect(sorted[2].value).toBe(5);
      expect(sorted[3].value).toBe(10);
    });
  });
});
