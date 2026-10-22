/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { negate } from './negate';

describe('negate (property-based)', () => {
  it('negate(pred)(x) is always the opposite of pred(x)', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        const pred = (x: number) => x > 0;
        expect(negate(pred)(n)).toBe(!pred(n));
      }),
    );
  });

  it('double-negate is equivalent to identity for any boolean predicate', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const pred = (x: string) => x.length % 2 === 0;
        expect(negate(negate(pred))(s)).toBe(pred(s));
      }),
    );
  });

  it('negate(pred)(x) XOR pred(x) is always true', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true }), (n) => {
        const pred = (x: number) => x >= 0;
        expect(negate(pred)(n) !== pred(n)).toBe(true);
      }),
    );
  });
});
