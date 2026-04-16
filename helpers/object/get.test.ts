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

  it("should work with array indices", () => {
    expect(get(obj, 'x.2.y')).toBe('array-value');
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
});
