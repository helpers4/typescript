/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compact } from './compact';

describe('compact — property-based', () => {
  it('all values in result are truthy', () => {
    fc.assert(
      fc.property(
        fc.record({
          a: fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
          b: fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
          c: fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        }),
        (obj) => {
          const result = compact(obj as Record<string, unknown>);
          for (const value of Object.values(result as Record<string, unknown>)) {
            expect(Boolean(value)).toBe(true);
          }
        }
      )
    );
  });

  it('result keys are a subset of input keys', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.oneof(fc.integer(), fc.string()),
          y: fc.oneof(fc.integer(), fc.string()),
        }),
        (obj) => {
          const result = compact(obj as Record<string, unknown>);
          for (const key of Object.keys(result as object)) {
            expect(Object.keys(obj)).toContain(key);
          }
        }
      )
    );
  });
});

describe('compact — contract', () => {
  it('{} → {}', () => {
    expect(compact({})).toEqual({});
  });

  it('removes all falsy values', () => {
    expect(compact({ a: 0, b: 1, c: false, d: '', e: null, f: 'hello', g: undefined })).toEqual({
      b: 1,
      f: 'hello',
    });
  });

  it('undefined → undefined', () => {
    expect(compact(undefined)).toBeUndefined();
  });

  it('null → null', () => {
    expect(compact(null)).toBeNull();
  });

  it('all truthy values → all keys preserved', () => {
    const obj = { a: 1, b: 'x', c: true };
    expect(compact(obj)).toEqual({ a: 1, b: 'x', c: true });
  });

  it('NaN is falsy — removed', () => {
    expect(compact({ a: NaN, b: 1 })).toEqual({ b: 1 });
  });
});
