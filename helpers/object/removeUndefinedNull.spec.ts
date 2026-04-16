/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { removeUndefinedNull } from './removeUndefinedNull';

describe('removeUndefinedNull — property-based', () => {
  it('no null or undefined values in result', () => {
    fc.assert(
      fc.property(
        fc.record({
          a: fc.oneof(fc.integer(), fc.constant(null), fc.constant(undefined)),
          b: fc.oneof(fc.string(), fc.constant(null), fc.constant(undefined)),
          c: fc.oneof(fc.boolean(), fc.constant(null), fc.constant(undefined)),
        }),
        (obj) => {
          const result = removeUndefinedNull(obj);
          for (const value of Object.values(result as object)) {
            expect(value).not.toBeNull();
            expect(value).not.toBeUndefined();
          }
        }
      )
    );
  });

  it('all non-null/non-undefined values from input are preserved', () => {
    fc.assert(
      fc.property(
        fc.record({
          a: fc.integer(),
          b: fc.string(),
          c: fc.boolean(),
        }),
        (obj) => {
          const result = removeUndefinedNull(obj);
          expect(result).toEqual(obj);
        }
      )
    );
  });
});

describe('removeUndefinedNull — contract', () => {
  it('{a:null, b:undefined, c:1, d:"", e:false} → {c:1, d:"", e:false}', () => {
    expect(
      removeUndefinedNull({ a: null, b: undefined, c: 1, d: '', e: false })
    ).toEqual({ c: 1, d: '', e: false });
  });

  it('{} → {}', () => {
    expect(removeUndefinedNull({})).toEqual({});
  });

  it('null → null', () => {
    expect(removeUndefinedNull(null)).toBeNull();
  });

  it('undefined → undefined', () => {
    expect(removeUndefinedNull(undefined)).toBeUndefined();
  });

  it('preserves falsy non-null/non-undefined values (0, false, "")', () => {
    expect(removeUndefinedNull({ a: 0, b: false, c: '' })).toEqual({ a: 0, b: false, c: '' });
  });

  it('all null/undefined → {}', () => {
    expect(removeUndefinedNull({ a: null, b: undefined })).toEqual({});
  });
});
