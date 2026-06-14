/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isGeneratorFunction } from './isGeneratorFunction';

describe('isGeneratorFunction — property-based', () => {
  it('primitives are never generator functions', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isGeneratorFunction(value)).toBe(false);
      }),
    );
  });
});

describe('isGeneratorFunction — contract', () => {
  it('null → false', () => expect(isGeneratorFunction(null)).toBe(false));
  it('undefined → false', () => expect(isGeneratorFunction(undefined)).toBe(false));
  it('regular function → false', () => expect(isGeneratorFunction(() => {})).toBe(false));
  it('async function → false', () => expect(isGeneratorFunction(async () => {})).toBe(false));
  it('generator instance → false (not a function)', () => {
    function* gen() { yield 1; }
    expect(isGeneratorFunction(gen())).toBe(false);
  });
  it('async generator function → false', () => {
    async function* gen() { yield 1; }
    expect(isGeneratorFunction(gen)).toBe(false);
  });
  it('function* → true', () => {
    function* gen() { yield 1; }
    expect(isGeneratorFunction(gen)).toBe(true);
  });
  it('function* expression → true', () => {
    expect(isGeneratorFunction(function* () { yield 1; })).toBe(true);
  });
});
