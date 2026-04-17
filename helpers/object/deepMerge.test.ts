/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
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

  it('should return null when target is null', () => {
    expect(deepMerge(null)).toBeNull();
  });

  it('should return undefined when target is undefined', () => {
    expect(deepMerge(undefined)).toBeUndefined();
  });

  // --- Mutation-killing tests ---

  // L17: ConditionalExpression -> false (isPlainObject check on targetValue)
  // If false, nested plain objects would NOT be deeply merged
  it('should deeply merge nested objects (not just overwrite)', () => {
    const target = { a: { x: 1, y: 2 } };
    const source = { a: { z: 3 } };
    const result = deepMerge(target, source);
    // Deep merge: a should have x, y, AND z
    expect(result.a).toEqual({ x: 1, y: 2, z: 3 });
    // If ConditionalExpression false, a would just be { z: 3 } (overwritten)
    expect(result.a.x).toBe(1);
  });

  // L23: isPlainObject(targetValue) && isPlainObject(sourceValue) -> ||
  // If ||, one being plain object would trigger deep merge on non-object
  it('should overwrite when target value is not plain object', () => {
    const target = { a: 'string' };
    const source = { a: { nested: true } };
    const result = deepMerge(target, source);
    // Should overwrite, not deeply merge string+object
    expect(result.a).toEqual({ nested: true });
  });

  it('should overwrite when source value is not plain object', () => {
    const target = { a: { nested: true } };
    const source = { a: 'string' };
    const result = deepMerge(target, source);
    expect(result.a).toBe('string');
  });

  // --- Prototype pollution protection ---

  it('should not allow __proto__ pollution', () => {
    const target = {};
    const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    deepMerge(target, malicious);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    expect('polluted' in target).toBe(false);
  });

  it('should not allow constructor pollution', () => {
    const target = {};
    const malicious = { constructor: { polluted: 'yes' } };
    deepMerge(target, malicious);
    expect(target.constructor).toBe(Object);
  });

  it('should not allow prototype pollution', () => {
    const target = {};
    const malicious = { prototype: { polluted: 'yes' } };
    deepMerge(target, malicious);
    expect((target as Record<string, unknown>)['prototype']).toBeUndefined();
  });

  it('should skip inherited properties from source', () => {
    const proto = { inherited: 'value' };
    const source = Object.create(proto) as Record<string, unknown>;
    source['own'] = 'yes';
    const target: Record<string, unknown> = {};
    deepMerge(target, source);
    expect(target['own']).toBe('yes');
    expect(target['inherited']).toBeUndefined();
  });
});
