/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { deepMerge } from './deepMerge';

describe('deepMerge — property-based', () => {
  it('all keys from target appear in result', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        fc.record({ c: fc.integer(), d: fc.string() }),
        (target, source) => {
          const result = deepMerge({ ...target }, source);
          for (const key of Object.keys(target)) {
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
        (target, source) => {
          const result = deepMerge({ ...target }, source);
          for (const key of Object.keys(source)) {
            expect(key in result).toBe(true);
          }
        }
      )
    );
  });

  it('source values override target for same non-undefined key', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (targetVal, sourceVal) => {
        const result = deepMerge({ a: targetVal }, { a: sourceVal });
        expect(result.a).toBe(sourceVal);
      })
    );
  });
});

describe('deepMerge — contract', () => {
  it('deepMerge({a:1}, {a:2}) → {a:2}', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('deepMerge({a:{b:1}}, {a:{c:2}}) → {a:{b:1,c:2}}', () => {
    expect(deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
  });

  it('deepMerge({a:1}, {a:undefined}) → {a:1} (undefined does not overwrite)', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
  });

  it('empty sources → returns target unchanged', () => {
    expect(deepMerge({ a: 1 })).toEqual({ a: 1 });
  });

  it('multiple sources merged left to right', () => {
    expect(deepMerge({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('later sources override earlier ones', () => {
    expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('undefined target → undefined', () => {
    expect(deepMerge(undefined, { a: 1 })).toBeUndefined();
  });

  it('null target → null', () => {
    expect(deepMerge(null, { a: 1 })).toBeNull();
  });

  it('deeply nested merge', () => {
    expect(deepMerge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })).toEqual({
      a: { b: { c: 1, d: 2 } },
    });
  });
});
