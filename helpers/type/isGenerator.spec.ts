/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isGenerator } from './isGenerator';

describe('isGenerator — property-based', () => {
  it('primitives are never generators', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean()), (value) => {
        expect(isGenerator(value)).toBe(false);
      }),
    );
  });
});

describe('isGenerator — contract', () => {
  it('null → false', () => expect(isGenerator(null)).toBe(false));
  it('undefined → false', () => expect(isGenerator(undefined)).toBe(false));
  it('{} → false', () => expect(isGenerator({})).toBe(false));
  it('[] → false', () => expect(isGenerator([])).toBe(false));
  it('regular function → false', () => expect(isGenerator(() => {})).toBe(false));
  it('generator function → false (not an instance)', () => {
    function* gen() { yield 1; }
    expect(isGenerator(gen)).toBe(false);
  });
  it('generator instance → true', () => {
    function* gen() { yield 1; }
    expect(isGenerator(gen())).toBe(true);
  });
  it('async generator instance → false', () => {
    async function* gen() { yield 1; }
    expect(isGenerator(gen())).toBe(false);
  });
  it('array iterator → false', () => {
    expect(isGenerator([1][Symbol.iterator]())).toBe(false);
  });
});
