/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from "vitest";
import { deepClone } from "./deepClone";

describe("deepClone", () => {
  it("should clone primitive values", () => {
    expect(deepClone(42)).toBe(42);
    expect(deepClone("hello")).toBe("hello");
    expect(deepClone(true)).toBe(true);
    expect(deepClone(null)).toBe(null);
  });

  it("should deep clone objects", () => {
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.b).not.toBe(original.b);

    cloned.b.c = 3;
    expect(original.b.c).toBe(2);
  });

  it("should deep clone arrays", () => {
    const original = [1, [2, 3], { a: 4 }];
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned[1]).not.toBe(original[1]);
    expect(cloned[2]).not.toBe(original[2]);
  });

  it("should clone dates", () => {
    const date = new Date();
    const cloned = deepClone(date);

    expect(cloned).toEqual(date);
    expect(cloned).not.toBe(date);
  });

  it("should handle undefined", () => {
    expect(deepClone(undefined)).toBe(undefined);
  });

  it("should clone objects with multiple nested levels", () => {
    const original = {
      a: { b: { c: { d: { e: 'deep' } } } },
      arr: [1, { nested: [2, 3] }]
    };
    const cloned = deepClone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.a.b.c.d).not.toBe(original.a.b.c.d);
    expect(cloned.arr[1]).not.toBe(original.arr[1]);
  });

  it("should handle objects with inherited properties", () => {
    const original = Object.create({ inherited: 'value' });
    original.own = 'property';
    const cloned = deepClone(original);

    expect(cloned.own).toBe('property');
    expect(cloned.inherited).toBeUndefined(); // Only own properties are cloned
  });

  describe('security edge cases', () => {
    it('should not transport __proto__ pollution via JSON payload', () => {
      const malicious = JSON.parse('{"__proto__":{"polluted":"yes"},"safe":"value"}');
      const cloned = deepClone(malicious);

      expect(cloned.safe).toBe('value');
      // The global Object prototype must NOT be polluted
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      // __proto__ key should be stripped from cloned object
      expect(cloned).not.toHaveProperty('__proto__');
    });

    it('should strip constructor key from cloned object', () => {
      const malicious = { constructor: { prototype: { admin: true } }, data: 1 };
      const cloned = deepClone(malicious);

      expect(cloned.data).toBe(1);
      expect(cloned).not.toHaveProperty('constructor');
    });

    it('should strip prototype key from cloned object', () => {
      const malicious = { prototype: { exploit: true }, data: 'ok' };
      const cloned = deepClone(malicious);

      expect(cloned.data).toBe('ok');
      expect(cloned).not.toHaveProperty('prototype');
    });

    it('should handle deeply nested __proto__ payload', () => {
      const malicious = JSON.parse('{"a":{"__proto__":{"polluted":"deep"}}}');
      const cloned = deepClone(malicious);

      expect(({} as Record<string, unknown>).polluted).toBeUndefined();
      expect(cloned.a).toBeDefined();
      expect(cloned.a).not.toHaveProperty('__proto__');
    });

    it('should handle object with all unsafe keys', () => {
      const malicious = JSON.parse('{"__proto__":{},"constructor":{},"prototype":{}}');
      const cloned = deepClone(malicious);

      expect(Object.keys(cloned)).toHaveLength(0);
    });

    it('should handle object with mixed safe and unsafe keys', () => {
      const obj = { name: 'test', __proto__: { hack: true }, value: 42 } as Record<string, unknown>;
      const cloned = deepClone(obj);

      expect(cloned.name).toBe('test');
      expect(cloned.value).toBe(42);
    });

    it('should handle Object.create(null) without throwing', () => {
      const obj = Object.create(null) as Record<string, unknown>;
      obj.a = 1;
      obj.b = 'hello';
      const cloned = deepClone(obj);

      expect(cloned.a).toBe(1);
      expect(cloned.b).toBe('hello');
    });
  });
});
