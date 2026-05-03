/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { curry } from './curry';

describe('curry — property-based', () => {
  it('curry(f)(a)(b) equals f(a, b) for all inputs', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const fn = (x: number, y: number) => x * 3 + y;
        expect(curry(fn)(a)(b)).toBe(fn(a, b));
      })
    );
  });

  it('curry(f)(a)(b)(c) equals f(a, b, c) for all inputs', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), fc.string(), (a, b, c) => {
        const fn = (x: string, y: string, z: string) => x + y + z;
        expect(curry(fn)(a)(b)(c)).toBe(fn(a, b, c));
      })
    );
  });
});
