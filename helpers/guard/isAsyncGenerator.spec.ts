/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isAsyncGenerator } from './isAsyncGenerator';

describe('isAsyncGenerator — property-based', () => {
  it('primitives are never async generators', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isAsyncGenerator(value)).toBe(false);
      }),
    );
  });
});

describe('isAsyncGenerator — contract', () => {
  it('null → false', () => expect(isAsyncGenerator(null)).toBe(false));
  it('undefined → false', () => expect(isAsyncGenerator(undefined)).toBe(false));
  it('{} → false', () => expect(isAsyncGenerator({})).toBe(false));
  it('sync generator instance → false', () => {
    function* gen() { yield 1; }
    expect(isAsyncGenerator(gen())).toBe(false);
  });
  it('async generator function → false (not an instance)', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGenerator(gen)).toBe(false);
  });
  it('async generator instance → true', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGenerator(gen())).toBe(true);
  });
  it('Promise → false', () => expect(isAsyncGenerator(Promise.resolve())).toBe(false));
});
