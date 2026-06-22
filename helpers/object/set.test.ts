/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, expectTypeOf, it } from "vitest";
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

  it('should shadow a prototype-inherited intermediate node instead of traversing into it', () => {
    // Object.hasOwn (not `in`) is intentional: traversing into an inherited node would
    // mutate the prototype, affecting all objects that share it.
    const proto = { middleware: { timeout: 5000 } };
    const obj = Object.create(proto) as Record<string, unknown>;
    set(obj, 'middleware.host', 'localhost');
    // Own 'middleware' is created on obj, shadowing proto.middleware.
    expect(Object.hasOwn(obj, 'middleware')).toBe(true);
    expect((obj['middleware'] as Record<string, unknown>)['host']).toBe('localhost');
    // The prototype node is left untouched.
    expect(proto.middleware.timeout).toBe(5000);
    expect((proto.middleware as Record<string, unknown>)['host']).toBeUndefined();
  });
});

describe("set — bracket notation", () => {
  it('should parse [n] as a number key', () => {
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, 'a[0]', 'val');
    expect((obj['a'] as Record<number, unknown>)[0]).toBe('val');
  });

  it('should handle mixed dot and bracket notation', () => {
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, 'layers[1].name', 'bg');
    expect(((obj['layers'] as Record<number, unknown>)[1] as Record<string, unknown>)['name']).toBe('bg');
  });

  it('dot notation keeps "1" as string key, bracket [1] gives number key', () => {
    const obj1: Record<string, unknown> = {};
    const obj2: Record<PropertyKey, unknown> = {};
    set(obj1, 'a.1.b', 'dot');
    set(obj2, 'a[1].b', 'bracket');
    expect(((obj1['a'] as Record<string, unknown>)['1'] as Record<string, unknown>)['b']).toBe('dot');
    expect(((obj2['a'] as Record<number, unknown>)[1] as Record<string, unknown>)['b']).toBe('bracket');
  });

  it('should work on existing array elements', () => {
    const obj = { layers: [{}, { name: 'old' }] };
    set(obj, 'layers[1].name', 'new');
    expect(obj.layers[1].name).toBe('new');
  });

  it('should handle multiple bracket indices', () => {
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, 'a[0][1]', 'deep');
    expect(((obj['a'] as Record<number, unknown>)[0] as Record<number, unknown>)[1]).toBe('deep');
  });
});

describe("set — PropertyKey[] path", () => {
  it('should accept an array of string keys', () => {
    const obj: Record<string, unknown> = {};
    set(obj, ['a', 'b', 'c'], 42);
    expect(((obj['a'] as Record<string, unknown>)['b'] as Record<string, unknown>)['c']).toBe(42);
  });

  it('should accept number keys', () => {
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, ['items', 0, 'name'], 'first');
    expect(((obj['items'] as Record<number, unknown>)[0] as Record<string, unknown>)['name']).toBe('first');
  });

  it('should accept symbol keys', () => {
    const sym = Symbol('id');
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, ['user', sym], 'alice');
    expect((obj['user'] as Record<symbol, unknown>)[sym]).toBe('alice');
  });

  it('should return same object reference', () => {
    const obj: Record<PropertyKey, unknown> = {};
    const result = set(obj, ['a'], 1);
    expect(result).toBe(obj);
  });

  it('should reject paths with unsafe string keys', () => {
    const obj = { a: 1 };
    const result = set(obj, ['__proto__', 'polluted'] as PropertyKey[], 'yes');
    expect(result).toBe(obj);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('should return obj unchanged for empty key array', () => {
    const obj = { a: 1 };
    const result = set(obj, [] as PropertyKey[], 'value');
    expect(result).toBe(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('should create intermediate objects as needed', () => {
    const obj: Record<PropertyKey, unknown> = {};
    set(obj, ['x', 'y', 'z'], true);
    expect(((obj['x'] as Record<string, unknown>)['y'] as Record<string, unknown>)['z']).toBe(true);
  });
});

describe('set — type inference', () => {
  it('dot path: return type reflects updated field', () => {
    const obj = { a: { b: 1 } };
    const result = set(obj, 'a.b', 42);
    expectTypeOf(result).toEqualTypeOf<{ a: { b: number } }>();
  });

  it('bracket path: return type reflects updated array element field', () => {
    const obj = { layers: [{ name: 'old' }] };
    const result = set(obj, 'layers[0].name', 'new');
    expectTypeOf(result).toEqualTypeOf<{ layers: { name: string }[] }>();
  });

  it('PropertyKey[] path: return type reflects updated field', () => {
    const obj = { a: { b: true } };
    const result = set(obj, ['a', 'b'] as const, false);
    expectTypeOf(result).toEqualTypeOf<{ a: { b: boolean } }>();
  });

  it('symbol key via PropertyKey[] path infers type', () => {
    const sym = Symbol('id');
    const obj = { [sym]: 'alice' };
    const result = set(obj, [sym] as const, 'bob');
    expectTypeOf(result).toEqualTypeOf<{ [sym]: string }>();
  });

  it('wrong value type is rejected at compile time', () => {
    const obj = { a: { b: 1 } };
    // @ts-expect-error string is not assignable to number
    set(obj, 'a.b', 'wrong');
  });

  it('wrong value type is rejected for PropertyKey[] path', () => {
    const obj = { a: { b: 1 } };
    // @ts-expect-error string is not assignable to number
    set(obj, ['a', 'b'] as const, 'wrong');
  });
});
