/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { isSymbol } from './isSymbol';
import { isPrimitive } from './isPrimitive';

describe('isSymbol — property-based', () => {
  it('isSymbol(v) → isPrimitive(v)', () => {
    const sym = Symbol('test');
    expect(isSymbol(sym)).toBe(true);
    expect(isPrimitive(sym)).toBe(true);
  });

  it('strings are never symbols', () => {
    fc.assert(
      fc.property(fc.string(), (v) => {
        expect(isSymbol(v)).toBe(false);
      }),
    );
  });

  it('numbers are never symbols', () => {
    fc.assert(
      fc.property(fc.double(), (v) => {
        expect(isSymbol(v)).toBe(false);
      }),
    );
  });
});

describe('isSymbol — contract', () => {
  it('Symbol() → true', () => expect(isSymbol(Symbol())).toBe(true));
  it("Symbol('desc') → true", () => expect(isSymbol(Symbol('desc'))).toBe(true));
  it('Symbol.iterator → true', () => expect(isSymbol(Symbol.iterator)).toBe(true));
  it("'symbol' → false", () => expect(isSymbol('symbol')).toBe(false));
  it('null → false', () => expect(isSymbol(null)).toBe(false));
  it('undefined → false', () => expect(isSymbol(undefined)).toBe(false));
  it('{} → false', () => expect(isSymbol({})).toBe(false));
});

describe('isSymbol — narrowing in if/else', () => {
  it('narrows the value to symbol in the then-branch', () => {
    const v: unknown = Symbol('s');
    if (isSymbol(v)) {
      expectTypeOf(v).toEqualTypeOf<symbol>();
      expect(typeof v).toBe('symbol');
    } else {
      throw new Error('expected then-branch');
    }
    expect(isSymbol('s')).toBe(false);
  });
});
