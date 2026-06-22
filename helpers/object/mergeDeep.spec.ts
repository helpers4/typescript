/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mergeDeep } from './mergeDeep';

describe('mergeDeep — property-based', () => {
  it('all keys from first source appear in result', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ c: fc.integer(), d: fc.string() }),
        (s1, s2) => {
          const result = mergeDeep(s1, s2);
          for (const key of Object.keys(s1)) {
            expect(key in result).toBe(true);
          }
        }
      )
    );
  });

  it('all keys from second source appear in result', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer() }),
        fc.record({ b: fc.integer() }),
        (s1, s2) => {
          const result = mergeDeep(s1, s2);
          for (const key of Object.keys(s2)) {
            expect(key in result).toBe(true);
          }
        }
      )
    );
  });

  it('later source values override earlier ones for same non-undefined key', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (v1, v2) => {
        const result = mergeDeep({ a: v1 }, { a: v2 });
        expect(result.a).toBe(v2);
      })
    );
  });

  it('no source is mutated', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ a: fc.integer(), c: fc.string() }),
        (s1, s2) => {
          const snap1 = JSON.stringify(s1);
          const snap2 = JSON.stringify(s2);
          mergeDeep(s1, s2);
          expect(JSON.stringify(s1)).toBe(snap1);
          expect(JSON.stringify(s2)).toBe(snap2);
        }
      )
    );
  });
});

describe('mergeDeep — contract', () => {
  it('mergeDeep({a:1}, {a:2}) → {a:2}', () => {
    expect(mergeDeep({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('mergeDeep({a:{b:1}}, {a:{c:2}}) → {a:{b:1,c:2}}', () => {
    expect(mergeDeep({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
  });

  it('mergeDeep({a:1}, {a:undefined}) → {a:1} (undefined does not overwrite)', () => {
    expect(mergeDeep({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('single source → returns new object equal to source', () => {
    const s = { a: 1 };
    const result = mergeDeep(s);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(s);
  });

  it('multiple sources merged left to right', () => {
    expect(mergeDeep({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('later sources override earlier ones', () => {
    expect(mergeDeep({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('deeply nested merge', () => {
    expect(mergeDeep({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } }))
      .toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  it('should not pollute prototype via __proto__', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    mergeDeep({}, malicious);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });

  it('null source is silently skipped (JS runtime guard)', () => {
    const unsafe = mergeDeep as (...args: unknown[]) => Record<string, unknown>;
    expect(unsafe(null)).toEqual({});
    expect(unsafe({ a: 1 }, null, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('undefined source is silently skipped (JS runtime guard)', () => {
    const unsafe = mergeDeep as (...args: unknown[]) => Record<string, unknown>;
    expect(unsafe(undefined)).toEqual({});
    expect(unsafe({ a: 1 }, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });
});
