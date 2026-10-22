/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { extractNumber } from './extractNumber';

const word = fc.stringMatching(/^[a-z]{1,10}$/);
const magnitude = fc.integer({ min: 1, max: 1_000_000 });

describe('extractNumber — property-based', () => {
  it('round-trips a plain integer, as a number or as its string form', () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(extractNumber(n)).toBe(n);
        expect(extractNumber(String(n))).toBe(n);
      }),
    );
  });

  it('sign "auto": a "-" glued to preceding text is a separator, not a sign', () => {
    fc.assert(
      fc.property(word, magnitude, (w, n) => {
        expect(extractNumber(`${w}-${n}`)).toBe(n);
      }),
    );
  });

  it('sign "auto": a "-" preceded by whitespace is a minus sign', () => {
    fc.assert(
      fc.property(word, magnitude, (w, n) => {
        expect(extractNumber(`${w} -${n}`)).toBe(-n);
      }),
    );
  });

  it('sign "ignore": always returns a non-negative magnitude', () => {
    fc.assert(
      fc.property(fc.boolean(), magnitude, (leadingSpace, n) => {
        const text = leadingSpace ? ` -${n}` : `-${n}`;
        expect(extractNumber(text, { sign: 'ignore' })).toBe(n);
      }),
    );
  });

  it('sign "strict": always returns a negative number when "-" precedes the digits', () => {
    fc.assert(
      fc.property(word, magnitude, (w, n) => {
        expect(extractNumber(`${w}-${n}`, { sign: 'strict' })).toBe(-n);
      }),
    );
  });
});
