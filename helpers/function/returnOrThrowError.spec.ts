/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { returnOrThrowError } from './returnOrThrowError';

describe('returnOrThrowError — property-based', () => {
  it('for any non-null/non-undefined value, returns it unchanged', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer(),
          fc.float({ noNaN: true }),
          fc.string(),
          fc.boolean(),
          fc.record({ a: fc.integer() })
        ),
        (value) => {
          const result = returnOrThrowError(value, 'error');
          expect(result).toBe(value);
        }
      )
    );
  });
});

describe('returnOrThrowError — contract', () => {
  it('null → throws Error', () => {
    expect(() => returnOrThrowError(null, 'got null')).toThrow('got null');
  });

  it('undefined → throws Error', () => {
    expect(() => returnOrThrowError(undefined, 'got undefined')).toThrow('got undefined');
  });

  it('0 → returns 0 (falsy but not nullish)', () => {
    expect(returnOrThrowError(0, 'error')).toBe(0);
  });

  it('false → returns false (falsy but not nullish)', () => {
    expect(returnOrThrowError(false, 'error')).toBe(false);
  });

  it("'' → returns '' (falsy but not nullish)", () => {
    expect(returnOrThrowError('', 'error')).toBe('');
  });

  it('{} → returns {} (same reference)', () => {
    const obj = {};
    expect(returnOrThrowError(obj, 'error')).toBe(obj);
  });

  it('thrown error uses the provided error message', () => {
    expect(() => returnOrThrowError(null, 'custom message')).toThrow(Error);
    expect(() => returnOrThrowError(null, 'custom message')).toThrow('custom message');
  });
});
