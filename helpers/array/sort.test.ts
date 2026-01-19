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
  });
});
