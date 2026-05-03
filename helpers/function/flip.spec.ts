/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { flip } from './flip';

describe('flip (property-based)', () => {
  it('double-flip is equivalent to identity for any two integers', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        const fn = (x: number, y: number) => x * 2 - y;
        expect(flip(flip(fn))(a, b)).toBe(fn(a, b));
      }),
    );
  });

  it('flip(fn)(b, a) === fn(a, b) for any two strings', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (a, b) => {
        const fn = (x: string, y: string) => `${x}|${y}`;
        expect(flip(fn)(b, a)).toBe(fn(a, b));
      }),
    );
  });

  it('flip is its own inverse: flip(fn)(b, a) produces same result as fn(a, b)', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), fc.integer(), (a, b, c) => {
        const fn = (x: number, y: number, z: number) => x + y * 2 + z * 3;
        expect(flip(fn)(b, a, c)).toBe(fn(a, b, c));
      }),
    );
  });
});
