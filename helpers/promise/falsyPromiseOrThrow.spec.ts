/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { falsyPromiseOrThrow } from './falsyPromiseOrThrow';

const FALSY_VALUES = [null, undefined, 0, '', false, NaN] as const;
const TRUTHY_VALUES = [1, 'hello', {}, [], true, -1, ' '] as const;

describe('falsyPromiseOrThrow — property-based', () => {
  it('any falsy value passes through without throwing', () => {
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
          const fn = falsyPromiseOrThrow<unknown>('error');
          expect(() => fn(value)).not.toThrow();
          expect(fn(value)).toBe(value);
        },
      ),
    );
  });

  it('any truthy value throws', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.integer({ min: 1 }),
          fc.string({ minLength: 1 }),
          fc.boolean().filter(b => b),
        ),
        (value: unknown) => {
          const fn = falsyPromiseOrThrow<unknown>('should throw');
          expect(() => fn(value)).toThrow('should throw');
        },
      ),
    );
  });
});

describe('falsyPromiseOrThrow — contract', () => {
  const fn = falsyPromiseOrThrow<unknown>('err');

  it.each(FALSY_VALUES)('passes through falsy value: %s', (value) => {
    expect(fn(value)).toBe(value);
  });

  it.each(TRUTHY_VALUES)('throws for truthy value: %s', (value) => {
    expect(() => fn(value)).toThrow('err');
  });

  it('throws an Error instance', () => {
    expect(() => fn(1)).toThrowError(Error);
  });

  it('error message matches the provided string', () => {
    const custom = falsyPromiseOrThrow<unknown>('custom message');
    expect(() => custom(1)).toThrow('custom message');
  });
});
