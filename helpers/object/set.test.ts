/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { set } from "./set";

describe("set", () => {
  it("should set nested value using dot notation", () => {
    const obj = {};
    set(obj, 'a.b.c', 'value');

    expect(obj).toEqual({
      a: {
        b: {
          c: 'value'
        }
      }
    });
  });

  it("should set value in existing object", () => {
    const obj: Record<string, any> = { a: { x: 1 } };
    set(obj, 'a.b', 'new-value');

    expect(obj).toEqual({
      a: {
        x: 1,
        b: 'new-value'
      }
    });
  });

  it("should overwrite existing values", () => {
    const obj = { a: { b: 'old' } };
    set(obj, 'a.b', 'new');

    expect(obj.a.b).toBe('new');
  });

  it("should return the modified object", () => {
    const obj = {};
    const result = set(obj, 'a.b', 'value');

    expect(result).toBe(obj);
  });

  // --- Mutation-killing tests ---

  // L21: ConditionalExpression -> false (skips creating intermediate objects)
  // If false, deeply nested paths with missing intermediates would fail
  it("should create intermediate objects for deep paths", () => {
    const obj: Record<string, any> = {};
    set(obj, 'a.b.c.d', 'deep');
    expect(obj.a.b.c.d).toBe('deep');
    expect(typeof obj.a).toBe('object');
    expect(typeof obj.a.b).toBe('object');
    expect(typeof obj.a.b.c).toBe('object');
  });

  // L21: LogicalOperator !(key in current) || typeof current[key] !== 'object' -> &&
  // If &&, existing non-object values would NOT be overwritten with {}
  it("should overwrite non-object intermediate values", () => {
    const obj: Record<string, any> = { a: 'string-value' };
    set(obj, 'a.b', 'nested');
    // 'a' was a string, should now be an object with 'b'
    expect(obj.a.b).toBe('nested');
    expect(typeof obj.a).toBe('object');
  });

  it("should overwrite null intermediate values", () => {
    const obj: Record<string, any> = { a: null };
    set(obj, 'a.b', 'value');
    expect(obj.a.b).toBe('value');
  });

  it("should handle single-level path", () => {
    const obj: Record<string, any> = {};
    set(obj, 'key', 'value');
    expect(obj.key).toBe('value');
  });

  // --- Prototype pollution protection ---

  it('should not allow __proto__ pollution', () => {
    const obj: Record<string, unknown> = {};
    set(obj, '__proto__.polluted', 'yes');
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('should not allow __proto__ as final key', () => {
    const obj: Record<string, unknown> = {};
    set(obj, '__proto__', 'value');
    expect(Object.getOwnPropertyDescriptor(obj, '__proto__')?.value).toBeUndefined();
  });

  it('should not allow constructor pollution', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'constructor.polluted', 'yes');
    expect(obj.constructor).toBe(Object);
  });

  it('should not allow prototype pollution', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'prototype.polluted', 'yes');
    expect((obj as Record<string, unknown>)['prototype']).toBeUndefined();
  });

  it('should return obj unchanged for unsafe paths', () => {
    const obj = { a: 1 };
    const result = set(obj, '__proto__.evil', true);
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('should not create intermediate objects before unsafe key', () => {
    const obj: Record<string, unknown> = {};
    set(obj, 'a.__proto__.x', 1);
    expect(obj['a']).toBeUndefined();
  });
});
