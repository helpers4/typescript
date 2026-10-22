/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isWeakMapKey } from './isWeakMapKey';

describe('isWeakMapKey — property-based', () => {
  it('any object always passes and is actually a valid WeakMap key', () => {
    fc.assert(
      fc.property(fc.object(), (obj) => {
        expect(isWeakMapKey(obj)).toBe(true);
        expect(() => new WeakMap().set(obj, 1)).not.toThrow();
      }),
    );
  });

  it('every primitive except unregistered symbols is rejected', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string(), fc.integer(), fc.boolean(), fc.constant(null), fc.constant(undefined), fc.bigInt()), (value) => {
        expect(isWeakMapKey(value)).toBe(false);
      }),
    );
  });

  it('agrees with whether WeakMap.prototype.set actually throws', () => {
    fc.assert(
      fc.property(fc.oneof(fc.object(), fc.string(), fc.integer(), fc.constant(null)), (value) => {
        const wm = new WeakMap();
        let threw = false;
        try {
          wm.set(value as object, 1);
        } catch {
          threw = true;
        }
        expect(isWeakMapKey(value)).toBe(!threw);
      }),
    );
  });
});

describe('isWeakMapKey — contract', () => {
  it('{} → true', () => expect(isWeakMapKey({})).toBe(true));
  it('[] → true', () => expect(isWeakMapKey([])).toBe(true));
  it('function → true', () => expect(isWeakMapKey(function named() {})).toBe(true));
  it('class instance → true', () => expect(isWeakMapKey(new (class {})())).toBe(true));
  it('Symbol() → true', () => expect(isWeakMapKey(Symbol())).toBe(true));
  it('Symbol.for(...) → false', () => expect(isWeakMapKey(Symbol.for('spec-key'))).toBe(false));
  it('0 → false', () => expect(isWeakMapKey(0)).toBe(false));
  it("'' → false", () => expect(isWeakMapKey('')).toBe(false));
  it('NaN → false', () => expect(isWeakMapKey(NaN)).toBe(false));
});
