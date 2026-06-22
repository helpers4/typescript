/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mergeDeep } from './mergeDeep';

describe('mergeDeep — property-based', () => {
  it('all keys from base appear in result', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ c: fc.integer(), d: fc.string() }),
        (base, source) => {
          const result = mergeDeep(base, source);
          for (const key of Object.keys(base)) {
            expect(key in result).toBe(true);
          }
        }
      )
    );
  });

  it('all keys from sources appear in result', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer() }),
        fc.record({ b: fc.integer() }),
        (base, source) => {
          const result = mergeDeep(base, source);
          for (const key of Object.keys(source)) {
            expect(key in result).toBe(true);
          }
        }
      )
    );
  });

  it('source values override base for same non-undefined key', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (baseVal, sourceVal) => {
        const result = mergeDeep({ a: baseVal }, { a: sourceVal });
        expect(result.a).toBe(sourceVal);
      })
    );
  });

  it('base is never mutated', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ a: fc.integer(), c: fc.string() }),
        (base, source) => {
          const baseSnapshot = JSON.stringify(base);
          mergeDeep(base, source);
          expect(JSON.stringify(base)).toBe(baseSnapshot);
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

  it('no sources → returns new object equal to base', () => {
    const base = { a: 1 };
    const result = mergeDeep(base);
    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(base);
  });

  it('multiple sources merged left to right', () => {
    expect(mergeDeep({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('later sources override earlier ones', () => {
    expect(mergeDeep({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('deeply nested merge', () => {
    expect(mergeDeep({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })).toEqual({
      a: { b: { c: 1, d: 2 } },
    });
  });

  it('should not pollute prototype via __proto__', () => {
    const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
    mergeDeep({}, malicious);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
  });
});
