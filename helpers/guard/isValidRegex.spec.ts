/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isValidRegex } from './isValidRegex';

describe('isValidRegex — property-based', () => {
  it('result is always boolean', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(typeof isValidRegex(s)).toBe('boolean');
      }),
    );
  });

  it('simple alphanumeric strings are always valid regexes', () => {
    fc.assert(
      fc.property(fc.stringMatching(/^[a-zA-Z0-9 ]+$/), (s: string) => {
        expect(isValidRegex(s)).toBe(true);
      }),
    );
  });
});

describe('isValidRegex — contract', () => {
  it("'foo' → true", () => expect(isValidRegex('foo')).toBe(true));
  it("'[a-z]' → true", () => expect(isValidRegex('[a-z]')).toBe(true));
  it("'' → true (empty regex is valid)", () => expect(isValidRegex('')).toBe(true));
  it("'\\\\d+' → true", () => expect(isValidRegex('\\d+')).toBe(true));
  it("'(' → false (unmatched paren)", () => expect(isValidRegex('(')).toBe(false));
  it("'*' → false (quantifier without atom)", () => expect(isValidRegex('*')).toBe(false));
});
