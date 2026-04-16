/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { meaningPromiseOrThrow } from './meaningPromiseOrThrow';

const MEANINGLESS_VALUES = [null, undefined, '', {}, []] as const;

describe('meaningPromiseOrThrow — property-based', () => {
  it('non-meaningless primitive values pass through', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 1 }),
          fc.string({ minLength: 1 }),
          fc.boolean(),
        ),
        (value: unknown) => {
          const fn = meaningPromiseOrThrow<unknown>('err');
          expect(fn(value)).toBe(value);
        },
      ),
    );
  });

  it('non-empty objects pass through', () => {
    fc.assert(
      fc.property(
        fc.record({ key: fc.string({ minLength: 1 }) }),
        (obj: { key: string }) => {
          const fn = meaningPromiseOrThrow<unknown>('err');
          expect(fn(obj)).toBe(obj);
        },
      ),
    );
  });

  it('non-empty arrays pass through', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer(), { minLength: 1 }),
        (arr: number[]) => {
          const fn = meaningPromiseOrThrow<unknown>('err');
          expect(fn(arr)).toBe(arr);
        },
      ),
    );
  });
});

describe('meaningPromiseOrThrow — contract', () => {
  const fn = meaningPromiseOrThrow<unknown>('meaningless');

  it.each(MEANINGLESS_VALUES)('throws for meaningless value: %s', (value) => {
    expect(() => fn(value)).toThrow('meaningless');
  });

  it('null → throws', () => {
    expect(() => fn(null)).toThrow();
  });

  it('undefined → throws', () => {
    expect(() => fn(undefined)).toThrow();
  });

  it('"" → throws', () => {
    expect(() => fn('')).toThrow();
  });

  it('{} → throws', () => {
    expect(() => fn({})).toThrow();
  });

  it('[] → throws', () => {
    expect(() => fn([])).toThrow();
  });

  it('"hello" → passes', () => {
    expect(fn('hello')).toBe('hello');
  });

  it('{a:1} → passes', () => {
    const obj = { a: 1 };
    expect(fn(obj)).toBe(obj);
  });

  it('[1] → passes', () => {
    const arr = [1];
    expect(fn(arr)).toBe(arr);
  });

  it('0 → passes (falsy but not meaningless)', () => {
    expect(fn(0)).toBe(0);
  });

  it('false → passes (falsy but not meaningless)', () => {
    expect(fn(false)).toBe(false);
  });
});
