/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { truthyPromiseOrThrow } from './truthyPromiseOrThrow';

describe('truthyPromiseOrThrow — property-based', () => {
  it('any truthy value passes through', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 1 }),
          fc.string({ minLength: 1 }),
          fc.boolean().filter(b => b),
        ),
        (value: unknown) => {
          const fn = truthyPromiseOrThrow<unknown>('err');
          expect(fn(value)).toBe(value);
        },
      ),
    );
  });

  it('any falsy value throws', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant(0),
          fc.constant(''),
          fc.constant(false),
        ),
        (value: unknown) => {
          const fn = truthyPromiseOrThrow<unknown>('should throw');
          expect(() => fn(value)).toThrow('should throw');
        },
      ),
    );
  });
});

describe('truthyPromiseOrThrow — contract', () => {
  const fn = truthyPromiseOrThrow<unknown>('err');

  it('1 → 1', () => { expect(fn(1)).toBe(1); });
  it('"hello" → "hello"', () => { expect(fn('hello')).toBe('hello'); });
  it('{} → {} (same reference)', () => {
    const obj = {};
    expect(fn(obj)).toBe(obj);
  });

  it('null → throws', () => { expect(() => fn(null)).toThrow('err'); });
  it('undefined → throws', () => { expect(() => fn(undefined)).toThrow('err'); });
  it('0 → throws', () => { expect(() => fn(0)).toThrow('err'); });
  it('"" → throws', () => { expect(() => fn('')).toThrow('err'); });
  it('false → throws', () => { expect(() => fn(false)).toThrow('err'); });

  it('throws an Error instance', () => {
    expect(() => fn(null)).toThrowError(Error);
  });
});
