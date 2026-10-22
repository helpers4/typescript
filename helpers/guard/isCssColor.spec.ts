/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isCssColor } from './isCssColor';

describe('isCssColor — property-based', () => {
  it('result is always boolean', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(typeof isCssColor(s)).toBe('boolean');
      }),
    );
  });

  it('accepts any hex color of length 3, 4, 6, or 8', () => {
    const hexChar = fc.constantFrom(..."0123456789abcdefABCDEF".split(''));
    fc.assert(
      fc.property(
        fc.constantFrom(3, 4, 6, 8).chain((len) => fc.string({ unit: hexChar, minLength: len, maxLength: len })),
        (hex) => {
          expect(isCssColor(`#${hex}`)).toBe(true);
        },
      ),
    );
  });

  it('never accepts a value containing a semicolon, brace, or backslash', () => {
    fc.assert(
      fc.property(fc.string(), fc.constantFrom(';', '{', '}', '\\'), fc.string(), (pre, bad, post) => {
        expect(isCssColor(pre + bad + post)).toBe(false);
      }),
    );
  });
});

describe('isCssColor — contract', () => {
  it("'#000' → true", () => expect(isCssColor('#000')).toBe(true));
  it("'blue' → true", () => expect(isCssColor('blue')).toBe(true));
  it("'rgb(0,0,0)' → true", () => expect(isCssColor('rgb(0,0,0)')).toBe(true));
  it("'123' → false (digits alone are not a named color)", () => expect(isCssColor('123')).toBe(false));
  it("'#12g' → false (invalid hex digit)", () => expect(isCssColor('#12g')).toBe(false));
});
