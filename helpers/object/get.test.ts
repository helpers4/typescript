/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { get } from "./get";

describe("get", () => {
  const obj = {
    a: {
      b: {
        c: 'value'
      }
    },
    x: [1, 2, { y: 'array-value' }]
  };

  it("should get nested value using dot notation", () => {
    expect(get(obj, 'a.b.c')).toBe('value');
  });

  it("should return default value for non-existent path", () => {
    expect(get(obj, 'a.b.d', 'default')).toBe('default');
  });

  it("should work with array indices via dot notation", () => {
    expect(get(obj, 'x.2.y')).toBe('array-value');
  });

  it("should work with bracket notation for array indices", () => {
    expect(get(obj, 'x[2].y')).toBe('array-value');
  });

  it("should work with mixed dot and bracket notation", () => {
    const nested = { a: [{ b: [{ c: 'deep' }] }] };
    expect(get(nested, 'a[0].b[0].c')).toBe('deep');
  });

  it("should return undefined for non-existent path without default", () => {
    expect(get(obj, 'non.existent.path')).toBeUndefined();
  });

  it("should handle null/undefined objects", () => {
    expect(get(null, 'a.b', 'default')).toBe('default');
    expect(get(undefined, 'a.b', 'default')).toBe('default');
  });

  // --- Mutation-killing tests ---

  // L19: ConditionalExpression -> false (result == null || typeof result !== 'object' -> false)
  // If false, traversal would continue on null/undefined/primitives
  it("should return default when path traverses through null", () => {
    const obj = { a: { b: null } };
    expect(get(obj, 'a.b.c', 'fallback')).toBe('fallback');
  });

  it("should return default when path traverses through primitive", () => {
    const obj = { a: { b: 42 } };
    expect(get(obj, 'a.b.c', 'fallback')).toBe('fallback');
  });

  it("should return default when path traverses through string", () => {
    const obj = { a: 'hello' };
    expect(get(obj, 'a.b', 'fallback')).toBe('fallback');
  });

  // --- PropertyKey[] path ---

  it("should accept an array of string keys", () => {
    expect(get(obj, ['a', 'b', 'c'])).toBe('value');
  });

  it("should accept number keys", () => {
    expect(get(obj, ['x', 2, 'y'])).toBe('array-value');
  });

  it("should accept symbol keys", () => {
    const sym = Symbol('id');
    const o = { [sym]: 'secret' };
    expect(get(o, [sym])).toBe('secret');
  });

  it("should return default for missing array path", () => {
    expect(get(obj, ['a', 'z'], 'fallback')).toBe('fallback');
  });

  it("should return obj itself for empty key array", () => {
    expect(get(obj, [])).toBe(obj);
  });

  // --- parsePath edge-case regressions ---

  it('should traverse the empty-string key for a bare dot path "."', () => {
    // '.' is treated as a leading dot (stripped) leaving '' → [''] — one empty-string key.
    // Regression: parsePath('.') previously returned [], causing a silent no-op.
    const o: Record<string, unknown> = { '': 'empty-key-value' };
    expect(get(o, '.')).toBe('empty-key-value');
  });

  it('should traverse empty middle segment for consecutive dots "a..b"', () => {
    // 'a..b' → ['a', '', 'b'] — the empty segment addresses obj.a[''].b.
    const o = { a: { '': { b: 'found' } } };
    expect(get(o, 'a..b')).toBe('found');
  });
});
