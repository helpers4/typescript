/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isAsyncGeneratorFunction } from './isAsyncGeneratorFunction';

describe('isAsyncGeneratorFunction — property-based', () => {
  it('primitives are never async generator functions', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isAsyncGeneratorFunction(value)).toBe(false);
      }),
    );
  });
});

describe('isAsyncGeneratorFunction — contract', () => {
  it('null → false', () => expect(isAsyncGeneratorFunction(null)).toBe(false));
  it('undefined → false', () => expect(isAsyncGeneratorFunction(undefined)).toBe(false));
  it('regular function → false', () => expect(isAsyncGeneratorFunction(() => {})).toBe(false));
  it('async function → false', () => expect(isAsyncGeneratorFunction(async () => {})).toBe(false));
  it('sync generator function → false', () => {
    function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen)).toBe(false);
  });
  it('async generator instance → false (not a function)', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen())).toBe(false);
  });
  it('async function* → true', () => {
    async function* gen() { yield 1; }
    expect(isAsyncGeneratorFunction(gen)).toBe(true);
  });
  it('async function* expression → true', () => {
    expect(isAsyncGeneratorFunction(async function* () { yield 1; })).toBe(true);
  });
});
