/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isString } from './isString';

describe('isString — property-based', () => {
  it('string primitives always pass and have .length', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isString(s)).toBe(true);
        expect(typeof s.length).toBe('number');
      }),
    );
  });

  it('numbers are never strings', () => {
    fc.assert(
      fc.property(fc.double(), (v) => {
        expect(isString(v)).toBe(false);
      }),
    );
  });

  it('booleans are never strings', () => {
    fc.assert(
      fc.property(fc.boolean(), (v) => {
        expect(isString(v)).toBe(false);
      }),
    );
  });
});

describe('isString — contract', () => {
  it("'hello' → true", () => expect(isString('hello')).toBe(true));
  it("'' → true", () => expect(isString('')).toBe(true));
  it("new String('x') → false (object wrapper)", () => expect(isString(new String('x'))).toBe(false));
  it('42 → false', () => expect(isString(42)).toBe(false));
  it('null → false', () => expect(isString(null)).toBe(false));
  it('undefined → false', () => expect(isString(undefined)).toBe(false));
  it('true → false', () => expect(isString(true)).toBe(false));
});
