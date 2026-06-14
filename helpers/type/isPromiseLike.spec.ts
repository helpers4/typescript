/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isPromiseLike } from './isPromiseLike';

describe('isPromiseLike — property-based', () => {
  it('primitives are never PromiseLike', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isPromiseLike(value)).toBe(false);
      }),
    );
  });
});

describe('isPromiseLike — contract', () => {
  it('null → false', () => expect(isPromiseLike(null)).toBe(false));
  it('undefined → false', () => expect(isPromiseLike(undefined)).toBe(false));
  it('Promise.resolve() → true', () => expect(isPromiseLike(Promise.resolve())).toBe(true));
  it('{ then: fn } → true', () => expect(isPromiseLike({ then: () => {} })).toBe(true));
  it('{ then: non-fn } → false', () => expect(isPromiseLike({ then: 42 })).toBe(false));
  it('{} → false', () => expect(isPromiseLike({})).toBe(false));
  it('function with .then → true', () => {
    const fn = Object.assign(() => {}, { then: () => {} });
    expect(isPromiseLike(fn)).toBe(true);
  });
  it('function without .then → false', () => {
    expect(isPromiseLike(() => {})).toBe(false);
  });
});
