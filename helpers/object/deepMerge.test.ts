/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
  it("should merge objects deeply", () => {
    const target = { a: 1, b: { c: 2, d: 3 } };
    const source = { b: { c: 4, e: 5 }, f: 6 };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: { c: 4, d: 3, e: 5 },
      f: 6
    });
  });

  it("should handle multiple sources", () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = { c: 3 };

    const result = deepMerge(target, source1, source2);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should not mutate original objects", () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 } };

    deepMerge(target, source);

    expect(target.b).toHaveProperty('d', 3);
    expect(target.b).toHaveProperty('c', 2);
  });

  it("should return target when no sources provided", () => {
    const target = { a: 1 };
    const result = deepMerge(target);
    expect(result).toEqual({ a: 1 });
  });

  it("should handle undefined values in source", () => {
    const target = { a: 1 };
    const source = { b: undefined };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1 });
    expect('b' in result).toBe(false);
  });

  it("should handle null values in source", () => {
    const target = { a: 1 };
    const source = { b: null };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: 1, b: null });
  });

  it("should handle arrays as values (not merge them)", () => {
    const target = { arr: [1, 2] };
    const source = { arr: [3, 4] };
    const result = deepMerge(target, source);
    expect(result.arr).toEqual([3, 4]);
  });

  it("should deeply merge multiple nested objects", () => {
    const target = { a: { b: { c: 1 } } };
    const source1 = { a: { b: { d: 2 } } };
    const source2 = { a: { e: 3 } };
    const result = deepMerge(target, source1, source2);
    expect(result).toEqual({
      a: { b: { c: 1, d: 2 }, e: 3 }
    });
  });

  it("should handle multiple sources with no common properties", () => {
    const target = { x: 1 };
    const source1 = { y: 2 };
    const source2 = { z: 3 };
    const result = deepMerge(target, source1, source2);
    expect(result).toEqual({ x: 1, y: 2, z: 3 });
  });

  it("should handle merging with nested null values correctly", () => {
    const target = { a: { b: null } };
    const source = { a: { c: 3 } };
    const result = deepMerge(target, source);
    expect(result).toEqual({ a: { b: null, c: 3 } });
  });

  it("should handle multiple sources including empty objects", () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = {};
    const source3 = { c: 3 };
    const result = deepMerge(target, source1, source2, source3);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should handle null/undefined sources gracefully", () => {
    const target = { a: 1 };
    const result = deepMerge(target, null as any, undefined as any, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
