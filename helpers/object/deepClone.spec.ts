/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { deepClone } from './deepClone';

// Build a plain object (with Object.prototype) from fc.record which may produce null-prototype objects
function plainObj(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.assign({}, obj);
}

describe('deepClone — property-based', () => {
  it('result deeply equals input (round-trip via JSON)', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.record({ a: fc.integer(), b: fc.string() }).map(plainObj),
          fc.array(fc.integer()),
          fc.integer(),
          fc.string()
        ),
        (value) => {
          const clone = deepClone(value);
          expect(JSON.stringify(clone)).toBe(JSON.stringify(value));
        }
      )
    );
  });

  it('result is not the same reference as input for objects', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer() }).map(plainObj),
        (obj) => {
          const clone = deepClone(obj);
          expect(clone).not.toBe(obj);
        }
      )
    );
  });

  it('modifying clone does not affect original', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }).map(plainObj),
        (obj) => {
          const clone = deepClone(obj) as Record<string, unknown>;
          clone.a = 99999;
          expect((obj as Record<string, unknown>).a).not.toBe(99999);
        }
      )
    );
  });
});

describe('deepClone — contract', () => {
  it('null → null', () => {
    expect(deepClone(null)).toBeNull();
  });

  it('number → same number', () => {
    expect(deepClone(42)).toBe(42);
  });

  it('string → same string', () => {
    expect(deepClone('hello')).toBe('hello');
  });

  it('Date → new Date with same time (not same reference)', () => {
    const d = new Date('2025-06-15T10:00:00.000Z');
    const clone = deepClone(d);
    expect(clone).toBeInstanceOf(Date);
    expect(clone).not.toBe(d);
    expect(clone.getTime()).toBe(d.getTime());
  });

  it('nested objects are deeply cloned', () => {
    const obj = { a: { b: { c: 42 } } };
    const clone = deepClone(obj);
    expect(clone).toEqual(obj);
    clone.a.b.c = 0;
    expect(obj.a.b.c).toBe(42);
  });

  it('arrays are deeply cloned', () => {
    const arr = [1, [2, 3], { x: 4 }];
    const clone = deepClone(arr);
    expect(clone).toEqual(arr);
    expect(clone).not.toBe(arr);
    (clone[1] as number[])[0] = 99;
    expect((arr[1] as number[])[0]).toBe(2);
  });

  it('circular reference: NOT expected to work — will cause stack overflow', () => {
    // deepClone does not handle circular references.
    // This test documents the known limitation.
    const obj: Record<string, unknown> = { a: 1 };
    obj.self = obj;
    expect(() => deepClone(obj)).toThrow();
  });
});
